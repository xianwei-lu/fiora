const socket = require('socket.io-client');

const defaultOpt = {
    https: false,
};


class SocketClient {
    constructor(host, port, opt = defaultOpt) {
        this.socket = new socket(`${opt.https ? 'https' : 'http'}://${host}:${port}`);
    }
    get(path, params) {
        return new Promise((resolve) => {
            this.socket.emit('message', { method: 'GET', path, params }, resolve);
        });
    }
}

module.exports = SocketClient;
