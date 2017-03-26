import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import pureRender from 'pure-render-decorator';

import './inputBox.scss';

import ui from '../../../action/pc';
import config from '../../../../../config/project';
import send from '../../../util/send';
import imageUtil from '../../../util/image';

@pureRender
class InputBox extends React.Component {
    static propTypes = {
        linkmanId: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        insertTexts: PropTypes.object.isRequired,
    };

    static insertAtCursor(input, value) {
        if (document.selection) {
            input.focus();
            const sel = document.selection.createRange();
            sel.text = value;
            sel.select();
        } else if (input.selectionStart || input.selectionStart === '0') {
            const startPos = input.selectionStart;
            const endPos = input.selectionEnd;
            const restoreTop = input.scrollTop;
            input.value = input.value.substring(0, startPos) + value + input.value.substring(endPos, input.value.length);
            if (restoreTop > 0) {
                input.scrollTop = restoreTop;
            }
            input.focus();
            input.selectionStart = startPos + value.length;
            input.selectionEnd = startPos + value.length;
        } else {
            input.value += value;
            input.focus();
        }
    }

    componentWillUpdate(nextProps) {
        if (!nextProps.insertTexts.equals(this.props.insertTexts)) {
            nextProps.insertTexts.forEach((text) => {
                this.insertAtCursor(this.input, text);
            });
            ui.insertTextEnd(nextProps.insertTexts.size);
        }
    }

    handleInputKeyDown = (e) => {
        const { type, linkmanId } = this.props;
        // 过滤tab键
        if (e.keyCode === 9) {
            e.preventDefault();
            return;
        }
        if (e.keyCode === 13 && !e.shiftKey) {
            e.preventDefault();

            const message = this.input.value;
            this.input.value = '';
            if (message.trim() === '') {
                return;
            }
            if (/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/.test(message)) {
                const img = new Image();
                img.onload = () => {
                    send(type, linkmanId, 'image', message);
                };
                img.onerror = () => {
                    send(type, linkmanId, 'url', message);
                };
                img.src = message;
                return;
            }
            send(type, linkmanId, 'text', message);
        }
    }

    handlePaste = (e) => {
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        const types = (e.clipboardData || e.originalEvent.clipboardData).types;

        // 如果包含文件内容
        if (types.indexOf('Files') > -1) {
            for (let index = 0; index < items.length; index++) {
                const item = items[index];
                if (item.kind === 'file' && item.type.match(/^image/)) {
                    const reader = new FileReader();
                    const instance = this;
                    reader.onloadend = function () {
                        const img = new Image();
                        img.src = this.result;
                        send(instance.props.type, instance.props.linkmanId, 'image', imageUtil.convertToJpeg(img, 0.9));
                    };
                    reader.readAsDataURL(item.getAsFile());
                }
            }
            e.preventDefault();
        }
    }

    render() {
        return (
            <div
                className="input-box"
            >
                <input
                    type="text"
                    ref={input => this.input = input}
                    placeholder="输入消息"
                    maxLength={config.maxMessageLength}
                    onKeyDown={this.handleInputKeyDown}
                    onPaste={this.handlePaste}
                />
            </div>
        );
    }
}

export default connect(
    state => ({
        insertTexts: state.getIn(['pc', 'insertTexts']),
    }),
)(InputBox);
