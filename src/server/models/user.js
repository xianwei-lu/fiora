const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    createTime: { type: Date, default: Date.now, index: true },
    updateTime: { type: Date, default: Date.now },

    username: {
        type: String,
        trim: true,
        unique: true,
        match: /^[-_0-9a-z\u4e00-\u9eff]{1,16}$/i,
        index: true,
    },
    salt: String,
    password: String,
    avatar: {
        type: String,
        default: '',
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        default: 'male',
    },
    birthday: {
        type: Date,
        default: Date.now,
    },
    introduce: {
        type: String,
        default: '',
        maxLength: 256,
    },
    location: {
        type: String,
        maxLength: 64,
    },
    github: {
        type: String,
        maxLength: 64,
    },
    website: {
        type: String,
        maxLength: 64,
    },
    qq: {
        type: String,
        maxLength: 16,
    },
    groups: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Group',
        },
    ],
    expressions: [
        {
            type: String,
        },
    ],
    pluginData: {
        type: String,
        maxLength: 10240,
    },
});

const User = mongoose.model('User', UserSchema);
module.exports = User;