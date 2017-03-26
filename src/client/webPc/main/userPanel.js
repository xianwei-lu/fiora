import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import pureRender from 'pure-render-decorator';

import './userPanel.scss';

import Avatar from '../../common/avatar';
import ui from '../../action/pc';
import mask from '../../util/mask';

@pureRender
class UserPanel extends React.Component {
    static propTypes = {
        avatar: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        online: PropTypes.bool,
    };

    static handleAvatarClick() {
        ui.openUserSetting();
        mask(ui.closeUserSetting);
    }

    render() {
        const { avatar, username, online } = this.props;

        return (
            <div className="user-panel">
                <div
                    className={online ? 'online' : 'offline'}
                    title={online ? '在线' : '离线'}
                />
                <Avatar
                    avatar={avatar}
                    name={username}
                    width={60}
                    height={60}
                    title="查看个人信息"
                    onClick={this.handleAvatarClick}
                />
            </div>
        );
    }
}

export default connect(
    state => ({
        avatar: state.getIn(['user', 'avatar']),
        username: state.getIn(['user', 'username']),
        online: state.getIn(['user', 'online']),
    }),
)(UserPanel);
