import userDefaultAvatar from 'assets/images/user_avatar_default.png';

import user from '../action/user';
import ui from '../action/pc';
import store from '../store';

import xss from './xss';

// third party middleware
import plugin from '../middleware/plugin';
import handleRobotMessage from '../middleware/handleRobotMessage';
import filterCrMessage from '../middleware/filterCrMessage';

const thirdPartyMiddlewares = [
    handleRobotMessage,
    plugin,
    filterCrMessage,
];

/**
 * native handle before middleware
 */
function initialMessage(message) {
    message.notification = {
        title: `${message.from.username} - 发来消息:`,
        icon: /^http/.test(message.from.avatar) ? message.from.avatar : userDefaultAvatar,
        body: message.type === 'text' ? message.content : `[${message.type}]`,
        tag: message.from.id,
    };
    message.showNotification = true;
    message.playSound = true;
    message.preview = message.type === 'text' ? `${message.from.username}: ${message.content}` : `${message.from.username}: [${message.type}]`;
    message.isNew = true;
    if (message.type === 'text') {
        message.content = xss(message.content);
    }
    return message;
}
const beforeMiddleWareHandles = [
    initialMessage,
];

/**
 * native handle after middleware
 */
function playSound(message) {
    const state = store.getState();
    if (message.playSound && !message.isSelf && state.getIn(['pc', 'soundNotification'])) {
        ui.playSound(true);
    }

    delete message.playSound;
    return message;
}
function openNotification(message) {
    const state = store.getState();
    if (message.showNotification && !message.isSelf && window.Notification && window.Notification.permission === 'granted' && !state.getIn(['pc', 'windowFocus']) && state.getIn(['pc', 'desktopNotification'])) {
        const notification = new window.Notification(
            message.notification.title,
            {
                icon: message.notification.avatar,
                body: message.notification.body,
                tag: message.notification.tag,
            },
        );
        notification.onclick = function () {
            window.blur();
            window.focus();
            this.close();
        };
        // auto close
        setTimeout(notification.close.bind(notification), 3000);
    }

    delete message.notification;
    delete message.showNotification;
    return message;
}
const afterMiddleWareHandles = [
    playSound,
    openNotification,
];


function applyMiddleWares(message, middlewares) {
    for (const middleware of middlewares) {
        message = middleware(message);
    }
    return message;
}
function messageHandle(message) {
    message = applyMiddleWares(message, beforeMiddleWareHandles);
    message = applyMiddleWares(message, thirdPartyMiddlewares);
    message = applyMiddleWares(message, afterMiddleWareHandles);

    if (message.isSelf) {
        return user.addSelfMessage(message);
    }
    if (message.linkmanType === 'group') {
        user.addGroupMessage(message);
    } else if (message.linkmanType === 'stranger') {
        user.addMessage(message);
    }
}

function initialMessagesHandle(messages) {
    return messages.map((m) => {
        m.preview = `${m.from.username}: ${m.type === 'text' ? m.content : `[${m.type}]`}`;
        m.isNew = false;
        if (m.type === 'text') {
            m.content = xss(m.content);
        }
        return applyMiddleWares(m, thirdPartyMiddlewares);
    });
}

export default { messageHandle, initialMessagesHandle };
