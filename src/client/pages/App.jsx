import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';

import 'styles/page/app.less';
import 'normalize.css';
import View from 'components/View';
import Login from './Login';
import Signin from './Signin';

export default class App extends Component {
    render() {
        return (
            <Router>
                <View
                    className="page-app" center fill
                    backgroundImage={require('assets/images/background2.jpg')}
                >
                    <Route path="/login" component={Login} />
                    <Route path="/signin" component={Signin} />
                </View>
            </Router>
        );
    }
}
