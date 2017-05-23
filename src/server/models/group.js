const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const GroupSchema = new Schema({
    createTime: { type: Date, default: Date.now },

    name: {
        type: String,
        trim: true,
        unique: true,
        match: /^([0-9a-zA-Z]{1,2}|[\u4e00-\u9eff]){1,8}$/,
    },
    avatar: {
        type: String,
        default: 'http://assets.suisuijiang.com/group_avatar_default.jpeg',
    },
    // 公告
    announcement: {
        type: String,
        default: '',
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
});

const Group = mongoose.model('Group', GroupSchema);
module.exports = Group;
