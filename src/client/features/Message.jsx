import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import format from 'date-format';
import { connect } from 'react-redux';
import { Spin } from 'antd';

import Avatar from 'components/Avatar';

import 'styles/feature/message.less';

@immutableRenderDecorator
class Message extends Component {
    static propTypes = {
        avatar: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        time: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]).isRequired,
        type: PropTypes.string.isRequired,
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
    renderText = () => (
        this.props.content.split(/\n/).map((m, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: m }} />
        ))
    )
    renderUrl = () => {
        const { content } = this.props;
        return (
            <a href={content} rel="noopener noreferrer" target="_blank">{content}</a>
        );
    }
    renderContent = () => {
        switch (this.props.type) {
        case 'text':
            return this.renderText();
        case 'url':
            return this.renderUrl();
        default:
            return null;
        }
    }
    render() {
        const { avatar, username, time, isSimple, status } = this.props;
        return (
            isSimple ?
                <div className="message-simple" ref={(i) => this.msg = i}>
                    <Spin spinning={status === 'sending'} size="small">
                        <div className="container">
                            { this.renderContent() }
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
                            <div>{ this.renderContent() }</div>
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
