import React, { Component } from 'react';

import View from 'components/View';
import Form from 'features/Form';
import Avatar from 'components/Avatar';
import 'styles/page/login.less';

export default class Login extends Component {
    onLogin = ({ username, password }) => {
        console.log('login', username, password);
    }
    render() {
        return (
            <View className="page-login">
                <Avatar width={60} height={60} circular />
                <Form className="form" onSubmit={this.onLogin} button="登录">
                    <Form.Input placeholder="昵称" name="username" />
                    <Form.Input placeholder="密码" name="password" />
                </Form>
            </View>
        );
    }
}
