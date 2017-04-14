const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    createTime: { type: Date, default: Date.now, index: true },
    updateTime: { type: Date, default: Date.now },

    from: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    toUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    toGroup: {
        type: Schema.Types.ObjectId,
        ref: 'Group',
    },
    type: {
        type: String,
        enum: ['text', 'image', 'code', 'url'],
        default: 'text',
    },
    content: {
        type: String,
        default: '',
    }
});

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;