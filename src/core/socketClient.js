const socket = require('socket.io-client');

const defaultOpt = {
    https: false,
};

function createMethod(method) {
    return function (path, params) {
        return new Promise((resolve) => {
            this.socket.emit('message', { method, path, params }, resolve);
        });
    };
}

class SocketClient {
    constructor(host, port, opt = defaultOpt) {
        this.socket = new socket(`${opt.https ? 'https' : 'http'}://${host}:${port}`);

        this.get = createMethod.call(this, 'GET');
        this.post = createMethod.call(this, 'POST');
        this.delete = createMethod.call(this, 'DELETE');
        this.update = createMethod.call(this, 'UPDATE');
        this.patch = createMethod.call(this, 'PATCH');
    }
}

module.exports = SocketClient;
