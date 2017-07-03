import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import App from 'pages/App';
import Login from 'pages/Login';
import Signin from 'pages/Signin';

import 'normalize.css';

import store from './state/store';
import action, { init } from './state/action';

init(store);
action.socket.on('message', (data) => {
    action.addMessage(data.toGroup, 'group', data);
});

ReactDom.render(
    <Provider store={store}>
        <Router>
            <div className="index">
                <Route exact path="/" component={App} />
                <Route path="/group/:name" component={App} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/signin" component={Signin} />
                <Route exact path="/a" render={() => <p>a</p>} />
            </div>
        </Router>
    </Provider>,
    document.getElementById('app'),
);
