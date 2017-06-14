import React, { Component } from 'react';
import { Layout, Menu, Button, Tooltip, Input } from 'antd';
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
        groups: ImmutablePropTypes.list,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            selectedGroup: [],
        };
    }
    componentDidUpdate(prevProps) {
        if (!prevProps.groups && this.props.groups) {
            const { name } = this.context.router.route.match.params;
            if (name) {
                console.log('更新');
                this.setState({ selectedGroup: [name] });
            }
        }
    }
    handleSelectGroup = ({ key }) => {
        this.setState({ selectedGroup: [key] });
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
            action.sendMessage('58f703c550d498ba50e28d48', 'group', {
                type: 'text',
                content: e.target.value,
            });
            e.preventDefault();
        }
    }
    renderGroups = () => {
        const { groups } = this.props;
        if (!groups) {
            return null;
        }
        return groups.map((group) => {
            const name = group.get('name');
            const avatar = group.get('avatar');
            const messages = group.get('messages');
            const lastMessage = messages.size > 0 ? messages.get(messages.size - 1) : null;

            return (
                <Menu.Item key={name}>
                    <Linkman
                        avatar={avatar}
                        username={name}
                        content={lastMessage ? '显示最后一条消息' : '...'}
                    />
                </Menu.Item>
            );
        });
    }
    render() {
        const { selectedGroup } = this.state;
        return (
            <Layout className="feature-chat">
                <Layout className="wrap">
                    <Sider className="sider" width={300}>
                        <Menu className="linkman-list" mode="inline" defaultSelectedKeys={['2']} selectedKey={selectedGroup} onSelect={this.handleSelectGroup}>
                            {this.renderGroups()}
                        </Menu>
                    </Sider>
                    <Layout>
                        <Layout className="window">
                            <div className="header">
                                <div className="avatar-name">
                                    <p className="name">Fiora聊天室</p>
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
                            <Content className="message-list">
                                <Message
                                    avatar="https://assets.suisuijiang.com/group_avatar_default.jpeg?imageView2/2/w/40/h/40"
                                    username="Fiora"
                                    time="11:34 AM"
                                    content="呵呵呵呵呵呵呵啊啊啊啊啊啊啊啊啊\n第二行"
                                />
                                <Message
                                    avatar="https://assets.suisuijiang.com/group_avatar_default.jpeg?imageView2/2/w/40/h/40"
                                    username="Fiora"
                                    time="11:34 AM"
                                    content="呵呵呵呵呵呵呵啊啊啊啊啊啊啊啊啊"
                                    isSimple
                                />
                                <Message
                                    avatar="https://assets.suisuijiang.com/group_avatar_default.jpeg?imageView2/2/w/40/h/40"
                                    username="Fiora"
                                    time="11:34 AM"
                                    content="呵呵呵呵呵呵呵啊啊啊啊啊啊啊啊啊"
                                    isSimple
                                />
                                <Message
                                    avatar="https://assets.suisuijiang.com/group_avatar_default.jpeg?imageView2/2/w/40/h/40"
                                    username="Fiora"
                                    time="11:34 AM"
                                    content="呵呵呵呵呵呵呵啊啊啊啊啊啊啊啊啊"
                                />
                                <Message
                                    avatar="https://assets.suisuijiang.com/group_avatar_default.jpeg?imageView2/2/w/40/h/40"
                                    username="Fiora"
                                    time="11:34 AM"
                                    content="呵呵呵呵呵呵呵啊啊啊啊啊啊啊啊啊"
                                    isSimple
                                />
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
                        <Sider className="user-list" ref={i => this.sider = i} collapsible collapsedWidth={0} trigger={null} width={240}>
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
                </Layout>
            </Layout>
        );
    }
}

export default connect(
    state => ({
        groups: state.getIn(['user', 'groups']),
    }),
)(Chat);
