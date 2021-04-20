import React, { Component } from 'react'
import { Row, Col, Table, Alert, Tabs } from 'antd'
import { Card, Form, Space, Input, Button, Modal, Divider, Typography, message, Transfer } from 'antd'
import { SyncOutlined, PlusOutlined, ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios'

const mockData = [];
for (let i = 0; i < 20; i++) {
    mockData.push({
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`
    });
}

const oriTargetKeys = mockData.filter(item => +item.key % 3 > 1).map(item => item.key);

export default class AppConfig extends Component {
    state = {
        createApp_visible: false, // 创建应用
        editApp_visible: false, // 编辑应用
        editApp_initialValues: {}, // 初始化表单
        dependent_visible: false, // 依赖
        appDependent_targetKeys: oriTargetKeys, // 应用依赖穿梭框
        appDependent_selectedKeys: [], // 应用依赖穿梭框
        serviceDependent_targetKeys: oriTargetKeys, // 服务依赖穿梭框
        serviceDependent_selectedKeys: [], // 服务依赖穿梭框
        app_selectedRowKeys: [], // 表格选择项Keys
        app_selectedRows: [], // 表格选择项Rows
        app_tableData: [], // 表格相关
        app_total: 0, // 表格相关
        inputArr: [
            {
                key: 0,
                name: 'input0',
                label: '模板类型'
            },
            {
                key: 1,
                name: 'input1',
                label: '模板名称'
            }
        ]
    }

    /**
     * 创建应用Modal
    */
    createApp_showModal = () => {
        this.setState({
            createApp_visible: true,
        });
    }

    createApp_formRef = React.createRef(); // 定义一个表单

    createApp_onOk = e => {
        this.createApp_formRef.current.validateFields()
            .then(values => {
                this.createApp_formRef.current.resetFields();
                this.setState({
                    createApp_visible: false
                });
                console.log("表单值：");
                console.log(values);
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    }

    createApp_onCancel = e => {
        this.createApp_formRef.current.resetFields();
        this.setState({
            createApp_visible: false
        })
    }

    createApp_onAfterClose = () => {
        console.log("modal 关闭了！");
    }

    /**
    * 编辑应用Modal
    */
    editApp_showModal = (id, name, uuid, describe) => {
        this.setState({
            editApp_visible: true,
            editApp_initialValues: {
                editApp_name: name,
                editApp_uuid: uuid,
                editApp_describe: describe
            }
        });
    }

    editApp_formRef = React.createRef(); // 定义一个表单

    editApp_onOk = e => {
        this.editApp_formRef.current.validateFields()
            .then(values => {
                this.editApp_formRef.current.resetFields();
                this.setState({
                    editApp_visible: false
                });
                console.log("表单值：");
                console.log(values);
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    }

    editApp_onCancel = e => {
        this.editApp_formRef.current.resetFields();
        this.setState({
            editApp_visible: false
        })
    }

    editApp_onAfterClose = () => {
        console.log("modal 关闭了！");
    }

    /**
     * 删除应用
     */
    onDeleteApp = (id) => {
        let _this = this;
        Modal.confirm({
            title: '删除确认',
            icon: <ExclamationCircleOutlined />,
            content: `确定要删除【${id}】?`,
            okText: '确认',
            cancelText: '取消',
            onOk: _this.onDeleteApp_ok,
            onCancel: _this.onDeleteApp_cancal
        })
    }

    onDeleteApp_ok = () => {
        message.success('删除成功！');
    }

    onDeleteApp_cancal = () => {
        message.error('删除取消！');
    }

    /**
     * 依赖
     */
    dependent_showModal = () => {
        this.setState({
            dependent_visible: true,
        });
    }

    dependent_onOk = e => {

    }

    dependent_onCancel = e => {
        this.setState({
            dependent_visible: false
        })
    }

    dependent_onAfterClose = () => {
        console.log("modal 关闭了！");
    }

    // 应用依赖穿梭框
    appDependent_onChange = (nextTargetKeys, direction, moveKeys) => {
        this.setState({ appDependent_targetKeys: nextTargetKeys });

        console.log('targetKeys: ', nextTargetKeys);
        console.log('direction: ', direction);
        console.log('moveKeys: ', moveKeys);
    };

    appDependent_onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        this.setState({ appDependent_selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });

        console.log('sourceSelectedKeys: ', sourceSelectedKeys);
        console.log('targetSelectedKeys: ', targetSelectedKeys);
    };

    appDependent_onScroll = (direction, e) => {
        console.log('direction:', direction);
        console.log('target:', e.target);
    };

    // 服务依赖穿梭框
    serviceDependent_onChange = (nextTargetKeys, direction, moveKeys) => {
        this.setState({ serviceDependent_targetKeys: nextTargetKeys });

        console.log('targetKeys: ', nextTargetKeys);
        console.log('direction: ', direction);
        console.log('moveKeys: ', moveKeys);
    };

    serviceDependent_onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        this.setState({ serviceDependent_selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });

        console.log('sourceSelectedKeys: ', sourceSelectedKeys);
        console.log('targetSelectedKeys: ', targetSelectedKeys);
    };

    serviceDependent_onScroll = (direction, e) => {
        console.log('direction:', direction);
        console.log('target:', e.target);
    };

    /**
     * 表格
    */
    app_getColumns = () => {
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
                        <Typography.Link onClick={() => this.editApp_showModal(record.id, record.name, record.uuid, record.describe)}>编辑</Typography.Link>
                        <Typography.Link onClick={() => this.onDeleteApp(record.id)}>删除</Typography.Link>
                        <Typography.Link onClick={() => this.dependent_showModal()}>依赖</Typography.Link>
                        <Typography.Link>配置</Typography.Link>
                    </Space>
                )
            }
        ];
    }

    // 获取表格数据
    app_getData(pageNumber, pageSize) {
        axios.get(`http://localhost:5555/api/app_list/?pageSize=${pageSize}&pageNumber=${pageNumber}&sortName=id&sortOrder=desc&_=1595230808893`).then((resp) => {
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
                app_tableData: ajaxData,
                app_total: resp.data.total
            })
        }, (err) => {
            console.log(err);
        });
    }

    app_onChange = (pageNumber, pageSize) => {
        this.app_pageNum = pageNumber;
        this.app_pageSize = pageSize;
        this.app_getData(pageNumber, pageSize);
    };

    app_onTableSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ app_selectedRowKeys: selectedRowKeys, app_selectedRows: selectedRows });
    };

    componentDidMount() {
        this.app_getData(1, 5);
    }

    render() {
        // 依赖
        const { appDependent_targetKeys, appDependent_selectedKeys, serviceDependent_targetKeys, serviceDependent_selectedKeys } = this.state;

        // 表格
        const app_rowSelection = {
            selectedRowKeys: this.state.app_selectedRowKeys,
            onChange: this.app_onTableSelectChange
        };

        return (
            <>
                <Card>
                    <Form layout='inline'>
                        <Form.Item label='应用名称' name='name' style={{ width: '25%' }}>
                            <Input placeholder='请输入' />
                        </Form.Item>
                        <Form.Item>
                            <Button type='primary' htmlType='submit' icon={<SyncOutlined />}>刷新</Button>
                        </Form.Item>
                    </Form>

                    <div style={{ height: 20, clear: 'both' }}></div>

                    <Row>
                        <Col span={24}>
                            <Button type='primary' icon={<PlusOutlined />} onClick={() => this.createApp_showModal()}>新建</Button>
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
                                //rowSelection={app_rowSelection}
                                columns={this.app_getColumns()}
                                dataSource={this.state.app_tableData}
                                pagination={{
                                    current: this.app_pageNum,
                                    total: this.state.app_total,
                                    pageSizeOptions: [5, 10, 20, 50, 100],
                                    defaultPageSize: 5,
                                    showSizeChanger: true,
                                    showQuickJumper: true,
                                    showTotal: (app_total, range) => `共 ${app_total} 条`,
                                    onChange: this.app_onChange
                                }}
                                bordered
                            >
                            </Table>
                        </Col>
                    </Row>
                </Card>

                <Modal
                    title="新建主机"
                    visible={this.state.createApp_visible}
                    width={800}
                    onOk={this.createApp_onOk}
                    onCancel={this.createApp_onCancel}
                    okText="确认"
                    cancelText="取消"
                    afterClose={this.createApp_onAfterClose}
                    maskClosable={false}
                    destroyOnClose={true}
                >
                    <Form labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} ref={this.createApp_formRef}>
                        <Form.Item label="应用名称" name="createApp_name"
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
                        <Form.Item label="唯一标识符" name="createApp_id"
                            rules={[
                                {
                                    pattern: /^[a-zA-Z0-9_()（）\u4e00-\u9fa5]{1,32}$/,
                                    message: "唯一标识符为1至32位汉字、字母、数字、下划线或中英文括号"
                                },
                            ]}
                        >
                            <Input placeholder="请输入唯一标识符，例如：api_order" />
                        </Form.Item>
                        <Form.Item label="备注信息" name="createApp_describe">
                            <Input.TextArea rows={4} placeholder="请输入主机备注信息" />
                        </Form.Item>
                        {
                            this.state.inputArr.map(item => (<Form.Item label={item.label} name={item.name} key={item.key}
                                rules={[
                                    {
                                        required: true,
                                        message: item.label + "不能为空"
                                    },
                                    {
                                        pattern: /^[a-zA-Z0-9_()（）\u4e00-\u9fa5]{1,32}$/,
                                        message: item.label + "为1至32位汉字、字母、数字、下划线或中英文括号"
                                    },
                                ]}
                            >
                                <Input placeholder="请输入唯一标识符，例如：api_order" />
                            </Form.Item>))
                        }
                    </Form>
                </Modal>

                <Modal
                    title="编辑应用"
                    visible={this.state.editApp_visible}
                    width={800}
                    onOk={this.editApp_onOk}
                    onCancel={this.editApp_onCancel}
                    okText="确认"
                    cancelText="取消"
                    afterClose={this.editApp_onAfterClose}
                    maskClosable={false}
                    destroyOnClose={true}
                >
                    <Form labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} ref={this.editApp_formRef} initialValues={this.state.editApp_initialValues}>
                        <Form.Item label="应用名称" name="editApp_name"
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
                        <Form.Item label="唯一标识符" name="editApp_uuid"
                            rules={[
                                {
                                    required: true,
                                    message: "应用名称不能为空"
                                },
                                {
                                    pattern: /^[a-zA-Z0-9_()（）\u4e00-\u9fa5]{1,32}$/,
                                    message: "唯一标识符为1至32位汉字、字母、数字、下划线或中英文括号"
                                },
                            ]}
                        >
                            <Input placeholder="请输入唯一标识符，例如：api_order"/>
                        </Form.Item>
                        <Form.Item label="备注信息" name="editApp_describe">
                            <Input.TextArea rows={4} placeholder="请输入主机备注信息"/>
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title="依赖"
                    visible={this.state.dependent_visible}
                    width={800}
                    onOk={this.dependent_onOk}
                    onCancel={this.dependent_onCancel}
                    okText="确认"
                    cancelText="取消"
                    afterClose={this.dependent_onAfterClose}
                    maskClosable={false}
                    destroyOnClose={true}
                >
                    <Alert
                        message='小提示'
                        description={<><p>设置依赖的应用仅会获取到其<span style={{color: 'red'}}>公共</span>配置，私有配置并不会被其他应用所获取。</p>
                            <p>服务不存在公共和私有配置的概念，所以会获取到依赖服务的所有配置信息。</p></>}
                        type='info'
                        showIcon
                        closable
                    >
                    </Alert>

                    <div style={{ height: 20, clear: 'both' }}></div>

                    <Tabs tabPosition='left'>
                        <Tabs.TabPane tab="应用依赖" key="1">
                            <p style={{ paddingTop: 7 }}>设置依赖的应用</p>
                            <Transfer
                                dataSource={mockData}
                                titles={['所有服务', '已选服务']}
                                targetKeys={appDependent_targetKeys}
                                selectedKeys={appDependent_selectedKeys}
                                onChange={this.appDependent_onChange}
                                onSelectChange={this.appDependent_onSelectChange}
                                onScroll={this.appDependent_onScroll}
                                render={item => item.title}
                                listStyle={{
                                    width: 300,
                                    height: 300,
                                }}
                            />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="服务依赖" key="2">
                            <p style={{ paddingTop: 7 }}>设置依赖的服务</p>
                            <Transfer
                                dataSource={mockData}
                                titles={['所有服务', '已选服务']}
                                targetKeys={serviceDependent_targetKeys}
                                selectedKeys={serviceDependent_selectedKeys}
                                onChange={this.serviceDependent_onChange}
                                onSelectChange={this.serviceDependent_onSelectChange}
                                onScroll={this.serviceDependent_onScroll}
                                render={item => item.title}
                                listStyle={{
                                    width: 300,
                                    height: 300,
                                }}
                            />
                        </Tabs.TabPane>
                    </Tabs>
                </Modal>
            </>
        )
    }
}
