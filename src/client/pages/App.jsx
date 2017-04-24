import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';

import 'styles/page/app.less';
import 'normalize.css';
import Login from './Login';

export default class App extends Component {
    render() {
        return (
            <Router>
                <Route path="/login" component={Login} />
            </Router>
        );
    }
}
