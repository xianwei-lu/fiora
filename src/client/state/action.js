import Socket from '../../core/socketClient';

const socket = new Socket('localhost', 9200);
let store = null;
let dispatch = null;


function init(instance) {
    store = instance;
    dispatch = store.dispatch;
}

function getGroup(id) {
    return store.getState().getIn(['user', 'groups']).find(
        $$group => $$group.get('_id') === id,
    );
}
function getGroupIndex(id) {
    return store.getState().getIn(['user', 'groups']).findIndex(
        $$group => $$group.get('_id') === id,
    );
}

const actions = {
    socket,
    // user
    async register(username, password) {
        return socket.post('/user', {
            username,
            password,
        });
    },
    async login(username, password) {
        const res = await socket.post('/auth', {
            username,
            password,
        });
        dispatch({
            type: 'SetMultiValue',
            keys: [
                ['user'],
                ['token'],
            ],
            values: [
                res.data.user,
                res.data.token,
            ],
        });
        return res;
    },
    async reConnect(token) {
        const res = await socket.put('/auth', {
            token,
        });
        dispatch({
            type: 'SetMultiValue',
            keys: [
                ['user'],
                ['token'],
            ],
            values: [
                res.data.user,
                token,
            ],
        });
        return res;
    },

    // group
    async createGroup(name) {
        const res = await socket.post('/group', {
            name,
        });
        dispatch({
            type: 'InsertValue',
            index: 0,
            key: ['user', 'groups'],
            value: res.data,
        });
        return res;
    },

    // message
    async sendMessage(linkman, linkmanType, message) {
        const now = Date.now();
        const $$state = store.getState();
        message = Object.assign(message, {
            _id: `temp-${now}`,
            createTime: now,
            from: {
                _id: $$state.getIn(['user', '_id']),
                avatar: $$state.getIn(['user', 'avatar']),
                username: $$state.getIn(['user', 'username']),
            },
            status: 'sending',
        });
        this.addMessage(linkman, linkmanType, message);

        const res = await socket.post('/message', {
            linkman,
            linkmanType,
            message,
        });

        if (res.status === 201) {
            this.updateMessage(linkman, linkmanType, `temp-${now}`, 'success');
        } else {
            this.updateMessage(linkman, linkmanType, `temp-${now}`, 'faild');
        }
        return res;
    },
    async addMessage(linkman, linkmanType, message) {
        dispatch({
            type: 'PushValue',
            key: ['user', 'groups', getGroupIndex(linkman), 'messages'],
            value: message,
        });
    },
    async updateMessage(linkman, linkmanType, messageId, status) {
        const $$state = store.getState();
        const index = $$state.getIn(['user', 'groups', getGroupIndex(linkman), 'messages']).findIndex(
            $$message => $$message.get('_id') === messageId,
        );
        dispatch({
            type: 'UpdateValue',
            key: ['user', 'groups', getGroupIndex(linkman), 'messages', index],
            value: { status },
        });
    },

    // ui
    selectGroup(name) {
        if (name && typeof name === 'string') {
            dispatch({
                type: 'SetValue',
                key: ['currentGroup'],
                value: name,
            });
        }
    },
};


export default actions;
export { init };
