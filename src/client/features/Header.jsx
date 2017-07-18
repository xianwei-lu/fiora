import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { Layout, Button, Modal, Input, message } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';

import Avatar from 'components/Avatar';
import TextButton from 'components/TextButton';
import Icon from 'components/Icon';
import SearchGroup from 'features/SearchGroup';

import 'styles/feature/header.less';

import action from '../state/action';

@immutableRenderDecorator
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
            showCreateGroupModel: false,
            createGroupLoading: false,
            searchResult: [
                {
                    _id: '5954d52d444d6b9baca060ac',
                    name: 'fiora',
                    members: 2,
                    avatar: 'https://assets.suisuijiang.com/group_avatar_default.jpeg',
                },
                {
                    _id: '5954d52d444d6b9baca060ad',
                    name: 'aaa',
                    members: 12,
                    avatar: 'https://assets.suisuijiang.com/group_avatar_default.jpeg',
                },
            ],
        };
        this.showSearchGroup = action.setShowSearchGroup.bind(null, true);
    }
    jumpTo = (path) => {
        this.context.router.history.push(path);
    }
    openCreateGroupModel = () => {
        this.setState({ showCreateGroupModel: true });
    }
    closeCreateGroupModel = () => {
        this.setState({ showCreateGroupModel: false });
    }
    createGroup = () => {
        this.setState({ createGroupLoading: true });
        action.createGroup(ReactDom.findDOMNode(this.createGroupInput).value).then((res) => {
            if (res.status === 201) {
                this.setState({ showCreateGroupModel: false, createGroupLoading: false });
                message.info('创建群组成功');
                this.context.router.history.push(`/group/${res.data.name}`);
            } else {
                message.error(`创建群组失败: ${res.data}`);
                this.setState({ createGroupLoading: false });
            }
        });
    }
    render() {
        const { id, avatar } = this.props;
        const { showCreateGroupModel, createGroupLoading } = this.state;
        return (
            <Layout.Header className="feature-header">
                {
                    id ?
                        <div className="wrap">
                            <div className="button-group">
                                <Button type="primary" shape="circle" size="large" onClick={this.showSearchGroup}>
                                    <Icon icon="icon-search" size={22} />
                                </Button>
                                <Button type="primary" shape="circle" size="large" onClick={this.openCreateGroupModel}>
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
                <SearchGroup />
                <Modal
                    visible={showCreateGroupModel}
                    title="创建群组"
                    onCancel={this.closeCreateGroupModel}
                    onOk={this.createGroup}
                    confirmLoading={createGroupLoading}
                >
                    <Input placeholder="请输入群组名" ref={(i) => this.createGroupInput = i} />
                </Modal>
            </Layout.Header>
        );
    }
}

export default connect(
    ($$state) => ({
        id: $$state.getIn(['user', '_id']),
        avatar: $$state.getIn(['user', 'avatar']),
    }),
)(Header);
