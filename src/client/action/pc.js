import Store from '../store';
import socket from '../socket';

const dispatch = Store.dispatch;
let closeNotification = null;

const actions = {
    // chatPanel
    openGroupSetting: () => dispatch({ type: 'OpenGroupSetting' }),
    closeGroupSetting: () => dispatch({ type: 'CloseGroupSetting' }),
    openGroupNotice: () => dispatch({ type: 'OpenGroupNotice' }),
    closeGroupNotice: () => dispatch({ type: 'CloseGroupNotice' }),
    openExpression: () => dispatch({ type: 'OpenExpression' }),
    closeExpression: () => dispatch({ type: 'CloseExpression' }),
    openCodeInput: () => dispatch({ type: 'OpenCodeInput' }),
    closeCodeInput: () => dispatch({ type: 'CloseCodeInput' }),
    openNotification(content) {
        dispatch({ type: 'OpenNotification', content });
        clearTimeout(closeNotification);
        closeNotification = setTimeout(this.closeNotification, 5000);
    },
    closeNotification: () => dispatch({ type: 'CloseNotification' }),

    // maskLayout
    openMaskLayout: () => dispatch({ type: 'OpenMaskLayout' }),
    closeMaskLayout: () => dispatch({ type: 'CloseMaskLayout' }),

    // inputBox
    insertText: text => dispatch({ type: 'InsertText', text }),
    insertTextEnd: count => dispatch({ type: 'InsertTextEnd', count }),

    // messageList
    shouldScrollMessage: should => dispatch({ type: 'ShouldScrollMessage', should }),

    // window
    windowFocus: focus => dispatch({ type: 'WindowFocus', focus }),

    // systemSetting
    openSystemSetting: () => dispatch({ type: 'OpenSystemSetting' }),
    closeSystemSetting: () => dispatch({ type: 'CloseSystemSetting' }),
    openDesktopNotification: () => dispatch({ type: 'OpenDesktopNotification' }),
    closeDesktopNotification: () => dispatch({ type: 'CloseDesktopNotification' }),
    openSoundNotification: () => dispatch({ type: 'OpenSoundNotification' }),
    closeSoundNotification: () => dispatch({ type: 'CloseSoundNotification' }),

    // groupaManage
    openCreateGroupInput: () => dispatch({ type: 'OpenCreateGroupInput' }),
    closeCreateGroupInput: () => dispatch({ type: 'CloseCreateGroupInput' }),
    openAddGroupInput: () => dispatch({ type: 'OpenAddGroupInput' }),
    closeAddGroupInput: () => dispatch({ type: 'CloseAddGroupInput' }),

    // self info and user info
    openUserSetting: () => dispatch({ type: 'OpenUserSetting' }),
    closeUserSetting: () => dispatch({ type: 'CloseUserSetting' }),
    openUserInfo: userId => dispatch({ type: 'OpenUserInfo', userId }),
    closeUserInfo: () => dispatch({ type: 'CloseUserInfo' }),

    // imageViewer
    openImageViewer: src => dispatch({ type: 'OpenImageViewer', src }),
    closeImageViewer: () => dispatch({ type: 'CloseImageViewer' }),

    // login
    getUserAvatar: username => (
        new Promise((resolve) => {
            socket.get('/user/avatar', { username }, (response) => {
                if (response.status === 200) {
                    dispatch({
                        type: 'GetUserAvatar',
                        username: response.data.username,
                        avatar: response.data.avatar,
                    });
                }
                resolve(response);
            });
        })
    ),

    // app
    playSound: value => dispatch({ type: 'PlaySound', value }),
};

export default actions;
