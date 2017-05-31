import Socket from '../core/socketClient';

const socket = new Socket('localhost', 9200);

export default {
    register(username, password) {
        return socket.post('/user', {
            username,
            password,
        });
    },
    login(username, password) {
        return socket.post('/auth', {
            username,
            password,
        });
    },
};
