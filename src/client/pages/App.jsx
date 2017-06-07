import React, { Component } from 'react';
import { Layout } from 'antd';

import Header from 'features/Header';
import Footer from 'features/Footer';
import Chat from 'features/Chat';

import 'styles/page/app.less';

export default class App extends Component {
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
