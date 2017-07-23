import React, { Component } from 'react';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import { Modal, Select, Spin } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import 'styles/feature/codeEditor.less';

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
let AceEditor = null;

// 动态加载所选语言的mode文件
// Dynamically loads the mode file of the selected language
let editorLoadEnd = false;
const langLoadEnd = { };
function createLanguage(lang, loadFun) {
    return class AceEditorWrap extends Component {
        constructor(...args) {
            super(...args);
            this.state = {
                editorReady: editorLoadEnd,
                modeReady: !!langLoadEnd[lang],
            };
        }
        componentDidMount() {
            const { editorReady, modeReady } = this.state;
            if (!editorReady) {
                // 动态加载代码编辑器
                // Dynamic loading code editor
                require.ensure([], (require) => {
                    AceEditor = require('react-ace').default;
                    require('brace/theme/tomorrow');
                    require('brace/ext/language_tools');
                    this.setState({ editorReady: true });
                    loadFun.call(this);
                    langLoadEnd[lang] = true;
                }, 'react-ace');
                editorLoadEnd = true;
            } else if (!modeReady) {
                loadFun.call(this);
                langLoadEnd[lang] = true;
            }
        }
        render() {
            const { editorReady, modeReady } = this.state;
            if (!editorReady || !modeReady) {
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
        this.setState({ modeReady: true });
    }, 'javascript');
});
const Typescript = createLanguage('typescript', function () {
    require.ensure([], (require) => {
        require('brace/mode/typescript');
        this.setState({ modeReady: true });
    }, 'typescript');
});
const Java = createLanguage('java', function () {
    require.ensure([], (require) => {
        require('brace/mode/java');
        this.setState({ modeReady: true });
    }, 'java');
});
const Cpp = createLanguage('c_cpp', function () {
    require.ensure([], (require) => {
        require('brace/mode/c_cpp');
        this.setState({ modeReady: true });
    }, 'cpp');
});
const Python = createLanguage('python', function () {
    require.ensure([], (require) => {
        require('brace/mode/python');
        this.setState({ modeReady: true });
    }, 'python');
});
const Ruby = createLanguage('ruby', function () {
    require.ensure([], (require) => {
        require('brace/mode/ruby');
        this.setState({ modeReady: true });
    }, 'ruby');
});
const Php = createLanguage('php', function () {
    require.ensure([], (require) => {
        require('brace/mode/php');
        this.setState({ modeReady: true });
    }, 'php');
});
const Golang = createLanguage('golang', function () {
    require.ensure([], (require) => {
        require('brace/mode/golang');
        this.setState({ modeReady: true });
    }, 'golang');
});
const Csharp = createLanguage('csharp', function () {
    require.ensure([], (require) => {
        require('brace/mode/csharp');
        this.setState({ modeReady: true });
    }, 'csharp');
});
const Html = createLanguage('html', function () {
    require.ensure([], (require) => {
        require('brace/mode/html');
        this.setState({ modeReady: true });
    }, 'html');
});
const Css = createLanguage('css', function () {
    require.ensure([], (require) => {
        require('brace/mode/css');
        this.setState({ modeReady: true });
    }, 'css');
});
const Markdown = createLanguage('markdown', function () {
    require.ensure([], (require) => {
        require('brace/mode/markdown');
        this.setState({ modeReady: true });
    }, 'markdown');
});
const Sql = createLanguage('sql', function () {
    require.ensure([], (require) => {
        require('brace/mode/sql');
        this.setState({ modeReady: true });
    }, 'sql');
});
const Json = createLanguage('json', function () {
    require.ensure([], (require) => {
        require('brace/mode/json');
        this.setState({ modeReady: true });
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
