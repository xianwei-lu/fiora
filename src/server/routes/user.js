const mongoose = require('mongoose');
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
.get('/:username', async (ctx) => {
    const { username } = ctx.params;
    assert(!mongoose.Types.ObjectId.isValid(username), 400, 'userId is invalid');

    const user = await User.findById(username, '-password -salt');
    if (user) {
        ctx.res(200, {
            avatar: user.avatar,
            username: user.username,
            gender: user.gender,
            birthday: user.birthday,
            location: user.location,
            website: user.website,
            github: user.github,
            qq: user.qq,
            createTime: user.createTime,
        });
    } else {
        ctx.res(404, 'user not exists');
    }
})
.post('/', async (ctx) => {
    const { username, password } = ctx.params;
    assert(!username, 400, '昵称不能为空');
    assert(!password, 400, '密码不能为空');

    const user = await User.findOne({ username });
    assert(user, 400, '该昵称已存在');

    const defaultGroup = await Group.findOne({ isDefault: true });

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
})
.put('/', async (ctx) => {
    const {gender, birthday, location, website, github, qq} = ctx.params;
    assert(typeof gender !== 'string', 400, 'need gender param but not exists');
    assert(typeof birthday !== 'string', 400, 'need birthday param but not exists');
    assert(typeof location !== 'string', 400, 'need location param but not exists');
    assert(typeof website !== 'string', 400, 'need website param but not exists');
    assert(typeof github !== 'string', 400, 'need github param but not exists');
    assert(typeof qq !== 'string', 400, 'need qq param but not exists');

    // const user = yield User.findById(this.socket.user, '-password -salt');

    // user.gender = data.gender;
    // const updateBirthday = new Date(data.birthday);
    // const now = new Date();
    // user.birthday = updateBirthday > now ? now : updateBirthday;
    // user.location = data.location;
    // user.website = data.website;
    // user.github = data.github;
    // user.qq = data.qq;
    // yield user.save();

    // this.end(200, {
    //     gender: user.gender,
    //     birthday: user.birthday,
    //     location: user.location,
    //     website: user.website === '' || /^http/.test(user.website) ? user.website : `http://${user.website}`,
    //     github: user.github === '' || /^http/.test(user.github) ? user.github : `http://${user.github}`,
    //     qq: user.qq,
    // });
    return ctx.res(404, '未实现');
});

module.exports = UserRouter;

// const UserRoute = {
//     'PUT /user': function* (data) {
//         yield* isLogin(this.socket, data, this.end);
//         assert(typeof data.gender !== 'string', this.end, 400, 'need gender param but not exists');
//         assert(typeof data.birthday !== 'string', this.end, 400, 'need birthday param but not exists');
//         assert(typeof data.location !== 'string', this.end, 400, 'need location param but not exists');
//         assert(typeof data.website !== 'string', this.end, 400, 'need website param but not exists');
//         assert(typeof data.github !== 'string', this.end, 400, 'need github param but not exists');
//         assert(typeof data.qq !== 'string', this.end, 400, 'need qq param but not exists');

//         const user = yield User.findById(this.socket.user, '-password -salt');

//         user.gender = data.gender;
//         const updateBirthday = new Date(data.birthday);
//         const now = new Date();
//         user.birthday = updateBirthday > now ? now : updateBirthday;
//         user.location = data.location;
//         user.website = data.website;
//         user.github = data.github;
//         user.qq = data.qq;
//         yield user.save();

//         this.end(200, {
//             gender: user.gender,
//             birthday: user.birthday,
//             location: user.location,
//             website: user.website === '' || /^http/.test(user.website) ? user.website : `http://${user.website}`,
//             github: user.github === '' || /^http/.test(user.github) ? user.github : `http://${user.github}`,
//             qq: user.qq,
//         });
//     },
//     'PUT /user/pluginData': function* (data) {
//         yield* isLogin(this.socket, data, this.end);
//         assert(typeof data.pluginData !== 'string', this.end, 400, 'need qq param but not exists');

//         const user = yield User.findById(this.socket.user, '-password -salt');
//         user.pluginData = data.pluginData;
//         yield user.save();

//         this.end(200, user.pluginData);
//     },
//     'GET /user/me': function* (data) {
//         yield* isLogin(this.socket, data, this.end);
//         const user = yield User.findById(this.socket.user, '-password -salt');
//         this.end(200, user);
//     },
//     'POST /user/friend': function* (data) {
//         yield* isLogin(this.socket, data, this.end);
//         assert(!mongoose.Types.ObjectId.isValid(data.userId), this.end, 400, `userId:'${data.userId}' is invalid`);

//         const me = yield User.findById(this.socket.user);
//         if (me.friends.indexOf(data.userId) !== -1) {
//             this.end(204);
//         }

//         const user = yield User.findById(data.userId);
//         assert(!user, this.end, 400, `user:'${data.userId}' not exists`);

//         me.friends.push(user._id);
//         yield me.save();
//         this.end(204);
//     },
//     'DELETE /user/friend': function* (data) {
//         yield* isLogin(this.socket, data, this.end);
//         assert(!mongoose.Types.ObjectId.isValid(data.userId), this.end, 400, `userId:'${data.userId}' is invalid`);

//         const me = yield User.findById(this.socket.user);
//         const index = me.friends.indexOf(data.userId);
//         if (index === -1) {
//             this.end(204);
//         }

//         const user = yield User.findById(data.userId);
//         assert(!user, this.end, 400, `user:'${data.userId}' not exists`);

//         me.friends.splice(index, 1);
//         yield me.save();
//         this.end(204);
//     },

//     'GET /user/avatar': function* (data) {
//         assert(!data.username, this.end, 400, 'need username param but not exists');

//         const user = yield User.findOne({ username: data.username });
//         if (user) {
//             return this.end(200, { username: user.username, avatar: user.avatar });
//         }

//         return this.end(200, { avatar: '' });
//     },

//     'PUT /user/avatar': function* (data) {
//         yield* isLogin(this.socket, data, this.end);
//         assert(!data.avatar, this.end, 400, 'need avatar param but not exists');

//         const user = yield User.findById(this.socket.user, '-password -salt');
//         const fileName = `user_${user._id}_${Date.now().toString()}.${data.avatar.match(/data:image\/(.+);base64/)[1]}`;
//         user.avatar = yield* imageUril.saveImageData(fileName, data.avatar);
//         yield user.save();

//         return this.end(200, user);
//     },

//     'POST /user/expression': function* (data) {
//         yield* isLogin(this.socket, data, this.end);
//         assert(!data.src, this.end, 400, 'need src param but not exists');

//         const user = yield User.findById(this.socket.user, '-password -salt');
//         if (user.expressions.indexOf(data.src) === -1) {
//             user.expressions.push(data.src);
//             yield user.save();
//         }

//         return this.end(201, user.expressions);
//     },

//     'DELETE /user/expression': function* (data) {
//         yield* isLogin(this.socket, data, this.end);
//         assert(!data.src, this.end, 400, 'need src param but not exists');

//         const user = yield User.findById(this.socket.user, '-password -salt');
//         const index = user.expressions.indexOf(data.src);
//         if (index !== -1) {
//             user.expressions.splice(index, 1);
//             yield user.save();
//         }

//         return this.end(200, user.expressions);
//     },
// };

// module.exports = UserRoute;
