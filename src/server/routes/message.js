const mongoose = require('mongoose');
const fileType = require('file-type');

const Router = require('../../core/socketRouter');
const assert = require('../../utils/assert');
const config = require('../../../config/server');

const User = require('../models/user');
const Group = require('../models/group');
const Message = require('../models/message');
const qiniuTool = require('../../utils/qiniu');

let count = { };
const MaxMessageLimit = 10; // every mimute
(
    function clear() {
        count = { };
        setTimeout(clear, 1000 * 60);
    }()
);
function judgeFrequency(userId) {
    // 5835984b5fe025750e972349 -> fiora数据库中robot10的id
    // 去掉机器人的消息频率限制
    // if (userId === '5835984b5fe025750e972349') {
    //     return true;
    // }
    if (count[userId] === undefined) {
        count[userId] = 1;
        return true;
    } else if (count[userId] < MaxMessageLimit) {
        count[userId]++;
        return true;
    }
    return false;
}

const MessageRouter = new Router({ prefix: '/message' });
MessageRouter
.post('/', async (ctx) => {
    const { linkman, linkmanType, message } = ctx.params;
    if (!judgeFrequency(ctx.socket.user)) {
        return ctx.res(401, 'send messages too frequently');
    }

    assert(!linkman, 400, 'need linkman param but not exists');
    assert(!linkmanType, 400, 'need linkmanType param but not exists');
    assert(!message, 400, 'need message param but not exists');
    assert(!mongoose.Types.ObjectId.isValid(linkman), 400, 'linkmanId is invalid');

    if (message.type === 'text') {
        message.content = message.content.slice(0, config.maxMessageLength);
    } else if (message.type === 'image') {
        const type = fileType(message.content);
        message.content = await qiniuTool.uploadBytes(`message_${Date.now()}.${type.ext}`, message.content);
    } else if (message.type === 'file') {
        const fileUrl = await qiniuTool.uploadBytes(message.content.name, message.content.data);
        message.content = JSON.stringify({
            name: message.content.name,
            url: fileUrl,
            size: message.content.data.byteLength,
        });
    }

    const user = await User.findById(ctx.socket.user);
    assert(!user, 400, 'socket对象没有user id');
    let newMessage = null;
    let toGroup = null;
    // let toUser = null;
    if (linkmanType === 'group') {
        toGroup = await Group.findById(linkman);
        assert(!toGroup, 400, 'group not exits');

        newMessage = new Message({
            from: user,
            toGroup,
            type: message.type,
            content: message.content,
        });
    } else {
        return ctx.res(400, 'linkmanType invalid');
    }

    let savedMessage = null;
    try {
        savedMessage = await newMessage.save();
    } catch (err) {
        if (/`.+` is not a valid enum value for path `type`/.test(err.message)) {
            return ctx.res(400, 'message type is invalid');
        }
        return ctx.res(500, 'server error when save new message');
    }

    await Message.populate(savedMessage, [
        { path: 'from', select: '_id username avatar' },
    ]);
    savedMessage._doc.toGroup = toGroup._id;

    if (linkmanType === 'group') {
        ctx.socket.socket.to(toGroup._id.toString()).emit('message', savedMessage);
    }
    ctx.res(201, savedMessage);
})
.get('/history', async (ctx) => {
    const { linkman, linkmanType, messageCount } = ctx.params;
    assert(!linkman, 400, 'need groupId param but not exists');
    assert(!linkmanType, 400, 'need linkmanType param but not exists');
    assert(!messageCount, 400, 'need messageCount param but not exists');
    assert(!mongoose.Types.ObjectId.isValid(linkman), 400, 'groupId is invalid');

    if (linkmanType !== 'group') {
        return ctx.res(400, 'unsupport linkman type');
    }
    let messages = await Message.find({ toGroup: linkman }, null, { sort: '-createTime', skip: messageCount, limit: 30 });
    await Message.populate(messages, [
        { path: 'from', select: '_id username avatar' },
    ]);
    messages = messages.reverse();

    ctx.res(200, messages);
});

module.exports = MessageRouter;
