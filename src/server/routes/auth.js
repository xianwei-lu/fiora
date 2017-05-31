const mongoose = require('mongoose');
const bluebird = require('bluebird');
const bcrypt = bluebird.promisifyAll(require('bcrypt'), { suffix: '$' });
const jwt = require('jwt-simple');

const Router = require('../../core/socketRouter');
const assert = require('../../utils/assert');

const User = require('../models/user');
const Group = require('../models/group');
const Socket = require('../models/socket');
const Message = require('../models/message');

const config = require('../../../config/index').project;

const AuthRouter = new Router({ prefix: '/auth' });
AuthRouter.post('/', async (ctx) => {
    const { username, password } = ctx.params;
    assert(!username, 400, '用户名不能为空');
    assert(!password, 400, '密码不能为空');

    const user = await User.findOne({ username }, '-salt');
    assert(!user, 404, '该用户不存在');
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    assert(!isPasswordCorrect, 400, '密码不正确');
    user.password = undefined;

    const userOpts = [
        {
            path: 'groups',
        },
        {
            path: 'friends',
        },
    ];
    await User.populate(user, userOpts);

    const groupOpts = [
        {
            path: 'members',
            select: {
                _id: true,
                avatar: true,
                username: true,
            },
        },
    ];
    for (const group of user.groups) {
        await Group.populate(group, groupOpts);
        const messages = await Message.find({ to: group._id }).populate({ path: 'from', select: '_id username avatar pluginData' });
        if (messages.length > 30) {
            messages.splice(0, messages.length - 30);
        }
        group.messages = messages;
        await Group.populate(group, { path: 'creator', select: '_id username' });
    }

    await Socket.update({
        socket: ctx.socket.id,
    }, {
        $set: {
            user: user._id,
        },
    });

    for (const group of user.groups) {
        ctx.socket.socket.join(group._id);
    }

    const token = jwt.encode({ userId: user._id, expires: Date.now() + (1000 * 60 * 60 * 24 * 7) }, config.jwtSecret);
    ctx.res(201, { user, token });
});

module.exports = AuthRouter;
