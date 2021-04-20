import React, { Component } from 'react'
import { Row, Col, Tabs, Typography, Switch, message } from 'antd'
import { Card, Form, Radio, Input, Button, Space, Alert, Descriptions, Popover } from 'antd'
import { SyncOutlined, PlusOutlined, ImportOutlined, UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

export default class config extends Component {
    state = {
        mode: '1'
    }

    onChange = (checked) => {
        console.log(`switch to ${checked}`);
    }

    onTabPane4Finish = values => {
        message.success('提交成功！');
    }

    onTabPane4FinishFailed = errorInfo => {
        message.error('请填写正确的内容！');
    }

    onTabPane3Finish = values => {
        message.success('提交成功！');
    }

    onTabPane3FinishFailed = errorInfo => {
        message.error('请填写正确的内容！');
    }

    onTabPane4Finish = values => {
        message.success('提交成功！');
    }

    onTabPane4FinishFailed = errorInfo => {
        message.error('请填写正确的内容！');
    }

    onTabPane5Finish = values => {
        message.success('提交成功！');
    }

    onTabPane5FinishFailed = errorInfo => {
        message.error('请填写正确的内容！');
    }

    onTabPane6Finish = values => {
        message.success('提交成功！');
    }

    onTabPane6FinishFailed = errorInfo => {
        message.error('请填写正确的内容！');
    }

    render() {
        const TabPane1 = <>
            <Typography.Title level={3}>基本设置</Typography.Title>
        </>

        const TabPane2 = <>
            <Typography.Title level={5}>安全设置</Typography.Title>
            <Form style={{maxWidth: 500}} layout='vertical'>
                <Form.Item
                label="访问IP校验"
                help="建议开启，校验是否获取了真实的访问者IP，防止因为增加的反向代理层导致基于IP的安全策略失效，当校验失败时会在登录时弹窗提醒。如果你在内网部署且仅在内网使用可以关闭该特性。">
                <Switch
                    checkedChildren="开启"
                    unCheckedChildren="关闭"
                    onChange={this.onChange}
                />
                </Form.Item>
            </Form>
        </>

        const TabPane3 = <>
            <Typography.Title level={3}>LDAP设置</Typography.Title>
            <Form labelCol={{ span: 3 }} wrapperCol={{ span: 10 }} onFinish={this.onTabPane3Finish} onFinishFailed={this.onTabPane3FinishFailed}>
                <Form.Item label="LDAP服务地址" name="createHost_Type"
                    rules={[
                        {
                            required: true,
                            message: "LDAP服务地址不能为空"
                        },
                        {
                            pattern: /^[a-zA-Z0-9_()（）\u4e00-\u9fa5]{1,32}$/,
                            message: "LDAP服务地址为1至32位汉字、字母、数字、下划线或中英文括号"
                        },
                    ]} >
                    <Input placeholder="例如：ldap.spug.dev" />
                </Form.Item>
                <Form.Item label="LDAP服务端口" name="createHost_Name" required
                    rules={[
                        {
                            required: true,
                            message: "LDAP服务端口不能为空"
                        },
                        {
                            pattern: /^[a-zA-Z0-9_()（）\u4e00-\u9fa5]{1,32}$/,
                            message: "LDAP服务端口为1至32位汉字、字母、数字、下划线或中英文括号"
                        },
                    ]}
                >
                    <Input placeholder="例如：389" />
                </Form.Item>
                <Form.Item label="管理员DN" name="createHost_Ssh"
                    rules={[
                        {
                            required: true,
                            message: "管理员DN不能为空"
                        },
                        {
                            pattern: /^[a-zA-Z0-9_()（）\u4e00-\u9fa5]{1,32}$/,
                            message: "管理员DN为1至32位汉字、字母、数字、下划线或中英文括号"
                        },
                    ]}>
                    <Input placeholder="例如：cn=admin,dc=spug,dc=dev" />
                </Form.Item>
                <Form.Item label="管理员密码" name="createHost_Password"
                    rules={[
                        {
                            required: true,
                            message: "管理员密码不能为空"
                        },
                        {
                            pattern: /^[a-zA-Z0-9_()（）\u4e00-\u9fa5]{1,32}$/,
                            message: "管理员密码为1至32位汉字、字母、数字、下划线或中英文括号"
                        },
                    ]}>
                    <Input.Password placeholder="请输入LDAP管理员密码" />
                </Form.Item>
                <Form.Item label="LDAP搜索规则" name="createHost_Ssh"
                    rules={[
                        {
                            required: true,
                            message: "LDAP搜索规则不能为空"
                        },
                        {
                            pattern: /^[a-zA-Z0-9_()（）\u4e00-\u9fa5]{1,32}$/,
                            message: "LDAP搜索规则为1至32位汉字、字母、数字、下划线或中英文括号"
                        },
                    ]}>
                    <Input placeholder="例如：cn" />
                </Form.Item>
                <Form.Item label="基本DN" name="createHost_Ssh"
                    rules={[
                        {
                            required: true,
                            message: "基本DN不能为空"
                        },
                        {
                            pattern: /^[a-zA-Z0-9_()（）\u4e00-\u9fa5]{1,32}$/,
                            message: "基本DN为1至32位汉字、字母、数字、下划线或中英文括号"
                        },
                    ]}>
                    <Input placeholder="例如：dc=spug,dc=dev" />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 3, span: 10 }}>
                    <Space>
                        <Button type='primary' danger>测试LDAP</Button>
                        <Button type='primary' htmlType="submit">保存配置</Button>
                    </Space>
                </Form.Item>
            </Form>
        </>

        const TabPane4 = <>
            <Typography.Title level={3}>密钥设置</Typography.Title>
            <Alert
                message="小提示"
                description="在这里你可以上传并使用已有的密钥对，没有上传密钥的情况下，Spug会在首次添加主机时自动生成密钥对。"
                type="info"
                showIcon
                closable
                style={{width: 650}}
            />
            <div style={{height: 20, clear: 'both'}}></div>
            <Form style={{maxWidth: 650}} layout='vertical' onFinish={this.onTabPane4Finish} onFinishFailed={this.onTabPane4FinishFailed}>
                <Form.Item label="公钥" name="createHost_Type" help="一般位于 ~/.ssh/id_rsa.pub"
                    rules={[
                        {
                            required: true,
                            message: "用户名不能为空"
                        },
                        {
                            pattern: /^[a-zA-Z0-9_()（）\u4e00-\u9fa5]{1,32}$/,
                            message: "账号为1至32位汉字、字母、数字、下划线或中英文括号"
                        },
                    ]} >
                    <Input.TextArea rows={7} placeholder="请输入公钥" value="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCwXfMUaFueE6byQJx6z3anzl/Tbunf2LE0EbkWaUESwGJJc2A5FD9FIA/mT1yNptPHXwIWEVP2LmsZEZhMSu/GQyNIFFroBwBcTdQw9uQOGleD3f3vVqjSlPpP5roNVFV8cRuUpDn+s3PV8eU/sLnHay0Cjr/lFL1gK1qCtFWbYpUMllUgZgJqYm6N0S+6HAE+AAFmnqjsv+cnNRGZSlQikui+T0dCQvq3F5Qc8iMxIS5RN7pIhrUPKII7j2FITeVvvT9WOlfZNYeFA9zx3GqnugBV7nToKyElU+s3gQbvomvY+zVw42/dyNEAbU7cRQrPOq9PVfioQoaLkdHrYAPF" />
                </Form.Item>
                <Form.Item label="私钥" name="createHost_Name" help="一般位于 ~/.ssh/id_rsa" 
                    rules={[
                        {
                            required: true,
                            message: "主机名称不能为空"
                        },
                        {
                            pattern: /^[a-zA-Z0-9_()（）\u4e00-\u9fa5]{1,32}$/,
                            message: "主机名称为1至32位汉字、字母、数字、下划线或中英文括号"
                        },
                    ]}
                >
                    <Input.TextArea rows={10} placeholder="请输入私钥" value='-----BEGIN RSA PRIVATE KEY-----
                    MIIEpAIBAAKCAQEAsF3zFGhbnhOm8kCces92p85f027p39ixNBG5FmlBEsBiSXNg
                    ORQ/RSAP5k9cjabTx18CFhFT9i5rGRGYTErvxkMjSBRa6AcAXE3UMPbkDhpXg939
                    71ao0pT6T+a6DVRVfHEblKQ5/rNz1fHlP7C5x2stAo6/5RS9YCtagrRVm2KVDJZV
                    IGYCamJujdEvuhwBPgABZp6o7L/nJzURmUpUIpLovk9HQkL6txeUHPIjMSEuUTe6
                    SIa1DyiCO49hSE3lb70/VjpX2TWHhQPc8dxqp7oAVe506CshJVPrN4EG76Jr2Ps1
                    cONv3cjRAG1O3EUKzzqvT1X4qEKGi5HR62ADxQIDAQABAoIBAFx5dmo96cPx8/hT
                    rniqbUHBcPdQ0apAWXG+1TiOCcPGQgLXTx2+owogrJWLCTFwxtxj0Zk2jrqnThp/
                    4kYmiKCBNW+m1J+ShDrhyB/AZIWMhFStQmeLHcwEt1bL2MQCcyxjth1zGsGU4GjO
                    g/CoPlD0vk34AWAhRsa1FKkx2y00XY3Rvx1P14finXTKESR0LM15MHdbro6KKtrk
                    VI8FW0cY01284RgCAyQkCa+nIYf8A9rzpNGFCSK2GAseHT/MtvWYu5YCfea15hx5
                    a2grwgMrn9ttiQiR5gNv2d6GHMZ+PaHA1SJYMA1McyehsIaPpwbKYiKCL69zCPeV
                    ARkXXqUCgYEA3Hd1P1AQat0W4Xbpx3jQbJCGvIY/S70SoZhiFzHVK9CEaKa2PEDB
                    wxVBtwt5AxpBQyfTYVFjGDgw3I/EJKpORuMsXa9VlROdfyUCPAPNidu9DQXvBhJh'/>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 0, span: 15 }}>
                    <Button type='primary' htmlType="submit">保存设置</Button>
                </Form.Item>
            </Form>
        </>

        const TabPane5 = <>
            <Typography.Title level={3}>开放服务设置</Typography.Title>
            <Form style={{maxWidth: 650}} layout='vertical' onFinish={this.onTabPane5Finish} onFinishFailed={this.onTabPane5FinishFailed}>
                <Form.Item label="访问凭据" initialValue='JLV8IGO0DhoxcM7I' name="createHost_Type" help="该自定义凭据用于访问平台的开放服务，例如：配置中心的配置获取API等，其他开放服务请查询官方文档。"
                    rules={[
                        {
                            required: true,
                            message: "用户名不能为空"
                        },
                        {
                            pattern: /^[a-zA-Z0-9_()（）\u4e00-\u9fa5]{1,32}$/,
                            message: "账号为1至32位汉字、字母、数字、下划线或中英文括号"
                        },
                    ]} style={{marginBottom: 15}}>
                    <Input placeholder="请输入公钥" />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 0, span: 15 }}>
                    <Button type="primary" htmlType="submit">保存设置</Button>
                </Form.Item>
            </Form>
        </>

        const spugWx = <img src="http://image.qbangmang.com/spug-weixin.jpeg" alt='spug'/>;

        const TabPane6 = <>
            <Typography.Title level={3}>报警服务设置</Typography.Title>
            <Form style={{maxWidth: 650}} colon={true} onFinish={this.onTabPane6Finish} onFinishFailed={this.onTabPane6FinishFailed}>
                <Form.Item initialValue='JLV8IGO0DhoxcM7I' label="调用凭据" labelCol={{span: 3}} wrapperCol={{span: 21}} name="createHost_Type1" 
                    help={<span>如需要使用Spug内置的邮件和微信报警服务，请关注公众号<span style={{color: '#008dff', cursor: 'pointer'}}>  
                    <Popover content={spugWx}>
                        Spug运维
                    </Popover>
                  </span>在【我的】页面获取调用凭据，否则请留空。"</span>}
                    rules={[
                        {
                            required: true,
                            message: "用户名不能为空"
                        },
                        {
                            pattern: /^[a-zA-Z0-9_()（）\u4e00-\u9fa5]{1,32}$/,
                            message: "账号为1至32位汉字、字母、数字、下划线或中英文括号"
                        },
                    ]} style={{marginBottom: 15}}>
                    <Input placeholder="请输入Spug微信公众号获取到的Token" />
                </Form.Item>
                <Form.Item label="邮件服务" labelCol={{span: 3}} wrapperCol={{span: 21}} name="createHost_Type2" help="用于通过邮件方式发送报警信息"
                    rules={[
                        {
                            pattern: /^[a-zA-Z0-9_()（）\u4e00-\u9fa5]{1,32}$/,
                            message: "账号为1至32位汉字、字母、数字、下划线或中英文括号"
                        },
                    ]} style={{marginBottom: 15}}>
                    <Radio.Group
                        defaultValue={this.state.mode}
                        optionType="button"
                        buttonStyle="solid"
                        onChange={e => {this.setState({mode: e.target.value})}}
                    >
                        <Radio.Button value="1">内置</Radio.Button>
                        <Radio.Button value="2">自定义</Radio.Button>
                    </Radio.Group>
                    <div style={{display: this.state.mode === '1' ? 'none' : 'block'}}>
                        <Form.Item initialValue='JLV8IGO0DhoxcM7I' colon={true} labelCol={{span: 6}} wrapperCol={{span: 18}} required label="邮件服务器" name="createHost_Type3"
                        rules={[
                            {
                                required: true,
                                message: "用户名不能为空"
                            },
                            {
                                pattern: /^[a-zA-Z0-9_()（）\u4e00-\u9fa5]{1,32}$/,
                                message: "账号为1至32位汉字、字母、数字、下划线或中英文括号"
                            },
                        ]} style={{marginTop: 15, marginBottom: 15}}>
                            <Input placeholder="请输入Spug微信公众号获取到的Token"/>
                        </Form.Item>
                        <Form.Item initialValue='JLV8IGO0DhoxcM7I' colon={true} labelCol={{span: 6}} wrapperCol={{span: 18}} required label="端口" name="createHost_Type4"
                        rules={[
                            {
                                required: true,
                                message: "用户名不能为空"
                            },
                            {
                                pattern: /^[a-zA-Z0-9_()（）\u4e00-\u9fa5]{1,32}$/,
                                message: "账号为1至32位汉字、字母、数字、下划线或中英文括号"
                            },
                        ]} style={{marginBottom: 15}}>
                            <Input placeholder="请输入Spug微信公众号获取到的Token" />
                        </Form.Item>
                        <Form.Item initialValue='JLV8IGO0DhoxcM7I' labelCol={{span: 6}} wrapperCol={{span: 18}} required label="邮箱账号" name="createHost_Type5"
                        rules={[
                            {
                                required: true,
                                message: "用户名不能为空"
                            },
                            {
                                pattern: /^[a-zA-Z0-9_()（）\u4e00-\u9fa5]{1,32}$/,
                                message: "账号为1至32位汉字、字母、数字、下划线或中英文括号"
                            },
                        ]} style={{marginBottom: 15}}>
                            <Input placeholder="请输入Spug微信公众号获取到的Token" />
                        </Form.Item>
                        <Form.Item initialValue='JLV8IGO0DhoxcM7I' labelCol={{span: 6}} wrapperCol={{span: 18}} required label="密码/授权码" name="createHost_Type6"
                        rules={[
                            {
                                required: true,
                                message: "用户名不能为空"
                            },
                            {
                                pattern: /^[a-zA-Z0-9_()（）\u4e00-\u9fa5]{1,32}$/,
                                message: "账号为1至32位汉字、字母、数字、下划线或中英文括号"
                            },
                        ]} style={{marginBottom: 15}}>
                            <Input placeholder="请输入Spug微信公众号获取到的Token" />
                        </Form.Item>
                        <Form.Item initialValue='JLV8IGO0DhoxcM7I' labelCol={{span: 6}} wrapperCol={{span: 18}} required label="发件人昵称" name="createHost_Type7"
                        rules={[
                            {
                                required: true,
                                message: "用户名不能为空"
                            },
                            {
                                pattern: /^[a-zA-Z0-9_()（）\u4e00-\u9fa5]{1,32}$/,
                                message: "账号为1至32位汉字、字母、数字、下划线或中英文括号"
                            },
                        ]} style={{marginBottom: 15}}>
                            <Input placeholder="请输入Spug微信公众号获取到的Token"/>
                        </Form.Item>
                    </div>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 3, span: 21 }}>
                    <Space>
                        <Button type="primary" danger>测试邮件服务</Button>
                        <Button type="primary" htmlType="submit">保存设置</Button>
                    </Space>
                </Form.Item>
            </Form>
        </>

        const TabPane7 = <>
        <Typography.Title level={3}>关于</Typography.Title>
        <Descriptions column={1}>
            <Descriptions.Item label="操作系统">Linux-4.19.0-9.el7.ucloud.x86_64-x86_64-with-centos-7.8.2003-Core</Descriptions.Item>
            <Descriptions.Item label="Python版本">3.6.8</Descriptions.Item>
            <Descriptions.Item label="Django版本">2.2.13</Descriptions.Item>
            <Descriptions.Item label="Spug API版本">v2.3.15</Descriptions.Item>
            <Descriptions.Item label="Spug Web版本">v2.3.15</Descriptions.Item>
            <Descriptions.Item label="官网文档">
                <a href="https://spug.dev" target="_blank" rel="noopener noreferrer">https://spug.dev</a>
            </Descriptions.Item>
            <Descriptions.Item label="更新日志">
                <a href="https://spug.dev/docs/change-log/" target="_blank"
                rel="noopener noreferrer">https://spug.dev/docs/change-log/</a>
            </Descriptions.Item>
        </Descriptions>
        </>

        return (
            <div>
                <Card>
                    <Tabs tabPosition='left'>
                        <Tabs.TabPane tab="基本设置" key="1">
                            {TabPane1}
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="安全设置" key="2">
                            {TabPane2}
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="LDAP设置" key="3">
                            {TabPane3}
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="密钥设置" key="4">
                            {TabPane4}
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="开放服务设置" key="5">
                            {TabPane5}
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="报警服务设置" key="6">
                            {TabPane6}
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="关于" key="7">
                            {TabPane7}
                        </Tabs.TabPane>
                    </Tabs>
                </Card>
            </div>
        )
    }
}
