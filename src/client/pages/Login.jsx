import React, { Component, PropTypes } from 'react';
import { Form, Icon, Input, Button, message } from 'antd';

import 'styles/page/login.less';

import server from '../server';

class Login extends Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
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
                </Form.Item>
            </Form>
        );
    }
}

export default Form.create()(Login);
