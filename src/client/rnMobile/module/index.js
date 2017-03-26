import React, { Component, PropTypes } from 'react';
import {
    Navigator,
} from 'react-native';
import { connect, Provider } from 'react-redux';
import pureRender from 'pure-render-decorator';

import Store from '../../store';

import Chat from './chat/chat';
import Login from './login/login';
import UserList from './userList/userList';

const routes = {
    chat: Chat,
    login: Login,
    userList: UserList,
};

@pureRender
class Index extends Component {
    static propTypes = {
        state: PropTypes.object,
        router: PropTypes.string.isRequired,
        routerParams: PropTypes.object.isRequired,
    }

    componentWillUpdate(nextProps) {
        if (
            nextProps.router !== this.props.router
        ) {
            this.navigator.push({ router: nextProps.router, routerParams: nextProps.routerParams });
        }
    }

    render() {
        // for debug
        console.logState('global state', this.props.state.toJS());

        const { router, routerParams } = this.props;
        return (
            <Navigator
                initialRoute={{ router, routerParams }}
                renderScene={
                    (route, navigator) => {
                        this.navigator = navigator;
                        const RenderComponent = routes[route.router];
                        return (
                            <RenderComponent
                                {...routerParams.toJS()}
                            />
                        );
                    }
                }
            />
        );
    }
}

const ConnectedIndex = connect(
    state => ({
        state,
        router: state.getIn(['rn', 'router']),
        routerParams: state.getIn(['rn', 'routerParams']),
    }),
)(Index);

const provider = (
    <Provider store={Store}>
        <ConnectedIndex />
    </Provider>
);

export default provider;
