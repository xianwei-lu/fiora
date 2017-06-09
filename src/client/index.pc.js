import React from 'react';
import ReactDom from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
 } from 'react-router-dom';

import App from 'pages/App';

import 'normalize.css';

import store from './state/store';
import { init } from './state/action';

init(store.dispatch);

ReactDom.render(
    <Router>
        <div className="index">
            <Route exact path="/" component={App} />
            <Route exact path="/a" render={() => <p>a</p>} />
        </div>
    </Router>,
    document.getElementById('app'),
);
