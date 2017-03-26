const socket = require('socket.io-client');

const defaultOpt = {
    https: false,
};


class SocketClient {
    constructor(host, port, opt = defaultOpt) {
        this.socket = new socket(`${opt.https ? 'https' : 'http'}://${host}:${port}`);
    }
    get(path, data) {
        return new Promise((resolve) => {
            this.socket.emit('message', { path, data }, resolve);
        });
    }
}

module.exports = SocketClient;
