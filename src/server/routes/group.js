const mongoose = require('mongoose');

const Router = require('../../core/socketRouter');
const assert = require('../../utils/assert');
const config = require('../../../config/index').project;

const Group = require('../models/group');
const User = require('../models/user');

const modelTool = require('../../utils/model');

const GroupRouter = new Router({ prefix: '/group' });
GroupRouter
.post('/', async (ctx) => {
    const { name } = ctx.params;
    assert(!name, 400, '没有群组名');

    const ownedGroup = await Group.find({ creator: ctx.socket.user });
    assert(ownedGroup.length === config.maxGroupNumber, 400, `最多允许创建${config.maxGroupNumber}个群组`);

    const user = await User.findById(ctx.socket.user);
    const newGroup = new Group({
        name,
        creator: user,
        members: [user],
    });

    let savedGroup = null;
    try {
        savedGroup = await newGroup.save();
        newGroup._doc.messages = [];
    } catch (err) {
        if (err.code === 11000) {
            return ctx.res(400, '群组名已存在');
        } else if (err.message === 'Group validation failed') {
            return ctx.res(400, '群组名不合法');
        }
        throw err;
    }

    await modelTool.populateGroupMessage(savedGroup);
    await modelTool.populateGroupOnline(savedGroup);
    await modelTool.populateGroupInfo(savedGroup);

    ctx.res(201, savedGroup);
})
.get('/search', async (ctx) => {
    const { groupName } = ctx.params;
    assert(!groupName, 400, '请输入要查找的群组名');

    const groups = await Group.find({ name: { $regex: groupName } }, '_id avatar name members');
    const data = groups.map(({ _id, avatar, name, members }) => ({
        _id,
        avatar,
        name,
        members: members.length,
    }));
    ctx.res(200, data);
})
.post('/join', async (ctx) => {
    const { groupId } = ctx.params;
    assert(!groupId, 400, '没有群组id');
    assert(!mongoose.Types.ObjectId.isValid(groupId), 400, '群组id不合法');

    const group = await Group.findById(groupId);
    assert(!group, 400, '群组不存在');
    assert(group.members.indexOf(ctx.socket.user) !== -1, 400, '你已在群组中');
    group.members.push(ctx.socket.user);
    await group.save();
    await modelTool.populateGroupMessage(group);
    await modelTool.populateGroupOnline(group);
    await modelTool.populateGroupInfo(group);

    ctx.res(201, group);
})
.get('/online', async (ctx) => {
    const { groupId } = ctx.params;
    assert(!groupId, 400, '没有群组id');
    assert(!mongoose.Types.ObjectId.isValid(groupId), 400, '群组id不合法');

    const group = await Group.findById(groupId);
    assert(!group, 400, '群组不存在');
    await modelTool.populateGroupOnline(group);

    ctx.res(200, group.onlines);
});

module.exports = GroupRouter;
