import React, { Component } from 'react';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import AceEditor from 'react-ace';
import { Modal, Select } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import 'styles/feature/codeEditor.less';
import 'brace/theme/tomorrow';
import 'brace/ext/language_tools';

import action from '../state/action';

const { Option } = Select;
const languages = [
    'javascript',
    'typescript',
    'html',
    'css',
    'java',
    'python',
    'ruby',
    'golang',
    'csharp',
    'markdown',
    'mysql',
    'json',
];
for (const lang of languages) {
    require(`brace/mode/${lang}`);
}

@immutableRenderDecorator
class CodeEditor extends Component {
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        onSend: PropTypes.func,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            value: '',
            lang: languages[0],
        };
        this.close = action.setValue.bind(null, ['view', 'showCodeEditor'], false);
        this.selectLanguage = (value) => this.setState({ lang: value });
        this.onChange = (newValue) => this.setState({ value: newValue });
    }
    onOk = () => {
        const { value, lang } = this.state;
        const onSend = this.props.onSend;
        if (onSend) {
            onSend(`!!!lang=${lang}!!!${value}`);
        }
    }
    render() {
        const { value, lang } = this.state;
        return (
            <Modal
                visible={this.props.visible}
                title="发送代码"
                className="feature-code-editor"
                okText="发送"
                onOk={this.onOk}
                onCancel={this.close}
            >
                <label>编程语言: </label>
                <Select
                    defaultValue={languages[0]}
                    style={{ width: 140 }}
                    onSelect={this.selectLanguage}
                >
                    {
                        languages.map((l) => (
                            <Option key={l} value={l}>{l}</Option>
                        ))
                    }
                </Select>
                <div className="editor-containner">
                    <AceEditor
                        mode={lang}
                        theme="tomorrow"
                        onLoad={this.onLoad}
                        onChange={this.onChange}
                        fontSize={12}
                        height="100%"
                        showPrintMargin
                        showGutter
                        highlightActiveLine
                        value={`${value}`}
                        setOptions={{
                            enableBasicAutocompletion: true,
                            enableLiveAutocompletion: true,
                            enableSnippets: false,
                            showLineNumbers: true,
                            tabSize: 4,
                        }}
                    />
                </div>
            </Modal>
        );
    }
}

export default connect(
    ($$state) => ({
        visible: $$state.getIn(['view', 'showCodeEditor']),
    }),
)(CodeEditor);
