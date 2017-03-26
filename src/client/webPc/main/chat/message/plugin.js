import React, { PropTypes } from 'react';
import jQuery from 'jquery';
import plugin from 'chat-room-plugin';

import base from './base';

const $ = jQuery;

function findUserMessage(userName) {
    if (!userName) {
        return;
    }
    let fullMatch = false;
    const match = userName.match(/^"([\s\S]*)"$/);
    if (match) {
        userName = match[1];
        fullMatch = true;
    }
    const $names = $('.message-list-item').find('.message-username');
    let $item;
    for (let i = $names.length - 1; i >= 0; i--) {
        const thisName = $names.eq(i).text();
        if (fullMatch) {
            if (thisName === userName) {
                $item = $names.eq(i).parents('.message-list-item');
                break;
            }
        } else if (thisName.indexOf(userName) !== -1) {
            $item = $names.eq(i).parents('.message-list-item');
            break;
        }
    }

    if ($item) {
        $item.avatar = $item.find('.avatar-image,.avatar-text');
        $item.direction = $item.find('.message-self').length ? 'right' : 'left';
    }

    return $item;
}

function getPluginMessageInfo(message) {
    let {
        content,
    } = message;

    const match = content.trim().match(/^([a-zA-Z0-9_-]+)\s*\(([\s\S]*)\)\s*;?\s*$/);

    const name = match && match[1];
    if (!name) {
        return;
    }

    const typeInfo = plugin.messageList[name];
    if (!typeInfo) {
        return;
    }
    const {
        showBase,
        process,
    } = typeInfo;

    if (process) {
        content = process(message);
    } else {
        content = match[2];
    }
    const ret = {
        name,
        content,
        showBase,
    };
    return ret;
}

plugin.init({
    findUserMessage,
    getPluginMessageInfo,
    jQuery,
});


class PluginMessage extends React.Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        content: PropTypes.any,
        isNew: PropTypes.bool.isRequired,
    }
    componentDidMount() {
        this.renderMessage();
    }
    shouldComponentUpdate(nextProps) {
        const currentProps = this.props;
        return !(
            currentProps.content === nextProps.content &&
            currentProps.name === nextProps.name
        );
    }

    componentDidUpdate() {
        this.renderMessage();
    }

    renderMessage() {
        jQuery(this.dom).empty()
            .append(plugin.getMessage(this.props.name, this.props.content, this.props.isNew));
    }
    render() {
        return (<div
            className="plugin-dom-container"
            ref={dom => this.dom = dom}
        />);
    }
}


const pluginMessage = {
    shouldRender: messageType => messageType === 'plugin',
    render: (message, me) => {
        const showBase = message.get('pluginMessageInfo').get('showBase');
        const pmessage = <PluginMessage name={message.get('pluginMessageInfo').get('name')} content={message.get('pluginMessageInfo').get('content')} isNew={message.get('isNew')} />;
        if (showBase) {
            return base(pmessage, message, me);
        }
        return pmessage;
    },
};

export default pluginMessage;
