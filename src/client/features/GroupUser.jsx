import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from 'components/Avatar';
import ColorIcon from 'components/ColorIcon';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import { Tooltip } from 'antd';

import 'styles/feature/groupUser.less';

@immutableRenderDecorator
export default class Linkman extends Component {
    static propTypes = {
        avatar: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        os: PropTypes.string,
        browser: PropTypes.string,
    }
    render() {
        const { avatar, username, os, browser } = this.props;

        return (
            <li className="component-group-user">
                <div className="avatar-name">
                    <Avatar width={20} height={20} src={avatar} circular />
                    <p>{username}</p>
                </div>
                <Tooltip title={`${os} ${browser}`} mouseEnterDelay={0.5}>
                    <div className="icon-container">
                        <ColorIcon icon={`icon-${os.replace(' ', '').toLowerCase()}`} size={20} />
                        <ColorIcon icon={`icon-${browser.replace(' ', '').toLowerCase()}`} size={20} />
                    </div>
                </Tooltip>
            </li>
        );
    }
}
