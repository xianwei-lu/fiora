import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import pureRender from 'pure-render-decorator';
import ImmutablePropTypes from 'react-immutable-proptypes';

import './main.scss';

import Header from './header';
import SystemSetting from './systemSetting';
import UserSetting from './userSetting';

@pureRender
class Main extends React.Component {
    static propTypes = {
        children: PropTypes.element,
        user: ImmutablePropTypes.map,
        location: PropTypes.object,
    };

    static contextTypes = {
        router: React.PropTypes.object.isRequired,
    }

    componentWillUpdate(nextProps) {
        if (!nextProps.user.get('_id')) {
            this.context.router.push('/login');
        }
    }


    render() {
        const { user, location } = this.props;
        if (!user.get('_id')) {
            // if store don't hava user data. render empty div
            return <div />;
        }

        return (
            <div className="app">
                <Header
                    pathname={location.pathname}
                />
                { this.props.children }
                <SystemSetting />
                <UserSetting />
            </div>
        );
    }
}

export default connect(
    state => ({
        user: state.get('user'),
    }),
)(Main);
