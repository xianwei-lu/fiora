import React, { Component } from 'react';
import { Layout, Button } from 'antd';

import Avatar from 'components/Avatar';

import 'styles/feature/header.less';

export default class Header extends Component {
    render() {
        return (
            <Layout.Header className="feature-header">
                <div className="wrap">
                    <div className="button-group">
                        <Button type="primary" shape="circle" icon="search" />
                        <Button type="primary" shape="circle" icon="search" />
                        <Button type="primary" shape="circle" icon="search" />
                        <Button type="primary" shape="circle" icon="search" />
                    </div>
                    <Avatar className="avatar" width={32} height={32} src="https://cdn.suisuijiang.com/user_593904a3c975c0695ce1ff95_1496916462029.png?imageView2/2/w/44/h/44" circular />
                </div>
            </Layout.Header>
        );
    }
}
