const SocketClient = require('./core/socketClient');

const socket = new SocketClient('localhost', '9200');
socket
.get('/user', { a: 1, b: 2 })
.then((res) => {
    console.log(res);
});
