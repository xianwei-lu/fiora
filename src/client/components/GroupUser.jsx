import React, { Component, PropTypes } from 'react';
import { Icon } from 'antd';
import Avatar from 'components/Avatar';

import 'styles/component/groupUser.less';

export default class Linkman extends Component {
    static propTypes = {
        avatar: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
    }
    render() {
        const { avatar, username, icon } = this.props;

        return (
            <li className="component-group-user">
                <div className="avatar-name">
                    <Avatar width={20} height={20} src={avatar} circular />
                    <p>{username}</p>
                </div>
                <div className="icon">
                    <Icon type={icon} />
                </div>
            </li>
        );
    }
}
