const mongoose = require('mongoose');

const Router = require('../../core/socketRouter');
const assert = require('../../utils/assert');
const config = require('../../../config/index').project;

const Group = require('../models/group');
const User = require('../models/user');

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
        user.groups.push(savedGroup);
        await user.save();
    } catch (err) {
        if (err.code === 11000) {
            return this.end(400, '用户名已存在');
        } else if (err.message === 'Group validation failed') {
            return this.end(400, '用户名不合法');
        }
        return this.end(500, 'server error when save new group');
    }

    const groupOpts = [
        {
            path: 'members',
            select: '_id avatar username',
        },
        {
            path: 'creator',
            select: '_id username',
        },
    ];
    await Group.populate(savedGroup, groupOpts);

    this.end(201, savedGroup);
});

module.exports = GroupRouter;
