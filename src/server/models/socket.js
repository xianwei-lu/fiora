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
});

const Socket = mongoose.model('Socket', SocketSchema);
module.exports = Socket;
