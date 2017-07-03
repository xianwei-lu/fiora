import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';
import format from 'date-format';

import Avatar from 'components/Avatar';

import 'styles/component/message.less';

@pureRender
export default class Message extends Component {
    static propTypes = {
        avatar: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        time: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]).isRequired,
        content: PropTypes.string.isRequired,
        isSimple: PropTypes.bool,
        status: PropTypes.string,
    }
    static defaultProps = {
        isSimple: false,
    }
    render() {
        const { avatar, username, time, content, isSimple, status } = this.props;

        return (
            isSimple ?
                <div className="message-simple">
                    {
                        content.split(/\n/).map((m, i) => (
                            <p key={i}>{m}</p>
                        ))
                    }
                </div>
            :
                <div className="message">
                    <Avatar className="avatar" width={36} height={36} src={avatar} circular />
                    <div className="content">
                        <div>
                            <span>{username}</span>
                            <span className="time">{format('yyyy-MM-dd hh:mm:ss', new Date(time))}</span>
                        </div>
                        <div>
                            {
                                content.split(/\n/).map((m, i) => (
                                    <p key={i}>{m}</p>
                                ))
                            }
                        </div>
                    </div>
                </div>
        );
    }
}
