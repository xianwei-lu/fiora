import React from 'react';
import PropTypes from 'prop-types';

import 'styles/feature/linkman.less';

export default function Linkman({ avatar, username, content }) {
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
Linkman.propTypes = {
    avatar: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
};
