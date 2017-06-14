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
AuthRouter
.post('/', async (ctx) => {
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
            select: '_id username avatar',
        },
        {
            path: 'creator',
            select: '_id username',
        },
    ];
    for (const group of user.groups) {
        await Group.populate(group, groupOpts);
        const messages = await Message.find({ to: group._id }).populate({ path: 'from', select: '_id username avatar pluginData' });
        if (messages.length > 30) {
            messages.splice(0, messages.length - 30);
        }
        group._doc.messages = messages || [];
    }

    const token = jwt.encode({ userId: user._id, expires: Date.now() + (1000 * 60 * 60 * 24 * 7) }, config.jwtSecret);
    ctx.socket.token = token;

    await Socket.update({
        socket: ctx.socket.id,
    }, {
        $set: {
            user: user._id,
            token,
        },
    });

    for (const group of user.groups) {
        ctx.socket.socket.join(group._id);
    }

    ctx.res(201, { user, token });
})
.put('/', async (ctx) => {
    const { token } = ctx.params;
    assert(!token, 400, '需要token');

    let payload = null;
    try {
        payload = jwt.decode(token, config.jwtSecret);
    } catch (err) {
        if (err.message === 'Signature verification failed') {
            ctx.res(401, 'invalid token');
            return false;
        }
        ctx.res(500, 'server error when parse token');
        return false;
    }

    const user = await User.findOne({ _id: payload.userId }, '-salt');
    assert(!user, 404, '该用户不存在');

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
            select: '_id username avatar',
        },
        {
            path: 'creator',
            select: '_id username',
        },
    ];
    for (const group of user.groups) {
        await Group.populate(group, groupOpts);
        const messages = await Message.find({ toGroup: group._id }).populate({ path: 'from', select: '_id username avatar pluginData' });
        if (messages.length > 30) {
            messages.splice(0, messages.length - 30);
        }
        group._doc.messages = messages || [];
    }

    ctx.socket.token = token;
    ctx.socket.user = user._id;

    await Socket.update({
        socket: ctx.socket.id,
    }, {
        $set: {
            user: user._id,
            token,
        },
    });

    for (const group of user.groups) {
        ctx.socket.socket.join(group._id);
    }

    ctx.res(201, { user });
});

module.exports = AuthRouter;
