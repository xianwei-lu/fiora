const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SocketSchema = new Schema({
    createTime: { type: Date, default: Date.now, index: true },

    socket: {
        type: String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    token: {
        type: String,
    },
    os: {
        type: String,
    },
    browser: {
        type: String,
    },
    description: {
        type: String,
    },
});

const Socket = mongoose.model('Socket', SocketSchema);
module.exports = Socket;
