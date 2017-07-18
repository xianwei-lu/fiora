import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';

import 'styles/feature/linkman.less';

@immutableRenderDecorator
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
                    <div className="content" dangerouslySetInnerHTML={{ __html: content }} />
                </div>
            </div>
        );
    }
}
