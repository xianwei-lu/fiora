const bluebird = require('bluebird');
const bcrypt = bluebird.promisifyAll(require('bcrypt'), { suffix: '$' });

const Router = require('../../core/socketRouter');
const assert = require('../../utils/assert');
const avatar = require('../../utils/avatarGenerator');

const User = require('../models/user');
const Group = require('../models/group');

const saltRounds = 10;
const genders = ['male', 'female'];

const UserRouter = new Router({ prefix: '/user' });
UserRouter
.post('/', async (ctx) => {
    const { username, password, signinGroup } = ctx.params;
    assert(!username, 400, '昵称不能为空');
    assert(!password, 400, '密码不能为空');

    const user = await User.findOne({ username });
    assert(user, 400, '该昵称已存在');

    let defaultGroup = null;
    if (signinGroup) {
        defaultGroup = await Group.findOne({ name: signinGroup });
    } else {
        defaultGroup = await Group.findOne({ isDefault: true });
    }
    assert(!defaultGroup, 400, '要加入的群组不存在');

    const salt = await bcrypt.genSalt$(saltRounds);
    const hash = await bcrypt.hash$(password, salt);
    const gender = genders[Math.floor(Math.random() * 2)];
    const userAvatar = await avatar(username, gender);

    try {
        const newUser = await User.create({
            username,
            salt,
            password: hash,
            avatar: userAvatar,
            gender,
            groups: [defaultGroup],
        });
        defaultGroup.members.push(newUser);
        await defaultGroup.save();
        ctx.res(201, newUser);
    } catch (err) {
        if (err.message === 'User validation failed') {
            return ctx.res(400, '用户名不合法');
        }
        return ctx.res(500, 'server error when save new user');
    }
});

module.exports = UserRouter;
