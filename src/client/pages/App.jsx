import React, { Component } from 'react';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import PropTypes from 'prop-types';

import Header from 'features/Header';
import Footer from 'features/Footer';
import Chat from 'features/Chat';

import 'styles/page/app.less';

import action from '../state/action';

@immutableRenderDecorator
class App extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired,
    }
    static propTypes = {
        location: PropTypes.object,
        match: PropTypes.object,
    }
    componentDidMount() {
        const { location, match } = this.props;
        let groupName = '';
        if (location.pathname.startsWith('/group')) {
            groupName = match.params.name;
        }
        action.setValue(['signinGroup'], groupName);
        const token = window.localStorage.getItem('token');
        if (token) {
            action.reConnect(token).then((res) => {
                if (res.status !== 201) {
                    action.guest(groupName);
                } else {
                    window.localStorage.setItem('token', res.data.token);
                }
            });
        } else {
            action.guest(groupName);
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
