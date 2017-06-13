import Socket from '../../core/socketClient';

const socket = new Socket('localhost', 9200);
let dispatch = null;


function init(storeDispatch) {
    dispatch = storeDispatch;
}

async function action1(data) {
    return dispatch({
        type: 'SetValue',
        key: ['number'],
        value: data,
    });
}

async function register(username, password) {
    return socket.post('/user', {
        username,
        password,
    });
}

async function login(username, password) {
    const res = await socket.post('/auth', {
        username,
        password,
    });
    dispatch({
        type: 'SetValue',
        key: ['user'],
        value: res.data.user,
    });
    dispatch({
        type: 'SetValue',
        key: ['token'],
        value: res.data.token,
    });
    return res;
}

async function reConnect(token) {
    const res = await socket.put('/auth', {
        token,
    });
    dispatch({
        type: 'SetValue',
        key: ['user'],
        value: res.data.user,
    });
    dispatch({
        type: 'SetValue',
        key: ['token'],
        value: token,
    });
    return res;
}

export default {
    action1,
    register,
    login,
    reConnect,
};

export { init };
