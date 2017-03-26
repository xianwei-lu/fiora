import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import pureRender from 'pure-render-decorator';
import ImmutablePropTypes from 'react-immutable-proptypes';

import './chat.scss';

import UserList from './userList';
import ChatPanel from './chatPanel';
import EmptyChatPanel from './emptyChatPanel';

@pureRender
class Chat extends React.Component {
    static propTypes = {
        linkmans: ImmutablePropTypes.list.isRequired,
        me: PropTypes.string.isRequired,
        location: PropTypes.object.isRequired,
        routeParams: PropTypes.object.isRequired,
    };

    render() {
        const { linkmans, me, location, routeParams } = this.props;
        const currentLinkman = linkmans.find(linkman => linkman.get('type') === routeParams.type && linkman.get('_id') === routeParams.id);

        return (
            <div className="body">
                <UserList.container>
                    {
                        linkmans.map(linkman => (
                            <UserList.item
                                key={linkman.get('type') + linkman.get('_id')}
                                linkman={linkman}
                            />
                        ))
                    }
                </UserList.container>
                {
                    location.pathname === '/main' || location.pathname === '/main/chat' || !currentLinkman ?
                        <EmptyChatPanel />
                        :
                        <ChatPanel
                            linkman={currentLinkman}
                            me={me}
                        />
                }
            </div>
        );
    }
}

export default connect(
    state => ({
        linkmans: state.getIn(['user', 'linkmans']),
        me: state.getIn(['user', '_id']),
    }),
)(Chat);
