import React, { Component } from 'react';
import { Layout, Menu, Button, Tooltip, Input, message } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import copy from 'copy-to-clipboard';

import Linkman from 'components/Linkman';
import Message from 'components/Message';
import GroupUser from 'components/GroupUser';
import Icon from 'components/Icon';

import 'styles/feature/chat.less';

import action from '../state/action';

const { Content, Sider } = Layout;

@immutableRenderDecorator
class Chat extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired,
    }
    static propTypes = {
        $$groups: ImmutablePropTypes.list,
        currentGroup: PropTypes.string.isRequired,
    }
    constructor(...args) {
        super(...args);
        this.onScrollHandle = null;
        this.updateOnlineTask = null;
    }
    componentDidMount() {
        this.updateOnlineTask = setInterval(() => {
            const $$group = this.getCurrentGroup();
            if ($$group) {
                action.updateGroupOnline($$group.get('_id'));
            }
        }, 60000);
    }
    componentDidUpdate(prevProps) {
        if (!prevProps.$$groups && this.props.$$groups) {
            action.selectGroup(this.context.router.route.match.params.name);
        }
    }
    componentWillUnmount() {
        clearImmediate(this.updateOnlineTask);
    }
    getCurrentGroup = () => {
        const { $$groups, currentGroup } = this.props;
        return $$groups && $$groups.find(
            ($$g) => $$g.get('name') === currentGroup,
        );
    }
    handleSelectGroup = ({ key }) => {
        action.selectGroup(key);
        this.context.router.history.push(`/group/${key}`);
    }
    handleInputKeyDown = (e) => {
        if (e.keyCode === 9) {
            e.preventDefault();
            return 0;
        }
    }
    handleInputEnter = (e) => {
        if (!e.shiftKey) {
            const $$group = this.getCurrentGroup();
            action.sendMessage($$group.get('_id'), 'group', {
                type: 'text',
                content: e.target.value,
            }).then((res) => {
                if (res.status !== 201) {
                    message.error(`消息发送失败, ${res.data}`);
                }
            });
            e.target.style.height = '40px';
            e.target.value = '';
            e.preventDefault();
        }
    }
    handleMessageListScroll = (e) => {
        const $messageList = e.target;
        if (this.onScrollHandle) {
            clearTimeout(this.onScrollHandle);
        }
        this.onScrollHandle = setTimeout(() => {
            action.setAutoScroll($messageList.scrollHeight - $messageList.scrollTop - $messageList.clientHeight < $messageList.clientHeight / 2);
        }, 50);
    }
    handleShareGroup = () => {
        copy(window.location.href);
        message.info('已复制邀请链接, 发送给你的朋友吧');
    }
    renderGroups = () => {
        const { $$groups, currentGroup } = this.props;
        if (!$$groups) {
            return null;
        }
        return (
            <Menu className="linkman-list" mode="inline" selectedKeys={[currentGroup]} onSelect={this.handleSelectGroup}>
                {
                    $$groups.map(($$group) => {
                        const name = $$group.get('name');
                        const avatar = $$group.get('avatar');
                        const $$messages = $$group.get('messages');
                        const $$lastMessage = $$messages.get($$messages.size - 1);
                        let lastMessage = '';
                        if ($$lastMessage) {
                            lastMessage = `${$$lastMessage.getIn(['from', 'username'])}: ${$$lastMessage.get('content')}`;
                        }
                        return (
                            <Menu.Item key={name}>
                                <Linkman
                                    avatar={avatar}
                                    username={name}
                                    content={$$lastMessage ? lastMessage : '...'}
                                />
                            </Menu.Item>
                        );
                    })
                }
            </Menu>
        );
    }
    renderMessage = () => {
        const $$messages = this.getCurrentGroup().get('messages');
        return $$messages.map(($$message, index) => (
            <Message
                key={`message${$$message.get('_id')}`}
                id={$$message.get('_id')}
                avatar={$$message.getIn(['from', 'avatar'])}
                username={$$message.getIn(['from', 'username'])}
                time={$$message.get('createTime')}
                type={$$message.get('type')}
                content={$$message.get('content')}
                status={$$message.get('status')}
                isSimple={index > 0 ? $$messages.getIn([index - 1, 'from', '_id']) === $$message.getIn(['from', '_id']) : false}
            />
        ));
    }
    render() {
        const $$group = this.getCurrentGroup();
        return (
            <Layout className="feature-chat">
                <Layout className="wrap">
                    <Sider className="sider" width={300}>
                        {this.renderGroups()}
                    </Sider>
                    {
                        $$group ?
                            <Layout>
                                <Layout className="window">
                                    <div className="header">
                                        <div className="avatar-name">
                                            <p className="name">{$$group.get('name')}</p>
                                        </div>
                                        <div className="button-group">
                                            <Tooltip title="分享群组" mouseEnterDelay={0.5}>
                                                <Button shape="circle" onClick={this.handleShareGroup}>
                                                    <Icon icon="icon-share-copy" size={14} />
                                                </Button>
                                            </Tooltip>
                                        </div>
                                    </div>
                                    <Content className="message-list" onScroll={this.handleMessageListScroll}>
                                        {this.renderMessage()}
                                    </Content>
                                    <div className="footer">
                                        <Input
                                            className="input"
                                            type="textarea"
                                            placeholder="输入要发送的消息"
                                            autosize={{ minRows: 1, maxRows: 5 }}
                                            onKeyDown={this.handleInputKeyDown}
                                            onPressEnter={this.handleInputEnter}
                                        />
                                    </div>
                                </Layout>
                                <Sider className="user-list" ref={(i) => this.sider = i} collapsible collapsedWidth={0} trigger={null} width={240}>
                                    <div className="title">
                                        <p>在线成员: {$$group.get('onlines').size}/{$$group.get('members')}</p>
                                    </div>
                                    <ul className="group-user-list">
                                        {
                                            $$group.get('onlines').map(($$online, i) => (
                                                <GroupUser key={i} avatar={$$online.getIn(['user', 'avatar'])} username={$$online.getIn(['user', 'username'])} os={$$online.get('os')} browser={$$online.get('browser')} />
                                            ))
                                        }
                                    </ul>
                                </Sider>
                            </Layout>
                        :
                            <div>未选中群组</div>
                    }
                </Layout>
            </Layout>
        );
    }
}

export default connect(
    ($$state) => ({
        $$groups: $$state.getIn(['user', 'groups']),
        currentGroup: $$state.getIn(['currentGroup']),
    }),
)(Chat);
