import Socket from '../core/socketClient';

const socket = new Socket('localhost', 9200);

export default {
    register: function(username, password) {
        return socket.post('/user', {
            username,
            password
        });
    }
}