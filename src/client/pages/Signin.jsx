import React, { Component } from 'react';
import { message } from 'antd';

import View from 'components/View';
import Form from 'features/Form';
import 'styles/page/login.less';

export default class Signin extends Component {
    onSignin = ({ username, password, repeatPassword }) => {
        console.log('signin', username, password, repeatPassword);
        message.info('111222333');
    }
    render() {
        return (
            <View className="page-login">
                <Form className="form" onSubmit={this.onSignin} button="注册">
                    <Form.Input placeholder="请输入昵称, 支持中文/英文/数字" name="username" />
                    <Form.Input placeholder="请输入密码, 越复杂越好" name="password" />
                    <Form.Input placeholder="再输入次密码, 不知道你还记得吗" name="repeatPassword" />
                </Form>
            </View>
        );
    }
}
