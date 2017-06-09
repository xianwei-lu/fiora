import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import App from 'pages/App';

import 'normalize.css';

import store from './state/store';
import { init } from './state/action';

init(store.dispatch);

ReactDom.render(
    <Provider store={store}>
        <Router>
            <div className="index">
                <Route exact path="/" component={App} />
                <Route exact path="/a" render={() => <p>a</p>} />
            </div>
        </Router>
    </Provider>,
    document.getElementById('app'),
);
