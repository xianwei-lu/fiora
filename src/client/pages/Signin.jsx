import React, { Component } from 'react';
import { Form, Icon, Input, Button, message } from 'antd';

import View from 'components/View';
import 'styles/page/login.less';

import server from '../server';

class Signin extends Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                server.register(values.username, values.password).then(response => {
                    console.log(response);
                    if (response.status !== 201) {
                        message.error(response.data), 3;
                    }
                })
            }
        });
    }
    checkUsername = (rule, value, callback) => {
        const form = this.props.form;
        if (value && !/^([0-9a-zA-Z]{1,2}|[\u4e00-\u9eff]){1,8}$/.test(value)) {
            callback('昵称不合法');
        } else {
            callback();
        }
    }
    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value === undefined || value && value !== form.getFieldValue('password')) {
            callback('输入的密码不一致');
        } else {
            callback();
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="page-login">
                <Form.Item>
                    {
                        getFieldDecorator('username', {
                            rules: [{
                                required: true,
                                message: '昵称不能为空'
                            }, {
                                validator: this.checkUsername
                            }],
                        })(
                            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="请输入昵称, 支持中文/英文/数字" />
                        )
                    }
                </Form.Item>
                <Form.Item>
                    {
                        getFieldDecorator('password', {
                            rules: [{
                                required: true,
                                message: '密码不能为空'
                            }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入密码, 越复杂越好" />
                        )
                    }
                </Form.Item>
                <Form.Item>
                    {
                        getFieldDecorator('passwordConfirm', {
                            rules: [{
                                required: true,
                                message: '请重复密码'
                            }, {
                                validator: this.checkPassword
                            }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请再输入次密码, 不知道你还记得吗" />
                        )
                    }
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">注册</Button>
                </Form.Item>
            </Form>
        );
    }
}

export default Form.create()(Signin);
