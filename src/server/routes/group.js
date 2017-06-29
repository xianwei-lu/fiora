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
        newGroup._doc.messages = [];
    } catch (err) {
        if (err.code === 11000) {
            return ctx.res(400, '群组名已存在');
        } else if (err.message === 'Group validation failed') {
            return ctx.res(400, '群组名不合法');
        }
        throw err;
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

    ctx.res(201, savedGroup);
});

module.exports = GroupRouter;
