import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { notification, Button } from 'antd';

import App from 'pages/App';
import Login from 'pages/Login';
import Signin from 'pages/Signin';

import 'normalize.css';

import store from './state/store';
import action, { init } from './state/action';
import messageTool from '../utils/message';

init(store);
action.socket.on('message', (data) => {
    if (data.type === 'text') {
        messageTool.handleReceiveMessage(data);
    }
    action.addMessage(data.toGroup, 'group', data);
});
let isDisconnect = false;
notification.config({
    top: 70,
});
action.socket.on('disconnect', () => {
    isDisconnect = true;
    notification.warn({
        key: 'disconnect-notification',
        message: '与服务器断开连接',
        description: '尝试重连, 请稍等...',
        duration: 0,
        btn: <Button onClick={() => { notification.close('disconnect-notification'); }}>我知道了</Button>,
    });
});
action.socket.on('reconnect', () => {
    action.reConnect(store.getState().get('token')).then((res) => {
        window.localStorage.setItem('token', res.data.token);
        notification.close('disconnect-notification');
        notification.close('connect-error-notification');
        notification.success({
            key: 'reconnect-notification',
            message: '已经恢复了网络连接',
            duration: 3,
        });
    });
});
action.socket.on('connect_error', () => {
    if (isDisconnect) {
        return;
    }
    notification.error({
        key: 'connect-error-notification',
        message: '连接服务器失败, 请检查网络连接',
        duration: 0,
    });
});

ReactDom.render(
    <Provider store={store}>
        <Router>
            <div className="index">
                <Route exact path="/" component={App} />
                <Route path="/group/:name" component={App} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/signin" component={Signin} />
            </div>
        </Router>
    </Provider>,
    document.getElementById('app'),
);
