import React, { Component } from 'react';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import AceEditor from 'react-ace';
import { Modal, Select, Spin } from 'antd';
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
    'java',
    'c_cpp',
    'python',
    'ruby',
    'php',
    'golang',
    'csharp',
    'html',
    'css',
    'markdown',
    'sql',
    'json',
];

// 按需加载所选语言的mode文件
// Load the mode file for the selected language on demand
const langLoadEnd = { };
function createLanguage(lang, loadFun) {
    return class Fun extends Component {
        constructor(...args) {
            super(...args);
            this.state = {
                loadEnd: !!langLoadEnd[lang],
            };
        }
        componentDidMount() {
            if (!this.state.loadEnd) {
                loadFun.call(this);
                langLoadEnd[lang] = true;
            }
        }
        render() {
            if (!this.state.loadEnd) {
                return (
                    <Spin tip="loading...">
                        <div className="loadinng" />
                    </Spin>
                );
            }
            return (
                <AceEditor mode={lang} {...this.props} />
            );
        }
    };
}
const Javascript = createLanguage('javascript', function () {
    require.ensure([], (require) => {
        require('brace/mode/javascript');
        this.setState({ loadEnd: true });
    }, 'javascript');
});
const Typescript = createLanguage('typescript', function () {
    require.ensure([], (require) => {
        require('brace/mode/typescript');
        this.setState({ loadEnd: true });
    }, 'typescript');
});
const Java = createLanguage('java', function () {
    require.ensure([], (require) => {
        require('brace/mode/java');
        this.setState({ loadEnd: true });
    }, 'java');
});
const Cpp = createLanguage('c_cpp', function () {
    require.ensure([], (require) => {
        require('brace/mode/c_cpp');
        this.setState({ loadEnd: true });
    }, 'cpp');
});
const Python = createLanguage('python', function () {
    require.ensure([], (require) => {
        require('brace/mode/python');
        this.setState({ loadEnd: true });
    }, 'python');
});
const Ruby = createLanguage('ruby', function () {
    require.ensure([], (require) => {
        require('brace/mode/ruby');
        this.setState({ loadEnd: true });
    }, 'ruby');
});
const Php = createLanguage('php', function () {
    require.ensure([], (require) => {
        require('brace/mode/php');
        this.setState({ loadEnd: true });
    }, 'php');
});
const Golang = createLanguage('golang', function () {
    require.ensure([], (require) => {
        require('brace/mode/golang');
        this.setState({ loadEnd: true });
    }, 'golang');
});
const Csharp = createLanguage('csharp', function () {
    require.ensure([], (require) => {
        require('brace/mode/csharp');
        this.setState({ loadEnd: true });
    }, 'csharp');
});
const Html = createLanguage('html', function () {
    require.ensure([], (require) => {
        require('brace/mode/html');
        this.setState({ loadEnd: true });
    }, 'html');
});
const Css = createLanguage('css', function () {
    require.ensure([], (require) => {
        require('brace/mode/css');
        this.setState({ loadEnd: true });
    }, 'css');
});
const Markdown = createLanguage('markdown', function () {
    require.ensure([], (require) => {
        require('brace/mode/markdown');
        this.setState({ loadEnd: true });
    }, 'markdown');
});
const Sql = createLanguage('sql', function () {
    require.ensure([], (require) => {
        require('brace/mode/sql');
        this.setState({ loadEnd: true });
    }, 'sql');
});
const Json = createLanguage('json', function () {
    require.ensure([], (require) => {
        require('brace/mode/json');
        this.setState({ loadEnd: true });
    }, 'json');
});

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
            console.log(lang);
            onSend(`!!!lang=${lang}!!!${value}`);
            this.close();
        }
    }
    renderEditor = () => {
        const { value, lang } = this.state;
        const editorProps = {
            theme: 'tomorrow',
            onChange: this.onChange,
            fontSize: 12,
            height: '100%',
            showPrintMargin: true,
            showGutter: true,
            highlightActiveLine: true,
            value,
            setOptions: {
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: false,
                showLineNumbers: true,
                tabSize: 4,
            },
        };
        switch (lang) {
        case 'javascript':
            return <Javascript {...editorProps} />;
        case 'typescript':
            return <Typescript {...editorProps} />;
        case 'java':
            return <Java {...editorProps} />;
        case 'c_cpp':
            return <Cpp {...editorProps} />;
        case 'python':
            return <Python {...editorProps} />;
        case 'ruby':
            return <Ruby {...editorProps} />;
        case 'php':
            return <Php {...editorProps} />;
        case 'golang':
            return <Golang {...editorProps} />;
        case 'csharp':
            return <Csharp {...editorProps} />;
        case 'html':
            return <Html {...editorProps} />;
        case 'css':
            return <Css {...editorProps} />;
        case 'markdown':
            return <Markdown {...editorProps} />;
        case 'sql':
            return <Sql {...editorProps} />;
        case 'json':
            return <Json {...editorProps} />;
        default:
            return null;
        }
    }
    render() {
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
                    {this.renderEditor()}
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
