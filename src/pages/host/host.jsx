import React, { Component } from 'react'
import { Row, Col, Card, Form, Select, Input, Button, Table } from 'antd'
import { Modal, Upload, message, Space, Alert, Typography, Divider } from 'antd';
import { SyncOutlined, PlusOutlined, ImportOutlined, UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios'

const { Option } = Select;
const { TextArea } = Input;

// 文件上传
const props = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
        authorization: 'authorization-text',
    },
    onChange(info) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};

export default class Analysis extends Component {
    state = {
        createHost_Visible: false, // 创建表单
        editHost_Visible: false, // 编辑表单
        editHost_initialValues: {},
        batchImport_Visible: false, // 批量导入
        selectedRowKeys: [], // 表格选择项Keys
        selectedRows: [], // 表格选择项Rows
        tableData: [], // 表格相关
        total: 0 // 表格相关
    }

    /**
     * 搜索表单
    */
    formRef = React.createRef();

    onFinish = (values) => {
        console.log(values);
    };

    /**
     * 创建主机
    */
    createHost_ShowModal = () => {
        this.setState({
            createHost_Visible: true,
        });
    }

    createHost_FormRef = React.createRef(); // 定义一个表单

    createHost_HandleOk = e => {
        this.createHost_FormRef.current.validateFields()
            .then(values => {
                this.createHost_FormRef.current.resetFields();
                this.setState({
                    createHost_Visible: false
                });
                console.log("表单值：");
                console.log(values);
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    }

    createHost_HandleCancel = e => {
        this.createHost_FormRef.current.resetFields();
        this.setState({
            createHost_Visible: false
        })
    }

    createHost_HandleAfterClose = () => {
        console.log("modal 关闭了！");
    }

    /**
     * 编辑主机
    */
    editHost_ShowModal = () => {
        this.setState({
            editHost_Visible: true,
            editHost_initialValues: {
                editHost_Type: 'web',
                editHost_Name: 'web-01',
                editHost_Ssh: 'root',
                editHost_At: '10.7.117.181',
                editHost_P: '2201'
            }
        });
    }

    editHost_FormRef = React.createRef(); // 定义一个表单

    editHost_HandleOk = e => {
        this.editHost_FormRef.current.validateFields()
            .then(values => {
                this.editHost_FormRef.current.resetFields();
                this.setState({
                    editHost_Visible: false
                });
                console.log("表单值：");
                console.log(values);
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    }

    editHost_HandleCancel = e => {
        this.editHost_FormRef.current.resetFields();
        this.setState({
            editHost_Visible: false
        })
    }

    editHost_HandleAfterClose = () => {
        console.log("modal 关闭了！");
    }

    /**
     * 删除主机
     */
    editHost_DeleteConfirm_HandleOk = () => {
        this.setState({
            editHost_Visible: false,
        });
        message.success('删除成功！');
    }

    editHost_DeleteConfirm_HandleCancel = () => {
        this.setState({
            editHost_Visible: false,
        });
        message.error('删除取消！');
    }

    editHost_Confirm = (id) => {
        let _this = this;
        Modal.confirm({
            title: '删除确认',
            icon: <ExclamationCircleOutlined />,
            content: `确定要删除【${id}】?`,
            okText: '确认',
            cancelText: '取消',
            onOk: _this.editHost_DeleteConfirm_HandleOk,
            onCancel: _this.editHost_DeleteConfirm_HandleCancel
        });
    }

    /**
     * 批量导入
     */

    batchImport_ShowModal = () => {
        this.setState({
            batchImport_Visible: true,
        });
    }

    batchImport_FormRef = React.createRef(); // 定义一个表单

    batchImport_HandleOk = e => {
        this.batchImport_FormRef.current.validateFields()
            .then(values => {
                this.batchImport_FormRef.current.resetFields();
                this.setState({
                    batchImport_Visible: false
                });
                console.log("表单值：");
                console.log(values);
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    }

    batchImport_HandleCancel = e => {
        this.batchImport_FormRef.current.resetFields();
        this.setState({
            batchImport_Visible: false
        })
    }

    batchImport_HandleAfterClose = () => {
        console.log("modal 关闭了！");
    }

    /**
     * 表格
    */
    getColumns = () => {
        return [
            {
                title: 'ID',
                dataIndex: 'id',
                width: 30,
            },
            {
                title: '标题',
                dataIndex: 'title',
                width: 500,
                render: (text, record) => <a href="javascript: void(0)" target="_self" onClick={() => this.handleShowDetailBlog(record.id)}>{text}</a>
            },
            {
                title: '内容',
                dataIndex: 'content',
                render(text, record) {
                    return <div dangerouslySetInnerHTML={{ __html: record.content }} style={{}} />
                }
            },
            {
                title: '操作',
                width: 200,
                render: (text, record) => (
                    <Space split={<Divider type="vertical" />}>
                        <Typography.Link onClick={() => this.editHost_ShowModal()}>编辑</Typography.Link>
                        <Typography.Link onClick={() => this.editHost_Confirm(record.id)}>删除</Typography.Link>
                        <Typography.Link>console</Typography.Link>
                    </Space>
                ),
            }
        ];
    }

    // 获取表格数据
    getData(pageNumber, pageSize) {
        axios.get(`http://localhost:5555/api/blog_list/?pageSize=${pageSize}&pageNumber=${pageNumber}&sortName=id&sortOrder=desc&_=1595230808893`).then((resp) => {
            let ajaxData = [];
            for (let i = 0; i < resp.data.rows.length; i++) {
                ajaxData.push({
                    key: resp.data.rows[i].id,
                    id: resp.data.rows[i].id,
                    title: resp.data.rows[i].title,
                    content: resp.data.rows[i].content.replace(/<[^>]*>|<\/[^>]*>/gm, "").substring(0, 54),
                    datetime: resp.data.rows[i].datetime,
                });
            }

            this.setState({
                tableData: ajaxData,
                total: resp.data.total
            })
        }, (err) => {
            console.log(err);
        });
    }

    onChange = (pageNumber, pageSize) => {
        this.pageNum = pageNumber;
        this.pageSize = pageSize;
        this.getData(pageNumber, pageSize);
    };

    onTableSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows });
    };

    componentDidMount() {
        this.getData(1, 5);
    }

    render() {
        // 控制表格选择
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onTableSelectChange
        };

        return (<>
            <Card>
                <Form
                    ref={this.formRef}
                    onFinish={this.onFinish}
                >
                    <Row gutter={24}>
                        <Col span={6}>
                            <Form.Item
                                label='主机类别'
                                name="type"
                            >
                                <Select style={{ width: '100%' }} placeholder="请选择" allowClear>
                                    <Option value="web">web服务</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label='主机别名'
                                name="name"
                            >
                                <Input placeholder="请输入" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label='连接地址'
                                name="address"
                            >
                                <Input placeholder="请输入" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" icon={<SyncOutlined />}>
                                    刷新
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

                <Row gutter={24}>
                    <Col >
                        <Button type='primary' icon={<PlusOutlined />} onClick={() => this.createHost_ShowModal()}>新建</Button>
                    </Col>
                    <Col >
                        <Button type='primary' icon={<ImportOutlined />} onClick={() => this.batchImport_ShowModal()}>批量导入</Button>
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
                            rowSelection={rowSelection}
                            columns={this.getColumns()}
                            dataSource={this.state.tableData}
                            pagination={{
                                current: this.pageNum,
                                total: this.state.total,
                                pageSizeOptions: [5, 10, 20, 50, 100],
                                defaultPageSize: 5,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total, range) => `共 ${total} 条`,
                                onChange: this.onChange
                            }}
                            bordered
                        >
                        </Table>
                    </Col>
                </Row>
            </Card>

            <Modal
                title="新建主机"
                visible={this.state.createHost_Visible}
                width={800}
                onOk={this.createHost_HandleOk}
                onCancel={this.createHost_HandleCancel}
                okText="确认"
                cancelText="取消"
                afterClose={this.createHost_HandleAfterClose}
                maskClosable={false}
                destroyOnClose={true}
            >
                <Form labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} ref={this.createHost_FormRef} name="control-ref" preserve={false}>
                    <Form.Item label="主机类别" style={{ marginBottom: 0 }} required >
                        <Form.Item
                            name="createHost_Type"
                            style={{ display: 'inline-block', width: 'calc(60% - 8px)' }}
                            rules={[
                                {
                                    required: true,
                                    message: "用户名不能为空"
                                },
                                {
                                    pattern: /^[a-zA-Z0-9_()（）\u4e00-\u9fa5]{1,32}$/,
                                    message: "账号为1至32位汉字、字母、数字、下划线或中英文括号"
                                },
                            ]}
                        >
                            <Select
                                placeholder="请选择主机类别/区域/分组"
                            >
                                <Option value="web">Web服务</Option>
                            </Select>
                        </Form.Item>

                        添加类别

                        编辑类别
                    </Form.Item>
                    <Form.Item label="主机名称" name="createHost_Name" required
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
                        <Input placeholder="请输入主机名称" style={{ width: 'calc(80% - 8px)' }} />
                    </Form.Item>
                    <Form.Item label="连接地址" style={{ marginBottom: 0 }} required>
                        <Form.Item
                            name="createHost_Ssh"
                            style={{ display: 'inline-block', width: '26%' }}
                            rules={[
                                {
                                    required: true,
                                    message: "用户名不能为空"
                                },
                                {
                                    pattern: /^[a-zA-Z0-9_()（）\u4e00-\u9fa5]{1,32}$/,
                                    message: "账号为1至32位汉字、字母、数字、下划线或中英文括号"
                                },
                            ]}
                        >
                            <Input addonBefore="ssh" placeholder="用户名" />
                        </Form.Item>
                        <Form.Item
                            name="createHost_At"
                            style={{ display: 'inline-block', width: 'calc(28% - 8px)' }}
                            rules={[
                                {
                                    required: true,
                                    message: "主机名不能为空"
                                },
                                {
                                    pattern: /^[a-zA-Z0-9_()（）\u4e00-\u9fa5]{1,32}$/,
                                    message: "主机名为1至32位汉字、字母、数字、下划线或中英文括号"
                                },
                            ]}
                        >
                            <Input addonBefore="@" placeholder="主机名/IP" />
                        </Form.Item>
                        <Form.Item
                            name="createHost_P"
                            style={{ display: 'inline-block', width: '26%' }}
                            rules={[
                                {
                                    required: true,
                                    message: "端口不能为空"
                                },
                                {
                                    pattern: /^[a-zA-Z0-9_()（）\u4e00-\u9fa5]{1,32}$/,
                                    message: "端口为1至32位汉字、字母、数字、下划线或中英文括号"
                                },
                            ]}
                        >
                            <Input addonBefore="-p" placeholder="端口" />
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label="独立密钥" name="createHost_Private" extra={'默认使用全局密钥，如果上传了独立密钥则优先使用该密钥。'} style={{ marginBottom: 15 }}>
                        <Upload {...props}>
                            <Button icon={<UploadOutlined />}>点击上传</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item label="备注信息" name="createHost_Describe">
                        <TextArea rows={4} placeholder="请输入主机备注信息" style={{ width: 'calc(80% - 8px)' }} />
                    </Form.Item>
                    <Form.Item wrapperCol={{ span: 19, offset: 5 }}>
                        ⚠️首次验证时需要输入登录用户名对应的密码，但不会存储该密码。
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="编辑主机"
                visible={this.state.editHost_Visible}
                width={800}
                onOk={this.editHost_HandleOk}
                onCancel={this.editHost_HandleCancel}
                okText="确认"
                cancelText="取消"
                afterClose={this.editHost_HandleAfterClose}
                maskClosable={false}
                destroyOnClose={true}
            >
                <Form labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} ref={this.editHost_FormRef} initialValues={this.state.editHost_initialValues} name="control-ref" preserve={false}>
                    <Form.Item label="主机类别" style={{ marginBottom: 0 }} required >
                        <Form.Item
                            name="editHost_Type"
                            style={{ display: 'inline-block', width: 'calc(60% - 8px)' }}
                            rules={[
                                {
                                    required: true,
                                    message: "用户名不能为空"
                                },
                                {
                                    pattern: /^[a-zA-Z0-9_()（）\u4e00-\u9fa5]{1,32}$/,
                                    message: "账号为1至32位汉字、字母、数字、下划线或中英文括号"
                                },
                            ]}
                        >
                            <Select
                                placeholder="请选择主机类别/区域/分组"
                            >
                                <Option value="web">Web服务</Option>
                            </Select>
                        </Form.Item>

                        添加类别

                        编辑类别
                    </Form.Item>
                    <Form.Item label="主机名称" name="editHost_Name" required
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
                        <Input placeholder="请输入主机名称" style={{ width: 'calc(80% - 8px)' }} />
                    </Form.Item>
                    <Form.Item label="连接地址" style={{ marginBottom: 0 }} required>
                        <Form.Item
                            name="editHost_Ssh"
                            style={{ display: 'inline-block', width: '26%' }}
                            rules={[
                                {
                                    required: true,
                                    message: "用户名不能为空"
                                },
                                {
                                    pattern: /^[a-zA-Z0-9_()（）\u4e00-\u9fa5]{1,32}$/,
                                    message: "账号为1至32位汉字、字母、数字、下划线或中英文括号"
                                },
                            ]}
                        >
                            <Input addonBefore="ssh" placeholder="用户名" />
                        </Form.Item>
                        <Form.Item
                            name="editHost_At"
                            style={{ display: 'inline-block', width: 'calc(28% - 8px)' }}
                            rules={[
                                {
                                    required: true,
                                    message: "主机名不能为空"
                                },
                                {
                                    pattern: /^[a-zA-Z0-9_()（）\u4e00-\u9fa5]{1,32}$/,
                                    message: "主机名为1至32位汉字、字母、数字、下划线或中英文括号"
                                },
                            ]}
                        >
                            <Input addonBefore="@" placeholder="主机名/IP" />
                        </Form.Item>
                        <Form.Item
                            name="editHost_P"
                            style={{ display: 'inline-block', width: '26%' }}
                            rules={[
                                {
                                    required: true,
                                    message: "端口不能为空"
                                },
                                {
                                    pattern: /^[a-zA-Z0-9_()（）\u4e00-\u9fa5]{1,32}$/,
                                    message: "端口为1至32位汉字、字母、数字、下划线或中英文括号"
                                },
                            ]}
                        >
                            <Input addonBefore="-p" placeholder="端口" />
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label="独立密钥" name="editHost_Private" extra={'默认使用全局密钥，如果上传了独立密钥则优先使用该密钥。'} style={{ marginBottom: 15 }}>
                        <Upload {...props}>
                            <Button icon={<UploadOutlined />}>点击上传</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item label="备注信息" name="editHost_Describe">
                        <TextArea rows={4} placeholder="请输入主机备注信息" style={{ width: 'calc(80% - 8px)' }} />
                    </Form.Item>
                    <Form.Item wrapperCol={{ span: 19, offset: 5 }}>
                        ⚠️首次验证时需要输入登录用户名对应的密码，但不会存储该密码。
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="批量导入"
                visible={this.state.batchImport_Visible}
                width={800}
                onOk={this.batchImport_HandleOk}
                onCancel={this.batchImport_HandleCancel}
                okText="导入"
                cancelText="取消"
                afterClose={this.batchImport_HandleAfterClose}
                maskClosable={false}
                destroyOnClose={true}
            >
                <Row style={{ marginBottom: 20 }}>
                    <Col span={20} offset={2}>
                        <Alert
                            description="导入或输入的密码仅作首次验证使用，并不会存储密码。"
                            type="info"
                            closable
                            showIcon
                        />
                    </Col>
                </Row>

                <Form labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} ref={this.batchImport_FormRef} name="control-ref" preserve={false}>
                    <Form.Item label="模板下载" style={{ marginBottom: 15 }} help={'请下载使用该模板填充数据后导入。'}>
                        主机导入模板.xlsx
                    </Form.Item>
                    <Form.Item label="默认密码" help={'请输入默认主机密码。'} style={{ marginBottom: 15 }}>
                        <Input placeholder="请输入主机名称" style={{ width: 'calc(80% - 8px)' }} />
                    </Form.Item>
                    <Form.Item label="导入数据" name="createHost_Private"
                        rules={[
                            {
                                required: true,
                                message: "私密空间配额不能为空"
                            }
                        ]}>
                        <Upload {...props}>
                            <Button icon={<UploadOutlined />}>点击上传</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </>)
    }
}