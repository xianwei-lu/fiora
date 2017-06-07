import React from 'react';
import ReactDom from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
 } from 'react-router-dom';

import 'normalize.css';

import App from 'pages/App';

ReactDom.render(
    <Router>
        <div className="index">
            <Route exact path="/" component={App} />
            <Route exact path="/a" render={() => <p>a</p>} />
        </div>
    </Router>,
    document.getElementById('app'),
);
