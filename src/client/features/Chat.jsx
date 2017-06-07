import React, { Component } from 'react';
import { Layout, Menu, Button, Tooltip } from 'antd';

import 'styles/feature/chat.less';

const { Content, Sider } = Layout;

export default class Chat extends Component {
    render() {
        return (
            <Layout className="feature-chat">
                <Layout className="wrap">
                    <Sider className="sider" width={300}>
                        <Menu className="linkman-list" mode="inline">
                            <Menu.Item className="linkman-item">
                                <img className="avatar" src="https://assets.suisuijiang.com/group_avatar_default.jpeg?imageView2/2/w/40/h/40" />
                                <div>
                                    <div className="nick-time">
                                        <span>fiora</span>
                                        <span>11:38 AM</span>
                                    </div>
                                    <div className="content">碎碎酱: 九分裤水电费</div>
                                </div>
                            </Menu.Item>
                            <Menu.Item className="linkman-item">b</Menu.Item>
                            <Menu.Item className="linkman-item">c</Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout>
                        <Layout className="window">
                            <div className="header">
                                <div>
                                    <Tooltip title="用户列表" mouseEnterDelay={1}>
                                        <Button shape="circle" icon="search" size="large" />
                                    </Tooltip>
                                </div>
                            </div>
                            <Content className="message-list">content</Content>
                            <div className="footer">输入区</div>
                        </Layout>
                        <Sider className="user-list" ref={i => this.sider = i} collapsible collapsedWidth={0} trigger={null}>用户列表</Sider>
                    </Layout>
                </Layout>
            </Layout>
        );
    }
}
