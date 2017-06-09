import React, { Component } from 'react';
import PropTypes from 'prop-types';

import 'styles/component/linkman.less';

export default class Linkman extends Component {
    static propTypes = {
        avatar: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
    }
    render() {
        const { avatar, username, content } = this.props;

        return (
            <div className="component-linkman">
                <img className="avatar" src={avatar} />
                <div>
                    <div className="nick-time">
                        <span>{username}</span>
                    </div>
                    <div className="content">{content}</div>
                </div>
            </div>
        );
    }
}
