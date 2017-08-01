import platform from 'platform';
import Socket from '../../core/socketClient';
import messageTool from '../../utils/message';
import config from '../../../config/client';

const socket = new Socket(config.host, config.port);
let store = null;
let dispatch = null;


function init(instance) {
    store = instance;
    dispatch = store.dispatch;
}

function getGroupByName(name) {
    return store.getState().getIn(['user', 'groups']).find(
        ($$group) => $$group.get('name') === name,
    );
}
function getGroupIndex(id) {
    return store.getState().getIn(['user', 'groups']).findIndex(
        ($$group) => $$group.get('_id') === id,
    );
}

const actions = {
    socket,
    // user
    async register(username, password, signinGroup) {
        return socket.post('/user', {
            username,
            password,
            signinGroup,
        });
    },
    async login(username, password) {
        const { os, name, description } = platform;
        const res = await socket.post('/auth', {
            username,
            password,
            os: os.family,
            browser: name,
            description,
        });
        if (res.status === 201) {
            for (const group of res.data.user.groups) {
                messageTool.handleInitMessages(group.messages);
            }
            res.data.guest = false;
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
        }
        return res;
    },
    async reConnect(token) {
        const { os, name, description } = platform;
        const res = await socket.put('/auth', {
            token,
            os: os.family,
            browser: name,
            description,
        });
        if (res.status === 201) {
            for (const group of res.data.user.groups) {
                messageTool.handleInitMessages(group.messages);
            }
            res.data.guest = false;
            dispatch({
                type: 'SetMultiValue',
                keys: [
                    ['user'],
                    ['token'],
                ],
                values: [
                    res.data.user,
                    token: res.data.token,
                ],
            });
        }
        return res;
    },
    async guest(groupName) {
        const res = await socket.post('/auth/guest', { groupName });
        if (res.status === 201) {
            for (const group of res.data.groups) {
                messageTool.handleInitMessages(group.messages);
            }
            res.data.guest = true;
            dispatch({
                type: 'SetValue',
                key: ['user'],
                value: res.data,
            });
            this.selectGroup(res.data.groups[0].name);
        }
        return res;
    },

    // group
    async createGroup(name) {
        const res = await socket.post('/group', {
            name,
        });
        if (res.status === 201) {
            dispatch({
                type: 'InsertValue',
                index: 0,
                key: ['user', 'groups'],
                value: res.data,
            });
            this.selectGroup(res.data.name);
        }
        return res;
    },
    async searchGroup(groupName) {
        return socket.get('/group/search', { groupName });
    },
    async joinGroup(groupId) {
        const res = await socket.post('/group/join', {
            groupId,
        });
        if (res.status === 201) {
            messageTool.handleInitMessages(res.data.messages);
            dispatch({
                type: 'InsertValue',
                index: 0,
                key: ['user', 'groups'],
                value: res.data,
            });
            this.selectGroup(res.data.name);
        }
        return res;
    },
    async updateGroupOnline(groupId) {
        const res = await socket.get('/group/online', { groupId });
        if (res.status === 200) {
            dispatch({
                type: 'SetValue',
                key: ['user', 'groups', getGroupIndex(groupId), 'onlines'],
                value: res.data,
            });
        }
        return res;
    },

    // message
    async sendMessage(linkman, linkmanType, message) {
        const now = Date.now();
        const $$state = store.getState();
        const tempMessage = {
            type: message.type,
            content: message.content,
            _id: `temp-${now}`,
            createTime: now,
            from: {
                _id: $$state.getIn(['user', '_id']),
                avatar: $$state.getIn(['user', 'avatar']),
                username: $$state.getIn(['user', 'username']),
            },
            status: 'sending',
            isSelfSend: true,
        };
        messageTool.handleSendMessage(tempMessage);
        this.addMessage(linkman, linkmanType, tempMessage);

        const res = await socket.post('/message', {
            linkman,
            linkmanType,
            message,
        });

        if (res.status === 201) {
            messageTool.handleSendEndMessage(res.data);
            this.updateMessage(linkman, linkmanType, `temp-${now}`, {
                content: res.data.content,
                status: 'success',
            });
        } else {
            this.updateMessage(linkman, linkmanType, `temp-${now}`, {
                content: res.data.content,
                status: 'faild',
            });
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
    async updateMessage(linkman, linkmanType, messageId, message) {
        const $$state = store.getState();
        const index = $$state.getIn(['user', 'groups', getGroupIndex(linkman), 'messages']).findIndex(
            ($$message) => $$message.get('_id') === messageId,
        );
        dispatch({
            type: 'UpdateValue',
            key: ['user', 'groups', getGroupIndex(linkman), 'messages', index],
            value: message,
        });
    },
    lockGetHistoryMessage: false,
    async getHistoryMessage(linkman, linkmanType, messageCount) {
        if (this.lockGetHistoryMessage) {
            return;
        }
        this.lockGetHistoryMessage = true;
        const res = await socket.get('/message/history', {
            linkman,
            linkmanType,
            messageCount,
        });
        this.lockGetHistoryMessage = false;
        if (res.status === 200) {
            messageTool.handleHistoryMessages(res.data);
            dispatch({
                type: 'InsertValues',
                index: 0,
                key: ['user', 'groups', getGroupIndex(linkman), 'messages'],
                value: res.data,
            });
        }
        return res;
    },

    // view
    setValue(key, value) {
        dispatch({
            type: 'SetValue',
            key,
            value,
        });
    },
    selectGroup(name) {
        if (name && typeof name === 'string') {
            dispatch({
                type: 'SetValue',
                key: ['currentGroup'],
                value: name,
            });
            this.setAutoScroll(true);
        }
        const $$group = getGroupByName(name);
        if ($$group) {
            this.updateGroupOnline($$group.get('_id'));
        }
    },
    setAutoScroll(value) {
        dispatch({
            type: 'SetValue',
            key: ['view', 'autoScroll'],
            value,
        });
    },
    setShowSearchGroup(value) {
        dispatch({
            type: 'SetValue',
            key: ['view', 'showSearchGroup'],
            value,
        });
    },
    setUserListSollapsed(value) {
        dispatch({
            type: 'SetValue',
            key: ['view', 'userListSollapsed'],
            value,
        });
    },
    setSelectExpression(value) {
        dispatch({
            type: 'SetValue',
            key: ['view', 'showSelectExpression'],
            value,
        });
    },
    insertInputValue(value) {
        dispatch({
            type: 'SetValue',
            key: ['view', 'insertInputValue'],
            value,
        });
    },
};


export default actions;
export { init };
