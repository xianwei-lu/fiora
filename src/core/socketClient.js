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
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        timeout: 5000,
    },
};

class SocketClient {
    constructor(host, port, opt = defaultOpt) {
        this.socket = new socket(`${opt.https ? 'https' : 'http'}://${host}:${port}`, opt.connectParams);
        this.header = {};

        this.get = createMethod.call(this, 'GET');
        this.post = createMethod.call(this, 'POST');
        this.delete = createMethod.call(this, 'DELETE');
        this.update = createMethod.call(this, 'UPDATE');
        this.patch = createMethod.call(this, 'PATCH');
    }
    setToken(token) {
        this.header.token = token;
    }
    on(message) {
        return new Promise(resolve => this.socket.on(message, resolve));
    }
}

module.exports = SocketClient;
