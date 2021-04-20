import React, { Component } from 'react'
import { Transfer } from 'antd'

export default class test extends Component {
    state = {
        editService_visible: false, // 创建应用
    }

    editService_formRef = React.createRef(); // 定义一个表单

    editService_onOk = e => {
        this.editService_formRef.current.validateFields()
            .then(values => {
                this.editService_formRef.current.resetFields();
                this.setState({
                    editService_visible: false
                });
                console.log("表单值：");
                console.log(values);
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    }

    editService_onCancel = e => {
        this.editService_formRef.current.resetFields();
        this.setState({
            editService_visible: false
        })
    }

    editService_onAfterClose = () => {
        console.log("modal 关闭了！");
    }

    render() {
        const { serviceDependent_targetKeys, serviceDependent_selectedKeys } = this.state;

        return (
            <>
                <Modal
                    title="编辑服务"
                    visible={this.state.editService_visible}
                    width={800}
                    onOk={this.editService_onOk}
                    onCancel={this.editService_onCancel}
                    okText="确认"
                    cancelText="取消"
                    afterClose={this.editService_onAfterClose}
                    maskClosable={false}
                    destroyOnClose={true}
                >
                    <Form labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} ref={this.editService_formRef} initialValues={this.state.editService_initialValues}>
                        <Form.Item label="应用名称" name="editService_name"
                            rules={[
                                {
                                    required: true,
                                    message: "应用名称不能为空"
                                },
                                {
                                    pattern: /^[a-zA-Z0-9_()（）\u4e00-\u9fa5]{1,32}$/,
                                    message: "应用名称为1至32位汉字、字母、数字、下划线或中英文括号"
                                },
                            ]}
                        >
                            <Input placeholder="请输入应用名称，例如：订单服务" />
                        </Form.Item>
                        <Form.Item label="唯一标识符" name="editService_id"
                            rules={[
                                {
                                    required: true,
                                    message: "唯一标识符不能为空"
                                },
                                {
                                    pattern: /^[a-zA-Z0-9_()（）\u4e00-\u9fa5]{1,32}$/,
                                    message: "唯一标识符为1至32位汉字、字母、数字、下划线或中英文括号"
                                },
                            ]}
                        >
                            <Input placeholder="请输入唯一标识符，例如：api_order" />
                        </Form.Item>
                        <Form.Item label="备注信息" name="editService_describe">
                            <Input.TextArea rows={4} placeholder="请输入主机备注信息" />
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title="问题详情"
                    visible={this.state.checkQuestion_Visible}
                    width={660}
                    onOk={this.checkQuestion_onOk}
                    onCancel={this.checkQuestion_onCancel}
                    okText="确认"
                    cancelText="取消"
                    afterClose={this.checkQuestion_onAfterClose}
                    maskClosable={false}
                    destroyOnClose={true}
                >
                    <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} initialValues={this.state.checkQuestion_initialValues}>
                        <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="资产" name="checkQuestion_capital">
                            <Select style={{ width: '100%' }}>
                                <Select.Option value="Bug">Bug</Select.Option>
                                <Select.Option value="任务">任务</Select.Option>
                                <Select.Option value="功能">功能</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="设备" name="checkQuestion_equipment">
                            <Select style={{ width: '100%' }}>
                                <Select.Option value="Bug">Bug</Select.Option>
                                <Select.Option value="任务">任务</Select.Option>
                                <Select.Option value="功能">功能</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="主题" name="checkQuestion_subject">
                            <Input />
                        </Form.Item>
                        <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="描述" name="checkQuestion_describe">
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="附件" name="checkQuestion_enclosure">
                            <Upload {...props}>
                                <Button icon={<UploadOutlined />}>点击上传</Button>
                            </Upload>
                        </Form.Item>
                        <Row>
                            <Col span={12}>
                                <Form.Item label="优先级" name="checkQuestion_priority">
                                    <Select placeholder="请选择优先级" style={{ width: '100%' }}>
                                        <Select.Option value="Bug">低</Select.Option>
                                        <Select.Option value="任务">中</Select.Option>
                                        <Select.Option value="功能">高</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="时间" name="checkQuestion_time">
                                    <DatePicker.RangePicker />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item label="版本" name="checkQuestion_version">
                                    <Select placeholder="请选择版本" style={{ width: '100%' }}>
                                        <Select.Option value="jack">无</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="模块" name="checkQuestion_modular">
                                    <Select placeholder="请选择模块" style={{ width: '100%' }}>
                                        <Select.Option value="jack">无</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item label="指派给" name="checkQuestion_assignedTo">
                                    <Select placeholder="请选择指派人" style={{ width: '100%' }}>
                                        <Select.Option value="jack">我</Select.Option>
                                        <Select.Option value="lucy">未指派</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="关注" name="checkQuestion_follow">
                                    <Select placeholder="请选择关注" style={{ width: '100%' }}>
                                        <Select.Option value="lucy">梦远他乡</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </>
        )
    }
}
