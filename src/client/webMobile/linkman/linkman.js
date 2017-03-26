import React, { PropTypes } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import pureRender from 'pure-render-decorator';
import ImmutablePropTypes from 'react-immutable-proptypes';

import './linkman.scss';

import Avatar from '../../common/avatar';
import Header from './header';

@pureRender
class LinkmanList extends React.Component {
    static propTypes = {
        linkmans: ImmutablePropTypes.list,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired,
    }

    render() {
        const { linkmans } = this.props;

        return (
            <div className="linkman">
                <Header />
                <div className="user-list">
                    {
                        linkmans && linkmans.map(linkman => (
                            <Linkman
                                key={linkman.get('type') + linkman.get('_id')}
                                linkman={linkman}
                            />
                        ))
                    }
                </div>
            </div>
        );
    }
}

@pureRender
class Linkman extends React.Component {
    static propTypes = {
        linkman: ImmutablePropTypes.map,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired,
    };

    handleUserListItemClick = () => {
        const { linkman } = this.props;
        this.context.router.push(`/chat/${linkman.get('type')}/${linkman.get('_id')}`);
    }

    render() {
        const { linkman } = this.props;
        const isGroup = linkman.get('type') === 'group';
        const messagesLength = linkman.get('messages').size;
        const time = moment(messagesLength === 0 ? linkman.get('createTime') : linkman.getIn(['messages', messagesLength - 1, 'createTime'])).format('HH:mm');
        const message = messagesLength === 0 ? null : linkman.getIn(['messages', messagesLength - 1]);
        const unread = linkman.get('unread') > 99 ? 99 : linkman.get('unread');
        let content = '';
        if (!message) {
            content = '...';
        } else if (message.get('type') === 'text') {
            content = `${message.getIn(['from', 'username'])}: ${message.get('content')}`;
        } else {
            content = `${message.getIn(['from', 'username'])}: [${message.get('type')}]`;
        }

        return (
            <div
                className="user-list-item"
                onClick={this.handleUserListItemClick}
            >
                <Avatar
                    avatar={linkman.get('avatar')}
                    name={isGroup ? linkman.get('name') : linkman.get('username')}
                    width={50}
                    height={50}
                />
                { unread > 0 ? <div className="unread">{ unread }</div> : null }
                <div className="content">
                    <div>
                        <p>{ isGroup ? linkman.get('name') : linkman.get('username') }</p>
                        <p>{ time }</p>
                    </div>
                    <div>
                        <p>{ content }</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    state => ({
        linkmans: state.getIn(['user', 'linkmans']),
        me: state.getIn(['user', '_id']),
    }),
)(LinkmanList);
