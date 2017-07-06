import React, { Component } from 'react';
import { Layout, Menu, Button, Tooltip, Input, message } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import pureRender from 'pure-render-decorator';

import Linkman from 'components/Linkman';
import Message from 'components/Message';
import GroupUser from 'components/GroupUser';

import 'styles/feature/chat.less';

import action from '../state/action';

const { Content, Sider } = Layout;

@pureRender
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
    }
    componentDidUpdate(prevProps) {
        if (!prevProps.$$groups && this.props.$$groups) {
            action.selectGroup(this.context.router.route.match.params.name);
        }
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
                                            <Tooltip title="用户列表" mouseEnterDelay={1}>
                                                <Button shape="circle" icon="search" />
                                            </Tooltip>
                                            <Tooltip title="更多" mouseEnterDelay={1}>
                                                <Button shape="circle" icon="search" />
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
                                            placeholder="Autosize height"
                                            autosize={{ minRows: 1, maxRows: 5 }}
                                            onKeyDown={this.handleInputKeyDown}
                                            onPressEnter={this.handleInputEnter}
                                        />
                                    </div>
                                </Layout>
                                <Sider className="user-list" ref={(i) => this.sider = i} collapsible collapsedWidth={0} trigger={null} width={240}>
                                    <div className="title">
                                        <p>成员: 8/18</p>
                                        <Button shape="circle" icon="search" size="small" />
                                    </div>
                                    <ul className="group-user-list">
                                        <GroupUser avatar="https://cdn.suisuijiang.com/user_593904a3c975c0695ce1ff95_1496916462029.png?imageView2/2/w/44/h/44" username="碎碎酱" icon="android" />
                                        <GroupUser avatar="https://cdn.suisuijiang.com/user_593904a3c975c0695ce1ff95_1496916462029.png?imageView2/2/w/44/h/44" username="碎碎酱的小号" icon="apple" />
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
