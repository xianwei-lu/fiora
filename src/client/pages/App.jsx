import React, { Component } from 'react';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import pureRender from 'pure-render-decorator';

import Header from 'features/Header';
import Footer from 'features/Footer';
import Chat from 'features/Chat';

import 'styles/page/app.less';

import action from '../state/action';

@pureRender
class App extends Component {
    componentDidMount() {
        const token = window.localStorage.getItem('token');
        if (token) {
            action.reConnect(token).then(() => {
                // console.log(res);
            });
        }
    }
    render() {
        return (
            <Layout className="app">
                <Header />
                <Chat />
                <Footer />
            </Layout>
        );
    }
}

export default connect(
    ($$state) => ({
        state: $$state.toJS(),
    }),
)(App);
