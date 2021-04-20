import React, { Component } from 'react'
import { Row, Col, Table, Alert, Tabs } from 'antd'
import { Card, Form, Space, Input, Button, Modal, Divider, Typography, message, Spin } from 'antd'
import { SyncOutlined, PlusOutlined, ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios'

export default class AppConfig extends Component {
    state = {
        createService_visible: false, // 创建服务
        service_selectedRowKeys: [], // 表格选择项Keys
        service_selectedRows: [], // 表格选择项Rows
        service_tableData: [], // 表格相关
        service_total: 0, // 表格相关
        service_tableSpin: true, // 表格相关
        editService_visible: false, // 编辑服务
        editService_initialValues: {

        }
    }

    /**
     * 创建应用Modal
    */
    createService_showModal = () => {
        this.setState({
            createService_visible: true,
        });
    }

    createService_formRef = React.createRef(); // 定义一个表单

    createService_onOk = e => {
        this.createService_formRef.current.validateFields()
            .then(values => {
                this.createService_formRef.current.resetFields();
                this.setState({
                    createService_visible: false
                });
                console.log("表单值：");
                console.log(values);
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    }

    createService_onCancel = e => {
        this.createService_formRef.current.resetFields();
        this.setState({
            createService_visible: false
        })
    }

    createService_onAfterClose = () => {
        console.log("modal 关闭了！");
    }

    /**
     * 表格
    */
    service_getColumns = () => {
        return [
            {
                title: '序号',
                dataIndex: 'id',
                width: 80,
            },
            {
                title: '应用名称',
                dataIndex: 'name',
                width: 200
            },
            {
                title: '标识符',
                dataIndex: 'uuid',
                width: 200
            },
            {
                title: '描述信息',
                dataIndex: 'describe',
                render(text, record) {
                    return <div dangerouslySetInnerHTML={{ __html: record.content }} style={{}} />
                }
            }, {
                title: '操作',
                width: 220,
                render: (text, record) => (
                    <Space split={<Divider type='vertical' />}>
                        <Typography.Link onClick={() => this.editservice_showModal(record.id, record.name, record.uuid, record.describe)}>编辑</Typography.Link>
                        <Typography.Link onClick={() => this.onDeleteService(record.id)}>删除</Typography.Link>
                        <Typography.Link>配置</Typography.Link>
                    </Space>
                )
            }
        ];
    }

    // 获取表格数据
    service_getData(pageNumber, pageSize) {
        let _this = this;
        _this.setState({
            service_tableSpin: true
        })
        axios.get(`http://localhost:5555/api/service_list/?pageSize=${pageSize}&pageNumber=${pageNumber}&sortName=id&sortOrder=desc&_=1595230808893`).then((resp) => {
            let ajaxData = [];
            for (let i = 0; i < resp.data.rows.length; i++) {
                ajaxData.push({
                    key: resp.data.rows[i].id,
                    id: resp.data.rows[i].id,
                    name: resp.data.rows[i].name,
                    uuid: resp.data.rows[i].uuid,
                    describe: resp.data.rows[i].describe.replace(/<[^>]*>|<\/[^>]*>/gm, "").substring(0, 54),
                    datetime: resp.data.rows[i].datetime,
                });
            }

            this.setState({
                service_tableData: ajaxData,
                service_total: resp.data.total,
                service_tableSpin: false
            })
        }, (err) => {
            _this.setState({
                service_tableSpin: false
            })
        });
    }

    service_onChange = (pageNumber, pageSize) => {
        this.service_pageNum = pageNumber;
        this.service_pageSize = pageSize;
        this.service_getData(pageNumber, pageSize);
    };

    service_onTableSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ service_selectedRowKeys: selectedRowKeys, service_selectedRows: selectedRows });
    };

    /**
     * 编辑服务
     */
    editservice_showModal = (id, name, uuid, describe) => {
        this.setState({
            editService_visible: true, // 编辑服务
            editService_initialValues: {
                editService_name: name,
                editService_id: uuid,
                editService_describe: describe
            }
        })
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

    /**
     * 删除服务
     */
    onDeleteService = id => {
        let _this = this;

        Modal.confirm({
            title: '删除确认',
            icon: <ExclamationCircleOutlined />,
            content: `确定要删除【${id}】?`,
            okText: '确认',
            cancelText: '取消',
            onOk: _this.onDeleteService_ok,
            onCancel: _this.onDeleteService_cancal
        })
    }

    onDeleteService_ok = () => {
        message.success('删除成功！');
    }

    onDeleteService_cancal = ()=> {
        message.error('删除失败！');
    }

    /**
     * 生命周期
     */
    componentDidMount() {
        this.service_getData(1, 5);
    }

    render() {
        const {service_tableSpin} = this.state;

        // 表格
        const service_rowSelection = {
            selectedRowKeys: this.state.service_selectedRowKeys,
            onChange: this.service_onTableSelectChange
        };

        return (
            <>
                <Card>
                    <Form layout='inline'>
                        <Form.Item label='服务名称' name='name' style={{ width: '25%' }}>
                            <Input placeholder='请输入' />
                        </Form.Item>
                        <Form.Item>
                            <Button type='primary' icon={<SyncOutlined />} htmlType='submit'>刷新</Button>
                        </Form.Item>
                    </Form>
                    
                    <div style={{ height: 20, clear: 'both' }}></div>

                    <Row>
                        <Col span={24}>
                            <Button type='primary' icon={<PlusOutlined />} onClick={() => this.createService_showModal()}>新建</Button>
                        </Col>
                    </Row>

                    <div style={{ height: 20, clear: 'both' }}></div>

                    <Row>
                        <Col span={24}>
                            <Table
                                onRow={record => {
                                    return {
                                        onClick: event => { console.log(record) }, // 点击行
                                        onDoubleClick: event => { },
                                        onContextMenu: event => { },
                                        onMouseEnter: event => { }, // 鼠标移入行
                                        onMouseLeave: event => { },
                                    };
                                }}
                                //rowSelection={service_rowSelection}
                                columns={this.service_getColumns()}
                                dataSource={this.state.service_tableData}
                                pagination={{
                                    current: this.service_pageNum,
                                    total: this.state.service_total,
                                    pageSizeOptions: [5, 10, 20, 50, 100],
                                    defaultPageSize: 5,
                                    showSizeChanger: true,
                                    showQuickJumper: true,
                                    showTotal: (service_total, range) => `共 ${service_total} 条`,
                                    onChange: this.service_onChange
                                }}
                                bordered
                            >
                                <Spin spinning={service_tableSpin}/>
                            </Table>
                        </Col>
                    </Row>
                </Card>

                <Modal
                    title="新建服务"
                    visible={this.state.createService_visible}
                    width={800}
                    onOk={this.createService_onOk}
                    onCancel={this.createService_onCancel}
                    okText="确认"
                    cancelText="取消"
                    afterClose={this.createService_onAfterClose}
                    maskClosable={false}
                    destroyOnClose={true}
                >
                    <Form labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} ref={this.createService_formRef}>
                        <Form.Item label="应用名称" name="createService_name"
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
                        <Form.Item label="唯一标识符" name="createService_id"
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
                        <Form.Item label="备注信息" name="createService_describe">
                            <Input.TextArea rows={4} placeholder="请输入主机备注信息" />
                        </Form.Item>
                    </Form>
                </Modal>

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
            </>
        )
    }
}
