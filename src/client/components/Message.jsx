import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';
import format from 'date-format';
import { connect } from 'react-redux';
import { Spin } from 'antd';

import Avatar from 'components/Avatar';

import 'styles/component/message.less';

@pureRender
class Message extends Component {
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
        shouldScroll: PropTypes.bool.isRequired,
    }
    static defaultProps = {
        isSimple: false,
    }
    componentDidMount() {
        if (this.props.shouldScroll) {
            this.msg.scrollIntoView(false);
        }
    }
    render() {
        const { avatar, username, time, content, isSimple, status } = this.props;

        return (
            isSimple ?
                <div className="message-simple" ref={(i) => this.msg = i}>
                    <Spin spinning={status === 'sending'} size="small">
                        <div className="container">
                            {
                                content.split(/\n/).map((m, i) => (
                                    <p key={i}>{m}</p>
                                ))
                            }
                        </div>
                    </Spin>
                </div>
            :
                <div className="message" ref={(i) => this.msg = i}>
                    <Spin spinning={status === 'sending'} size="small">
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
                    </Spin>
                </div>

        );
    }
}

export default connect(
    ($$state, { id }) => ({
        shouldScroll: $$state.getIn(['view', 'autoScroll']) || id === $$state.getIn(['user', '_id']),
    }),
)(Message);
