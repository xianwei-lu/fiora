import React, { Component } from 'react';
import PropTypes from 'prop-types';
import format from 'date-format';
import { connect } from 'react-redux';
import { Spin } from 'antd';

import Avatar from 'components/Avatar';
import Highlight from 'components/Highlight';

import 'styles/feature/message.less';
// styles list: https://highlightjs.org/static/demo/
import 'highlight.js/styles/vs.css';

let scrollMessage = null;
let scrollEvent = null;

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
            scrollMessage = this.msg.scrollIntoView.bind(this.msg, false);
            scrollMessage();
            if (scrollEvent) {
                clearTimeout(scrollEvent);
            }
            scrollEvent = setTimeout(scrollMessage, 300);
        }
    }
    shouldComponentUpdate(nextProps) {
        return !(
            this.props.status === nextProps.status
        );
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
    renderCode = () => {
        let { content } = this.props;
        const lang = /^!!!lang=(.+)!!!/.exec(content);
        if (lang) {
            content = content.replace(lang[0], '');
        }
        return (
            <Highlight className={`code ${(lang && lang[1]) || ''}`}>
                {content}
            </Highlight>
        );
    }
    renderImage = () => {
        const { content } = this.props;
        return (
            <img
                src={content}
                ref={(i) => this.img = i}
                onLoad={scrollMessage}
                onError={() => this.img.src = require('../assets/images/image_not_found.png')}
            />
        );
    }
    renderContent = () => {
        switch (this.props.type) {
        case 'text':
            return this.renderText();
        case 'url':
            return this.renderUrl();
        case 'code':
            return this.renderCode();
        case 'image':
            return this.renderImage();
        default:
            return <span>未知消息</span>;
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
