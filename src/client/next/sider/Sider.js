import React, { Component } from 'react';
import { Menu, Layout } from 'antd';
import Avatar from 'components/Avatar';
import 'next/styles/sider.less';

const { Sider } = Layout;

class AppSider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true,
        };
    }

    handleCollapseChange = () => {
        this.setState({ collapsed: !this.state.collapsed });
    }

    handleMenuClick = ({ key }) => {
        console.log(key);
    }

    render() {
        const { collapsed } = this.state;
        return (
            <Sider
                className="sider" width={200} collapsedWidth={56}
                collapsed={collapsed} onCollapse={this.handleCollapseChange}
                collapsible
            >
                <div>
                    <Avatar width={48} height={48} />
                    <Menu
                        className={collapsed ? 'collapsed' : ''}
                        theme="dark" mode="inline" defaultSelectedKeys={['1']}
                        onClick={this.handleMenuClick}
                    >
                        <Menu.Item key="1">
                            <i className="icon">&#xe607;</i>
                            <span className="nav-text">聊天</span>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <i className="icon">&#xe600;</i>
                            <span className="nav-text">联系人</span>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <i className="icon">&#xe606;</i>
                            <span className="nav-text">系统设置</span>
                        </Menu.Item>
                    </Menu>
                </div>
                <div>
                    <Menu
                        className={collapsed ? 'collapsed' : ''}
                        theme="dark" mode="inline" defaultSelectedKeys={['1']}
                        onClick={this.handleMenuClick}
                    >
                        <Menu.Item key="1">
                            <i className="icon">&#xe607;</i>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <i className="icon">&#xe600;</i>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <i className="icon">&#xe606;</i>
                        </Menu.Item>
                    </Menu>
                </div>
            </Sider>
        );
    }
}

export default AppSider;
