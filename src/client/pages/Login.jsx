import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Icon, Input, Button, message } from 'antd';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';

import 'styles/page/login.less';

import action from '../state/action';

@immutableRenderDecorator
class Login extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired,
    }
    static propTypes = {
        form: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                action.login(values.username, values.password).then((response) => {
                    if (response.status !== 201) {
                        message.error(response.data, 3);
                    } else {
                        window.localStorage.setItem('token', response.data.token);
                        this.context.router.history.push('/');
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
            <div className="page-login">
                <Form onSubmit={this.handleSubmit}>
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
            </div>
        );
    }
}

export default Form.create()(Login);
