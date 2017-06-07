import React, { Component } from 'react';
import { Layout, Menu } from 'antd';

import 'styles/feature/header.less';

export default class Header extends Component {
    render() {
        return (
            <Layout.Header className="feature-header">
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
                    className="menu"
                >
                    <Menu.Item key="1">nav 1</Menu.Item>
                    <Menu.Item key="2">nav 2</Menu.Item>
                    <Menu.Item key="3">nav 3</Menu.Item>
                </Menu>
            </Layout.Header>
        );
    }
}
