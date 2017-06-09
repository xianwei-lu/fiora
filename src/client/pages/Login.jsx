import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Icon, Input, Button, message } from 'antd';

import 'styles/page/login.less';

import server from '../server';

class Login extends Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                server.login(values.username, values.password).then((response) => {
                    console.log(response);
                    if (response.status !== 201) {
                        message.error(response.data, 3);
                    }
                });
            }
        });
    }
    toSignin = () => {
        this.props.history.push('/signin');
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
                                message: '昵称不能为空',
                            }],
                        })(
                            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="你的昵称" />,
                        )
                    }
                </Form.Item>
                <Form.Item>
                    {
                        getFieldDecorator('password', {
                            rules: [{
                                required: true,
                                message: '密码不能为空',
                            }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="你的密码" />,
                        )
                    }
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">登录</Button>
                    <p className="login-form-text" onClick={this.toSignin}>还没有账号? <a>去注册</a></p>
                </Form.Item>
            </Form>
        );
    }
}

export default Form.create()(Login);
