const socket = require('socket.io-client');
const env = require('../utils/env');

if (env.isRN()) {
    window.navigator.userAgent = 'react-native';
    window.location = {};
    window.location.protocol = 'http:';
}

const defaultConfig = {
    header: {},
};

function createMethod(method) {
    return function (path, params, config = defaultConfig) {
        return new Promise((resolve) => {
            const header = Object.assign(config.header, this.header);
            this.socket.emit('message', { method, path, params, header }, resolve);
        });
    };
}

const defaultOpt = {
    https: false,
    connectParams: {
        transports: ['websocket'],
        upgrade: false,
        reconnection: true,
        reconnectionAttempts: 6,
        reconnectionDelay: 10000,
    },
};

class SocketClient {
    constructor(host, port, opt = defaultOpt) {
        this.socket = new socket(`${opt.https ? 'https' : 'http'}://${host}:${port}`, opt.connectParams);
        this.header = {};

        this.get = createMethod.call(this, 'GET');
        this.post = createMethod.call(this, 'POST');
        this.delete = createMethod.call(this, 'DELETE');
        this.put = createMethod.call(this, 'PUT');
        this.patch = createMethod.call(this, 'PATCH');
    }
    on(message, cb) {
        return this.socket.on(message, cb);
    }
}

module.exports = SocketClient;
