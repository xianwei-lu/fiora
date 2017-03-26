import React, { PropTypes } from 'react';
import moment from 'moment';
import pureRender from 'pure-render-decorator';
import ImmutablePropTypes from 'react-immutable-proptypes';

import './userList.scss';

import Avatar from '../../../common/avatar';
import user from '../../../action/user';

@pureRender
class UserList extends React.Component {
    static propTypes = {
        children: PropTypes.object,
    };

    render() {
        return (
            <div className="user-list">
                { this.props.children }
            </div>
        );
    }
}

@pureRender
class User extends React.Component {
    static propTypes = {
        linkman: ImmutablePropTypes.map,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired,
    };

    handleUserListItemClick = () => {
        const { linkman } = this.props;
        this.context.router.push(`/main/chat/${linkman.get('type')}/${linkman.get('_id')}`);
        user.clearUnread(linkman.get('type'), linkman.get('_id'));
        user.readAllMessage(linkman.get('type'), linkman.get('_id'));
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
        } else if (message.get('preview')) {
            content = message.get('preview');
        } else if (message.get('type') === 'text') {
            const text = message.get('content');
            content = `${message.getIn(['from', 'username'])}: ${text}`;
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
                    width={40}
                    height={40}
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

export default {
    container: UserList,
    item: User,
};
