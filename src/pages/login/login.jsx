import React, { Component } from 'react'
import './login.less'
import { Form, Input, Button, notification } from 'antd';
import { UserOutlined, KeyOutlined } from '@ant-design/icons';
import $http from '../../ajax/http.js'

const layout = {
    labelCol: {
        span: 0,
    },
    wrapperCol: {
        span: 24,
    }
};

const tailLayout = {
    wrapperCol: { offset: 0, span: 24 },
};

export default class Login extends Component {
    formRef = React.createRef();

    onFinish = values => {
        $http({
            method: "POST",
            url: "/article/check_login_status/",
            data: JSON.stringify(values)
        }).then(res => {
            localStorage["token"] = 1;
            this.props.history.replace("/");
        }).catch(err => {
            notification['error']({
                message: '错误提示',
                description: '用户名或密码错误'
            })
        })
    }

    onFinishFailed = () => {
        notification['error']({
            message: '错误提示',
            description: '用户名或密码错误'
        })
    }

    render() {
        return (
            <div className="login">
                <div className="login-container">
                    <h2>React App管理系统</h2>
                    <div>
                        <Form {...layout} ref={this.formRef} name="control-ref" preserve={false} onFinish={this.onFinish} onFinishFailed={this.onFinishFailed}>
                            <Form.Item label="账号" style={{ marginBottom: 0 }}>
                                <Form.Item
                                    name="account"
                                    style={{ display: 'inline-block', width: 'calc(100%)', marginRight: 15 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: "账号不能为空"
                                        },
                                        {
                                            pattern: /^[a-zA-Z0-9_()（）\u4e00-\u9fa5]{1,32}$/,
                                            message: "账号为1至32位汉字、字母、数字、下划线或中英文括号"
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="请输入账号"
                                        prefix={<UserOutlined className="site-form-item-icon" />}
                                    />
                                </Form.Item>
                            </Form.Item>
                            <Form.Item label="密码" style={{ marginBottom: 0 }}>
                                <Form.Item
                                    name="password"
                                    style={{ display: 'inline-block', width: 'calc(100%)' }}
                                    rules={[
                                        {
                                            required: true,
                                            message: "密码不能为空"
                                        },
                                        {
                                            pattern: /^[a-zA-Z0-9_()（）\u4e00-\u9fa5]{1,32}$/,
                                            message: "密码为1至32位汉字、字母、数字、下划线或中英文括号"
                                        },
                                    ]}
                                >
                                    <Input.Password
                                        placeholder="请输入密码"
                                        prefix={<KeyOutlined className="site-form-item-icon" />}
                                    />
                                </Form.Item>
                            </Form.Item>
                            <Form.Item {...tailLayout}>
                                <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                                    登录
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        )
    }
}
