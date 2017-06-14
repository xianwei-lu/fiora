const mongoose = require('mongoose');

const Router = require('../../core/socketRouter');
const assert = require('../../utils/assert');
const config = require('../../../config/index').project;

const User = require('../models/user');
const Group = require('../models/group');
const Message = require('../models/message');

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
    }
    // else if (data.type === 'image') {
    //     if (/^data:image/.test(data.content)) {
    //         const fileName = `message_${Date.now().toString()}.${data.content.match(/data:image\/(.+);base64/)[1]}`;
    //         data.content = yield* imageUtil.saveImageData(fileName, data.content);
    //     }
    // }

    const user = await User.findById(ctx.socket.user);
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
        return ctx.res(500, 'server error when save new message');
    }

    await Message.populate(savedMessage, [
        { path: 'from', select: '_id username avatar' },
        { path: 'toUser', select: '_id username avatar' },
        { path: 'toGroup', select: '_id name avatar' },
    ]);

    if (linkmanType === 'group') {
        ctx.socket.socket.to(toGroup._id.toString()).emit('message', savedMessage);
    }
    ctx.res(201, savedMessage);
});

module.exports = MessageRouter;
