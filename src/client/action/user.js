import Store from '../store';
import socket from '../socket';
import messageTool from '../util/message';

const dispatch = Store.dispatch;

const actions = {
    online() {
        return new Promise((resolve) => {
            dispatch({
                type: 'Online',
            });
            resolve('success');
        });
    },

    offline() {
        return new Promise((resolve) => {
            dispatch({
                type: 'Offline',
            });
            resolve('success');
        });
    },

    login(username, password) {
        return new Promise((resolve) => {
            socket.post('/auth', { username, password }, (response) => {
                if (response.status === 201) {
                    for (const group of response.data.user.groups) {
                        group.messages = messageTool.initialMessagesHandle(group.messages);
                    }
                    for (const friend of response.data.user.friends) {
                        friend.messages = messageTool.initialMessagesHandle(friend.messages);
                    }
                    dispatch({
                        type: 'LoginSuccess',
                        user: response.data.user,
                    });
                    socket.setToken(response.data.token);
                    resolve(response);
                } else {
                    resolve(response);
                }
            });
        });
    },

    logout() {
        return new Promise((resolve) => {
            socket.delete('/auth', { }, (response) => {
                if (response.status === 204) {
                    socket.setToken('');
                    resolve(response);
                } else {
                    resolve(response);
                }
            });
        });
    },

    init() {
        return new Promise((resolve) => {
            dispatch({
                type: 'Initialize',
            });
            resolve('success');
        });
    },

    signup(username, password) {
        return new Promise((resolve) => {
            socket.post('/user', { username, password }, (response) => {
                resolve(response);
            });
        });
    },

    updateUser(gender, birthday, location, website, github, qq) {
        return new Promise((resolve) => {
            socket.put('/user', { gender, birthday, location, website, github, qq }, (response) => {
                if (response.status === 200) {
                    dispatch({
                        type: 'UpdateUser',
                        user: response.data,
                    });
                }
                resolve(response);
            });
        });
    },

    updateAvatar(avatar) {
        return new Promise((resolve) => {
            socket.put('/user/avatar', { avatar }, (response) => {
                if (response.status === 200) {
                    dispatch({
                        type: 'UpdateAvatar',
                        user: response.data,
                    });
                    resolve(response);
                } else {
                    resolve(response);
                }
            });
        });
    },

    reConnect(token) {
        if (token) {
            socket.setToken(token);
        }
        return new Promise((resolve) => {
            socket.post('/auth/re', { }, (response) => {
                if (response.status === 201) {
                    for (const group of response.data.groups) {
                        group.messages = messageTool.initialMessagesHandle(group.messages);
                    }
                    for (const friend of response.data.friends) {
                        friend.messages = messageTool.initialMessagesHandle(friend.messages);
                    }
                    dispatch({
                        type: 'LoginSuccess',
                        user: response.data,
                    });
                    resolve(response);
                } else {
                    resolve(response);
                }
            });
        });
    },

    sendGroupMessage(linkmanId, type, content) {
        return new Promise((resolve) => {
            socket.post('/groupMessage', { linkmanId, type, content }, (response) => {
                resolve(response);
            });
        });
    },

    addSelfMessage(message) {
        dispatch({
            type: 'AddSelfMessage',
            message,
        });
    },

    addGroupMessage(message) {
        return new Promise((resolve) => {
            dispatch({
                type: 'AddGroupMessage',
                message,
            });
            resolve(message);
        });
    },

    clearUnread(linkmanType, linkmanId) {
        return new Promise((resolve) => {
            dispatch({
                type: 'ClearUnread',
                linkmanType,
                linkmanId,
            });
            resolve('success');
        });
    },

    createGroup(name) {
        return new Promise((resolve) => {
            socket.post('/group', { name }, (response) => {
                if (response.status === 201) {
                    dispatch({
                        type: 'CreateGroup',
                        group: response.data,
                    });
                    resolve(response);
                } else {
                    resolve(response);
                }
            });
        });
    },

    joinGroup(groupName) {
        return new Promise((resolve) => {
            socket.post('/group/members', { groupName }, (response) => {
                if (response.status === 201) {
                    dispatch({
                        type: 'JoinGroup',
                        group: response.data,
                    });
                    resolve(response);
                } else {
                    resolve(response);
                }
            });
        });
    },

    leaveGroup(groupId) {
        return new Promise((resolve) => {
            socket.delete('/group/members', { groupId }, (response) => {
                if (response.status === 204) {
                    dispatch({
                        type: 'LeaveGroup',
                        groupId,
                    });
                }
                resolve(response);
            });
        });
    },

    updateGroupAnnouncement(groupId, content) {
        return new Promise((resolve) => {
            socket.put('/group/announcement', { groupId, content }, (response) => {
                if (response.status === 201) {
                    dispatch({
                        type: 'UpdateGroupAnnouncement',
                        group: response.data,
                    });
                    resolve(response);
                } else {
                    resolve(response);
                }
            });
        });
    },

    updateGroupAvatar(groupId, avatar) {
        return new Promise((resolve) => {
            socket.put('/group/avatar', { groupId, avatar }, (response) => {
                if (response.status === 201) {
                    dispatch({
                        type: 'UpdateGroupAvatar',
                        group: response.data,
                    });
                    resolve(response);
                } else {
                    resolve(response);
                }
            });
        });
    },

    addUserLinkman(user) {
        return new Promise((resolve) => {
            dispatch({
                type: 'AddUserLinkman',
                user,
            });
            resolve('success');
        });
    },

    sendMessage(linkmanId, type, content) {
        return new Promise((resolve) => {
            socket.post('/message', { linkmanId, type, content }, (response) => {
                resolve(response);
            });
        });
    },

    addMessage(message) {
        return new Promise((resolve) => {
            dispatch({
                type: 'AddMessage',
                message,
            });
            resolve(message);
        });
    },

    readAllMessage(linkmanType, linkmanId) {
        return new Promise((resolve) => {
            dispatch({
                type: 'ReadAllMessage',
                linkmanType,
                linkmanId,
            });
            resolve('success');
        });
    },

    getGroupInfo(groupId) {
        return new Promise((resolve) => {
            socket.get('/group', { groupId }, (response) => {
                if (response.status === 200) {
                    dispatch({
                        type: 'GetGroupInfo',
                        group: response.data,
                    });
                    resolve(response);
                } else {
                    resolve(response);
                }
            });
        });
    },

    getGroupHistoryMessage(groupId, length) {
        if (!length) {
            length = 0;
        }
        return new Promise((resolve) => {
            socket.get('/groupMessage/history', { groupId, length }, (response) => {
                if (response.status === 200) {
                    dispatch({
                        type: 'GetGroupHistoryMessage',
                        groupId,
                        messages: messageTool.initialMessagesHandle(response.data),
                    });
                    resolve(response);
                } else {
                    resolve(response);
                }
            });
        });
    },

    addUserExpression(src) {
        return new Promise((resolve) => {
            socket.post('/user/expression', { src }, (response) => {
                if (response.status === 201) {
                    dispatch({
                        type: 'AddUserExpression',
                        expressions: response.data,
                    });
                    resolve(response);
                } else {
                    resolve(response);
                }
            });
        });
    },

    deleteUserExpression(src) {
        return new Promise((resolve) => {
            socket.delete('/user/expression', { src }, (response) => {
                if (response.status === 200) {
                    dispatch({
                        type: 'DeleteUserExpression',
                        expressions: response.data,
                    });
                    resolve(response);
                } else {
                    resolve(response);
                }
            });
        });
    },

    getUserInfo(userId) {
        return new Promise((resolve) => {
            socket.get('/user', { userId }, (response) => {
                resolve(response);
            });
        });
    },
};

export default actions;
