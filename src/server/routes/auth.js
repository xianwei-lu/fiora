const bluebird = require('bluebird');
const bcrypt = bluebird.promisifyAll(require('bcrypt'), { suffix: '$' });
const jwt = require('jwt-simple');

const Router = require('../../core/socketRouter');
const assert = require('../../utils/assert');

const User = require('../models/user');
const Group = require('../models/group');
const Socket = require('../models/socket');

const modelTool = require('../../utils/model');

const config = require('../../../config/server');

async function populateUser(user) {
    user.groups = await Group.find({ members: user._id });
    for (const group of user.groups) {
        await modelTool.populateGroupMessage(group);
        await modelTool.populateGroupOnline(group);
        await modelTool.populateGroupInfo(group);
    }
    user._doc.groups = user.groups;
}


const AuthRouter = new Router({ prefix: '/auth' });
AuthRouter
.post('/', async (ctx) => {
    const { username, password, os, browser, description } = ctx.params;
    assert(!username, 400, '用户名不能为空');
    assert(!password, 400, '密码不能为空');

    const user = await User.findOne({ username }, '-salt');
    assert(!user, 404, '该用户不存在');
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    assert(!isPasswordCorrect, 400, '密码不正确');
    user.password = undefined;

    const token = jwt.encode({ userId: user._id, expires: Date.now() + (1000 * 60 * 60 * 24 * 3) }, config.jwtSecret);
    ctx.socket.token = token;

    await Socket.update({
        socket: ctx.socket.id,
    }, {
        $set: {
            user: user._id,
            token,
            os,
            browser,
            description,
        },
    });

    await populateUser(user);

    for (const group of user.groups) {
        ctx.socket.socket.join(group._id);
    }

    ctx.res(201, { user, token });
})
.put('/', async (ctx) => {
    const { token, os, browser, description } = ctx.params;
    assert(!token, 400, '需要token');

    let payload = null;
    try {
        payload = jwt.decode(token, config.jwtSecret);
        if (payload.expires < Date.now()) {
            return ctx.res(403, 'token过期了');
        }
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
    user.password = undefined;

    const newToken = jwt.encode({ userId: user._id, expires: Date.now() + (1000 * 60 * 60 * 24 * 3) }, config.jwtSecret);
    ctx.socket.token = newToken;
    ctx.socket.user = user._id;

    await Socket.update({
        socket: ctx.socket.id,
    }, {
        $set: {
            user: user._id,
            token,
            os,
            browser,
            description,
        },
    });
    await populateUser(user);

    for (const group of user.groups) {
        ctx.socket.socket.join(group._id);
    }

    ctx.res(201, { user, token: newToken });
})
.post('/guest', async (ctx) => {
    const { groupName } = ctx.params;
    assert(typeof groupName !== 'string', 400, '需要群组名');

    let group = null;
    if (groupName) {
        group = await Group.findOne({ name: groupName });
    } else {
        group = await Group.findOne({ isDefault: true });
    }
    assert(!group, 400, '该群组不存在');

    ctx.socket.socket.join(group._id);
    await modelTool.populateGroupMessage(group);
    await modelTool.populateGroupOnline(group);
    await modelTool.populateGroupInfo(group);

    ctx.res(201, { groups: [group] });
});

module.exports = AuthRouter;
