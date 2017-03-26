import socket from './socket';
import store from './store';

const publicApi = {
    apis: {
        getApis: 'get api list. params( cb )',
        getOnlineCount: 'get online user count. params( cb )',
        sendMessage: 'send message. params( linkmanType, linkmanId, messageType, content, cb )',
        getLinkmanId: 'get id from type and name. params( linkmanType, linkmanName, cb )',
    },
    getApis(cb) {
        cb(null, this.apis);
    },
    getOnlineCount(cb) {
        socket.get('/auth/count', {}, (response) => {
            cb(null, response.data.onlineCount);
        });
    },
    sendMessage(linkmanType, linkmanId, messageType, content, cb) {
        if (linkmanType === 'group') {
            socket.post('/groupMessage', {
                linkmanId,
                type: messageType,
                content,
            }, (response) => {
                if (response.status !== 201) {
                    return cb(response.data, null);
                }
                cb(null, response.data);
            });
        } else if (linkmanType === 'stranger') {
            socket.post('/message', {
                linkmanId,
                type: messageType,
                content,
            }, (response) => {
                if (response.status !== 201) {
                    return cb(response.data, null);
                }
                cb(null, response.data);
            });
        } else {
            cb('invalid linkman type', null);
        }
    },
    getLinkmanId(linkmanType, linkmanName, cb) {
        const state = store.getState();
        const linkmans = state.getIn(['user', 'linkmans']);
        const linkman = linkmans.find(l => l.get('type') === linkmanType && l.get(linkmanType === 'group' ? 'name' : 'username') === linkmanName);
        cb(null, linkman && linkman.get('_id'));
    },
    setPluginData(data, cb) {
        socket.put('/user/pluginData', { pluginData: data }, (response) => {
            if (response.status === 200) {
                cb(null, response.data);
            } else {
                cb(response.data, undefined);
            }
        });
    },
    getPluginData(cb) {
        socket.get('/user/me', { }, (response) => {
            if (response.status === 200) {
                cb(null, response.data.pluginData);
            } else {
                cb(response.data, undefined);
            }
        });
    },
    getAllClients(cb) {
        socket.get('/clients', {}, cb);
    },
    getAllAuths(cb) {
        socket.get('/auths', {}, cb);
    },
};

export default publicApi;
