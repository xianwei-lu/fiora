import React, { Component } from 'react';
import { Layout, Menu, Button, Tooltip, Input, Icon } from 'antd';

import Linkman from 'components/Linkman';
import Avatar from 'components/Avatar';
import Message from 'components/Message';
import GroupUser from 'components/GroupUser';

import 'styles/feature/chat.less';

const { Content, Sider } = Layout;

export default class Chat extends Component {
    render() {
        return (
            <Layout className="feature-chat">
                <Layout className="wrap">
                    <Sider className="sider" width={300}>
                        <Menu className="linkman-list" mode="inline">
                            <Menu.Item>
                                <Linkman
                                    avatar="https://assets.suisuijiang.com/group_avatar_default.jpeg?imageView2/2/w/40/h/40"
                                    username="Fiora" time="11:34 AM" content="碎碎酱: 呵呵呵呵呵呵呵"
                                />
                            </Menu.Item>
                            <Menu.Item>
                                <Linkman
                                    avatar="https://assets.suisuijiang.com/group_avatar_default.jpeg?imageView2/2/w/40/h/40"
                                    username="Fiora" time="11:34 AM" content="碎碎酱: 呵呵呵呵呵呵呵啊啊啊啊啊啊啊啊啊"
                                />
                            </Menu.Item>
                            <Menu.Item>
                                <Linkman
                                    avatar="https://assets.suisuijiang.com/group_avatar_default.jpeg?imageView2/2/w/40/h/40"
                                    username="Fiora" time="11:34 AM" content="碎碎酱: 呵呵呵呵呵呵呵"
                                />
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout>
                        <Layout className="window">
                            <div className="header">
                                <div className="avatar-name">
                                    <Avatar className="avatar" width={36} height={36} src="https://cdn.suisuijiang.com/user_593904a3c975c0695ce1ff95_1496916462029.png?imageView2/2/w/44/h/44" circular />
                                    <p className="name">Fiora聊天室</p>
                                </div>
                                <div className="button-group">
                                    <Tooltip title="用户列表" mouseEnterDelay={1}>
                                        <Button shape="circle" icon="search" size="large" />
                                    </Tooltip>
                                    <Tooltip title="更多" mouseEnterDelay={1}>
                                        <Button shape="circle" icon="search" size="large" />
                                    </Tooltip>
                                </div>
                            </div>
                            <Content className="message-list">
                                <Message
                                    avatar="https://assets.suisuijiang.com/group_avatar_default.jpeg?imageView2/2/w/40/h/40"
                                    username="Fiora" time="11:34 AM" content="呵呵呵呵呵呵呵啊啊啊啊啊啊啊啊啊"
                                />
                                <Message
                                    avatar="https://assets.suisuijiang.com/group_avatar_default.jpeg?imageView2/2/w/40/h/40"
                                    username="Fiora" time="11:34 AM" content="呵呵呵呵呵呵呵啊啊啊啊啊啊啊啊啊" isSimple
                                />
                                <Message
                                    avatar="https://assets.suisuijiang.com/group_avatar_default.jpeg?imageView2/2/w/40/h/40"
                                    username="Fiora" time="11:34 AM" content="呵呵呵呵呵呵呵啊啊啊啊啊啊啊啊啊" isSimple
                                />
                                <Message
                                    avatar="https://assets.suisuijiang.com/group_avatar_default.jpeg?imageView2/2/w/40/h/40"
                                    username="Fiora" time="11:34 AM" content="呵呵呵呵呵呵呵啊啊啊啊啊啊啊啊啊"
                                />
                                <Message
                                    avatar="https://assets.suisuijiang.com/group_avatar_default.jpeg?imageView2/2/w/40/h/40"
                                    username="Fiora" time="11:34 AM" content="呵呵呵呵呵呵呵啊啊啊啊啊啊啊啊啊" isSimple
                                />
                            </Content>
                            <div className="footer">
                                <Input className="input" type="textarea" placeholder="Autosize height" autosize={{ minRows: 1, maxRows: 5 }} />
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
