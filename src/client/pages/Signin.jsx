import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Icon, Input, Button, message } from 'antd';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';


import 'styles/page/login.less';
import action from '../state/action';

@immutableRenderDecorator
class Signin extends Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                action.register(values.username, values.password).then((response) => {
                    if (response.status !== 201) {
                        message.error(response.data, 3);
                    }
                });
            }
        });
    }
    checkUsername = (rule, value, callback) => {
        if (value && !/^([0-9a-zA-Z]{1,2}|[\u4e00-\u9eff]){1,8}$/.test(value)) {
            callback('昵称不合法');
        } else {
            callback();
        }
    }
    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value === undefined || (value && value !== form.getFieldValue('password'))) {
            callback('输入的密码不一致');
        } else {
            callback();
        }
    }
    toLogin = () => {
        this.props.history.push('/login');
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
                                }, {
                                    validator: this.checkUsername,
                                }],
                            })(
                                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="请输入昵称, 支持中文/英文/数字" />,
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
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入密码, 越复杂越好" />,
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {
                            getFieldDecorator('passwordConfirm', {
                                rules: [{
                                    required: true,
                                    message: '请重复密码',
                                }, {
                                    validator: this.checkPassword,
                                }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请再输入次密码, 不知道你还记得吗" />,
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">注册</Button>
                        <p className="login-form-text" onClick={this.toLogin}>已有账号? <a>去登陆</a></p>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default Form.create()(Signin);
