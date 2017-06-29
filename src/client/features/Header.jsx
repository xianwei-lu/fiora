import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { Layout, Button, Modal, Input, message } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';

import Avatar from 'components/Avatar';
import TextButton from 'components/TextButton';
import Icon from 'components/Icon';

import 'styles/feature/header.less';

import action from '../state/action';

@pureRender
class Header extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired,
    }
    static propTypes = {
        id: PropTypes.string,
        avatar: PropTypes.string,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            showInputGroupNameModel: false,
        };
    }
    jumpTo = (path) => {
        this.context.router.history.push(path);
    }
    openInputGroupNameModel = () => {
        this.setState({ showInputGroupNameModel: true });
    }
    closeInputGroupNameModel = () => {
        this.setState({ showInputGroupNameModel: false });
    }
    createGroup = () => {
        action.createGroup(ReactDom.findDOMNode(this.groupName).value).then((res) => {
            if (res.status === 201) {
                message.info('创建群组成功');
                this.setState({ showInputGroupNameModel: false });
            } else {
                message.error(`创建群组失败: ${res.data}`);
            }
        });
    }
    render() {
        const { id, avatar } = this.props;
        const { showInputGroupNameModel } = this.state;
        return (
            <Layout.Header className="feature-header">
                {
                    id ?
                        <div className="wrap">
                            <div className="button-group">
                                <Button type="primary" shape="circle" size="large" onClick={this.openInputGroupNameModel}>
                                    <Icon icon="icon-create-group-chat" size={22} />
                                </Button>
                            </div>
                            <Avatar className="avatar" width={32} height={32} src={avatar} circular />
                        </div>
                    :
                        <div className="wrap">
                            <TextButton text="注册" onClick={this.jumpTo.bind(this, '/signin')} />
                            <TextButton text="登录" onClick={this.jumpTo.bind(this, '/login')} />
                        </div>
                }
                <Modal
                    visible={showInputGroupNameModel}
                    title="请输入群组名"
                    onCancel={this.closeInputGroupNameModel}
                    onOk={this.createGroup}
                >
                    <Input placeholder="群组名" ref={i => this.groupName = i} />
                </Modal>
            </Layout.Header>
        );
    }
}

export default connect(
    $$state => ({
        id: $$state.getIn(['user', '_id']),
        avatar: $$state.getIn(['user', 'avatar']),
    }),
)(Header);
