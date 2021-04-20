import React from 'react'
import { Row, Col, Card, Form, Input, Button, Table, Tag, Space, Modal, Select, DatePicker, Upload, message, Tooltip, Timeline } from 'antd';
import { RedoOutlined, MinusOutlined, ClockCircleOutlined, PlusOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment'
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import "./question.css"
import axios from 'axios'

export default class MenuCom extends React.Component {
    state = {
        selectedRowKeys: [], // 表格选择项Keys
        selectedRows: [], // 表格选择项Rows
        tableData: [], // 表格数据源
        total: 0, // 表格数据数
        advancedSearch_visible: false, // 高级搜索
        title: "", // 普通搜索(只要搜索标题)
        advancedSearch_type: "", // 高级搜索：类型
        advancedSearch_status: "", // 高级搜索：状态
        advancedSearch_priority: "", // 高级搜索：优先级
        advancedSearch_creator: "", // 高级搜索：创建人
        advancedSearch_assign: "", // 高级搜索：指派
        advancedSearch_modular: "", // 高级搜索：模块
        advancedSearch_createTime: "", // 高级搜索：创建时间
        advancedSearch_lastUpdateTime: "", // 高级搜索：最后更新时间
        advancedSearch_beginTime: "", // 高级搜索：开始时间
        advancedSearch_finishTime: "", // 高级搜索：结束时间
        createQuestion_visible: false, // 创建问题

        checkQuestion_id: "",
        checkQuestion_visible: false, // 查看、编辑问题
        checkQuestion_initialValues: {}, // 问题详情
    }

    onSearchTitle = value => {
        this.setState({
            title: value
        }, function () {
            this.getData(1, 5, this.state.title);
        })
    }

    /**
     * 高级搜索
     */
    advancedSearch_formRef = React.createRef();

    advancedSearch_onOk = () => {
        this.advancedSearch_formRef.current.validateFields().then(values => {
            console.log("开始时间：");
            console.log(values.advancedSearch_beginTime);
            console.log("结束时间：");
            console.log(values.advancedSearch_finishTime);

            this.setState({
                advancedSearch_type: values.advancedSearch_type === undefined ? "" : values.advancedSearch_type,
                advancedSearch_status: values.advancedSearch_status === undefined ? "" : values.advancedSearch_status,
                advancedSearch_priority: values.advancedSearch_priority === undefined ? "" : values.advancedSearch_priority,
                advancedSearch_creator: values.advancedSearch_creator === undefined ? "" : values.advancedSearch_creator,
                advancedSearch_assign: values.advancedSearch_assign === undefined ? "" : values.advancedSearch_assign,
                advancedSearch_modular: values.advancedSearch_modular === undefined ? "" : values.advancedSearch_modular,
                // advancedSearch_createTime: moment(values.advancedSearch_createTime).format('YYYY-MM-DD'),
                // advancedSearch_lastUpdateTime: moment(values.advancedSearch_lastUpdateTime).format('YYYY-MM-DD'),
                advancedSearch_beginTime: values.advancedSearch_beginTime === undefined ? "" : moment(values.advancedSearch_beginTime).format('YYYY-MM-DD'),
                advancedSearch_finishTime: values.advancedSearch_finishTime === undefined ? "" : moment(values.advancedSearch_finishTime).format('YYYY-MM-DD'),
            }, function () {
                this.getData(1, 5);
                this.advancedSearch_formRef.current.resetFields();
                this.setState({
                    advancedSearch_visible: false
                });
            })
            // console.log('YYYY-MM-DD');
            // console.log(moment(values.advancedSearch_type).format('YYYY-MM-DD'));
        }).catch(() => {

        })
    }

    advancedSearch_onCancel = () => {
        this.advancedSearch_formRef.current.resetFields();

        this.setState({
            advancedSearch_visible: false
        })
    }

    advancedSearch_onAfterClose = () => {

    }

    advancedSearch_onCreateTime = () => {

    }

    advancedSearch_onLastUpdateTime = () => {

    }

    advancedSearch_onBeginTime = () => {

    }

    advancedSearch_onEndTime = () => {

    }

    /**
     * 新建问题
     */
    createQuestion_formRef = React.createRef();

    createQuestion_onSelectTime = (value, dateString) => {
        console.log('value：', value)
        console.log('dateString：', dateString)
    }

    createQuestion_onOk = () => {
        this.createQuestion_formRef.current.validateFields().then(values => {
            let params = {
                title: values.createQuestion_subject,
                devices: values.createQuestion_equipment,
                asset: values.createQuestion_capital,
                priority: values.createQuestion_priority,
                type: values.createQuestion_type,
                description: values.createQuestion_describe,
                assign_by: values.createQuestion_assignedTo,
                status: values.createQuestion_status,
                release: values.createQuestion_version,
                model: values.createQuestion_modular,
                start_time: moment(values.createQuestion_time[0]).format("YYYY-MM-DD"),
                finish_time: moment(values.createQuestion_time[1]).format("YYYY-MM-DD")
            }

            axios({
                method: "POST",
                url: "/api/bug/buginfo/",
                data: JSON.stringify(params)
            }).then(resp => {
                if (!resp.data.error) { // None
                    message.success('添加问题成功。');
                    this.createQuestion_formRef.current.resetFields();
                    this.setState({
                        createQuestion_visible: false
                    });

                    this.getData(1, 5);
                } else {
                    message.error(resp.data.error);
                }
            }, (err) => {
                console.log("err");
            });
        }).catch(info => {
            console.log("info");
        })
    }

    createQuestion_onCancel = () => {
        this.createQuestion_formRef.current.resetFields();

        this.setState({
            createQuestion_visible: false
        })
    }
    // createQuestion_onAfterClose = () => {
    //     console.log("-object-");
    // }

    /**
     * 问题详情、编辑问题
     */
    checkQuestion_showModal = (data) => {
        this.setState({
            checkQuestion_visible: true,
            checkQuestion_id: data.id,
            checkQuestion_initialValues: {
                checkQuestion_subject: data.title,
                checkQuestion_capital: data.capital,
                checkQuestion_equipment: data.equipment,
                checkQuestion_creator: data.create_by,
                checkQuestion_designator: data.designator,
                checkQuestion_status: data.status + "",
                checkQuestion_type: data.type + "",
                checkQuestion_describe: data.describe,
                checkQuestion_priority: data.priority + "",
                checkQuestion_creationTime: data.create_at,
                checkQuestion_version: data.version,
                checkQuestion_modular: data.modular,
                checkQuestion_assignedTo: data.assignedTo,
                checkQuestion_follow: data.follow
            }
        })
    }

    checkQuestion_formRef = React.createRef();

    checkQuestion_onSubmit = () => {
        this.checkQuestion_formRef.current.validateFields().then(values => {

            let params = {
                id: this.state.checkQuestion_id,
                status: values.checkQuestion_status,
                type: values.checkQuestion_type,
                priority: values.checkQuestion_priority,
                start_time: moment(values.checkQuestion_time[0]).format("YYYY-MM-DD"),
                finish_time: moment(values.checkQuestion_time[1]).format("YYYY-MM-DD"),
                release: values.checkQuestion_version,
                model: values.checkQuestion_modular,
                assign_by: values.checkQuestion_assignedTo,
                description: values.description,
                resolve: values.checkQuestion_resolve
            }

            axios({
                method: "PATCH",
                url: "/api/bug/buginfo/",
                data: JSON.stringify(params)
            }).then(resp => {
                if (!resp.data.error) { // None
                    message.success('修改问题成功。');
                    //this.checkQuestion_formRef.current.resetFields();
                    this.setState({
                        checkQuestion_visible: false
                    });

                    this.getData(1, 5);
                } else {
                    message.error(resp.data.error);
                }
            }, (err) => {
                console.log("err");
            });
        }).catch(error => {
            console.log("error");
        })
    }

    checkQuestion_onCancel = () => {
        this.setState({
            checkQuestion_visible: false
        })
    }

    checkQuestion_onAfterClose = () => {
        this.setState({
            checkQuestion_visible: false
        })
    }

    /**
     * 表格
     */
    getColumns = () => {
        return [
            {
                title: '优先级',
                dataIndex: 'priority',
                key: 'priority',
                width: 80,
                render: (text, record) => {
                    if (Number(record.priority) === 0) {
                        return (<Tooltip title="低">
                            <div className="blue-round"></div>
                        </Tooltip>)
                    } else if (Number(record.priority) === 1) {
                        return (<Tooltip title="中">
                            <div className="yellow-round"></div>
                        </Tooltip>)
                    } else {
                        return (<Tooltip title="高">
                            <div className="red-round"></div>
                        </Tooltip>)
                    }
                }
            },
            {
                title: '编号',
                dataIndex: 'id',
                key: 'id',
                width: 60,
                render: (text, record) => (<span>#{record.id}</span>)
            },
            {
                title: '标题',
                key: 'title',
                dataIndex: 'title',
                render: (text, record) => (<a onClick={() => this.checkQuestion_showModal(record)} target="_self">
                    {record.title}
                </a>)
            },
            {
                title: '问题类型',
                key: 'type',
                dataIndex: 'type',
                width: 88,
                render: (text, record) => {
                    if (Number(record.type) === 0) {
                        return (<Tag color="#dddddd">未指定</Tag>);
                    } else if (Number(record.type) === 1) {
                        return (<Tag color="#f50">bug</Tag>);
                    } else if (Number(record.type) === 2) {
                        return (<Tag color="#2db7f5">功能</Tag>);
                    }
                }
            },
            {
                title: '问题状态',
                key: 'status',
                dataIndex: 'status',
                width: 88,
                render: (text, render) => {
                    if (Number(render.status) === 0) {
                        return (<span>新建</span>)
                    } else if (Number(render.status) === 1) {
                        return (<span>处理中</span>)
                    } else if (Number(render.status) === 2) {
                        return (<span>已解决</span>)
                    } else if (Number(render.status) === 3) {
                        return (<span>已忽略</span>)
                    } else if (Number(render.status) === 4) {
                        return (<span>待反馈</span>)
                    } else if (Number(render.status) === 5) {
                        return (<span>已关闭</span>)
                    } else if (Number(render.status) === 6) {
                        return (<span>重新打开</span>)
                    } else {
                        return (<span>已指定</span>)
                    }
                }
            },
            {
                title: '创建人',
                key: 'create_by',
                dataIndex: 'create_by',
                width: 81,
                render: (text, render) => (<span style={{ color: '#999999' }}>{render.create_by}</span>)
            },
            {
                title: '指派人',
                key: 'assign_by',
                dataIndex: 'assign_by',
                width: 75,
                render: (text, render) => (<span style={{ color: '#999999' }}>{render.assign_by}</span>)
            },
            {
                title: '更新时间',
                key: 'update_at',
                dataIndex: 'update_at'
            },
        ]
    };

    // 获取表格数据
    getData(pageNumber, pageSize) {
        axios.get(`/api/bug/buginfo/?pageSize=${pageSize}&pageNumber=${pageNumber}&title=${this.state.title}&type=${this.state.advancedSearch_type}&status=${this.state.advancedSearch_status}&priority=${this.state.advancedSearch_priority}&created_by=${this.state.advancedSearch_creator}&assign_by=${this.state.advancedSearch_assign}&model=${this.state.advancedSearch_modular}&start_time=${this.state.advancedSearch_beginTime}&finish_time=${this.state.advancedSearch_finishTime}`).then((resp) => {
            console.log("resp");
            console.log(resp);
            if (!resp.data.error) {
                let ajaxData = [];
                for (let i = 0; i < resp.data.rows.length; i++) {
                    ajaxData.push({
                        assign_by: resp.data.rows[i].assign_by,
                        create_at: resp.data.rows[i].create_at,
                        create_by: resp.data.rows[i].create_by,
                        finish_time: resp.data.rows[i].finish_time,
                        id: resp.data.rows[i].id,
                        priority: resp.data.rows[i].priority,
                        start_time: resp.data.rows[i].start_time,
                        status: resp.data.rows[i].status,
                        title: resp.data.rows[i].title,
                        type: resp.data.rows[i].type,
                        update_at: resp.data.rows[i].update_at,
                        update_by: resp.data.rows[i].update_by
                    });
                }

                this.setState({
                    tableData: ajaxData,
                    total: resp.total
                })
            } else {
                message.error(resp.data.error);
            }
        }, (err) => {

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
        }

        return (<div>
            <Card>
                <Row>
                    <Col span={8}>
                        <Input.Search placeholder="搜索问题" onSearch={this.onSearchTitle} enterButton />
                    </Col>
                    <Col span={6} offset={10} style={{ "textAlign": 'right' }}>
                        <Space>
                            <Button type="primary" icon={<SearchOutlined />} onClick={() => this.setState({
                                advancedSearch_visible: true
                            })}>高级搜索</Button> <Button type="primary" icon={<PlusOutlined />} onClick={() => this.setState({
                                createQuestion_visible: true
                            })}>新建问题</Button>
                        </Space>
                    </Col>
                </Row>

                <div style={{ height: 15, clear: 'both' }}></div>

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
                    // rowSelection={rowSelection}
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
                // bordered
                >
                </Table>
            </Card>

            <Modal
                title="高级搜索"
                visible={this.state.advancedSearch_visible}
                width={660}
                onOk={this.advancedSearch_onOk}
                onCancel={this.advancedSearch_onCancel}
                okText="确认"
                cancelText="取消"
                afterClose={this.advancedSearch_onAfterClose}
                maskClosable={false}
                destroyOnClose={true}
            >
                <Form labelCol={{ span: 9 }} wrapperCol={{ span: 15 }} ref={this.advancedSearch_formRef}>
                    <Row>
                        <Col span={12}>
                            <Form.Item label="类型" name="advancedSearch_type">
                                <Select placeholder="请选择问题类型" style={{ width: '100%' }}>
                                    <Select.Option value="0">Bug</Select.Option>
                                    <Select.Option value="1">任务</Select.Option>
                                    <Select.Option value="2">功能</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="状态" name="advancedSearch_status">
                                <Select placeholder="请选择状态" style={{ width: '100%' }}>
                                    <Select.Option value="0">新建</Select.Option>
                                    <Select.Option value="1">处理中</Select.Option>
                                    <Select.Option value="2">已解决</Select.Option>
                                    <Select.Option value="3">已忽略</Select.Option>
                                    <Select.Option value="4">待反馈</Select.Option>
                                    <Select.Option value="5">已关闭</Select.Option>
                                    <Select.Option value="6">重新打开</Select.Option>
                                    <Select.Option value="7">已指定</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item label="优先级" name="advancedSearch_priority">
                                <Select placeholder="请选择优先级" style={{ width: '100%' }}>
                                    <Select.Option value="0">低</Select.Option>
                                    <Select.Option value="1">中</Select.Option>
                                    <Select.Option value="2">高</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="创建人" name="advancedSearch_creator">
                                <Select placeholder="请选择创建人" style={{ width: '100%' }}>
                                    <Select.Option value="jack">梦远他乡</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item label="指派" name="advancedSearch_assign">
                                <Select placeholder="请选择指派" style={{ width: '100%' }}>
                                    <Select.Option value="jack">我</Select.Option>
                                    <Select.Option value="lucy">未指派</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="模块" name="advancedSearch_modular">
                                <Select placeholder="请选择模块" style={{ width: '100%' }}>
                                    <Select.Option value="0">未指定</Select.Option>
                                    <Select.Option value="123">123</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    {/* <Row>
                        <Col span={12}>
                            <Form.Item label="是否逾期" name="advancedSearch_timeout">
                                <Select placeholder="请选择逾期条件" style={{ width: '100%' }}>
                                    <Select.Option value="0">已逾期</Select.Option>
                                    <Select.Option value="1">即将逾期</Select.Option>
                                    <Select.Option value="2">未逾期</Select.Option>
                                    <Select.Option value="3">未设置逾期</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="模块" name="advancedSearch_modular">
                                <Select placeholder="请选择模块" style={{ width: '100%' }}>
                                    <Select.Option value="0">未指定</Select.Option>
                                    <Select.Option value="123">123</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row> */}
                    {/* <Row>
                        <Col span={12}>
                            <Form.Item label="创建时间" name="advancedSearch_createTime">
                                <DatePicker placeholder="请选择创建时间" onChange={this.advancedSearch_onCreateTime} style={{ width: "100%" }} format={"YYYY-MM-DD"} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="最后更新时间" name="advancedSearch_lastUpdateTime" >
                                <DatePicker placeholder="请选择最后更新时间" onChange={this.advancedSearch_onLastUpdateTime} style={{ width: "100%" }} format={"YYYY-MM-DD"} />
                            </Form.Item>
                        </Col>
                    </Row> */}
                    <Row>
                        <Col span={12}>
                            <Form.Item label="开始时间" name="advancedSearch_beginTime">
                                <DatePicker locale={locale} placeholder="请选择开始时间" onChange={this.advancedSearch_onBeginTime} style={{ width: "100%" }} format={"YYYY-MM-DD"} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="结束时间" name="advancedSearch_finishTime">
                                <DatePicker locale={locale} placeholder="请选择结束时间" onChange={this.advancedSearch_onEndTime} style={{ width: "100%" }} format={"YYYY-MM-DD"} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            <Modal
                title="新建问题"
                visible={this.state.createQuestion_visible}
                width={660}
                onOk={this.createQuestion_onOk}
                onCancel={this.createQuestion_onCancel}
                okText="确认"
                cancelText="取消"
                afterClose={this.createQuestion_onAfterClose}
                maskClosable={false}
                destroyOnClose={true}
                width={800}
            >
                <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} ref={this.createQuestion_formRef}>
                    <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} label="主题" name="createQuestion_subject"
                        rules={[
                            {
                                required: true,
                                message: "主题不能为空"
                            },
                            // {
                            //     pattern: /^[a-zA-Z0-9_()（）\u4e00-\u9fa5]{1,64}$/,
                            //     message: "主题为1至64位汉字、字母、数字、下划线或中英文括号"
                            // },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Row>
                        <Col span={12}>
                            <Form.Item label="资产" name="createQuestion_capital"
                                rules={[
                                    {
                                        required: true,
                                        message: "资产不能为空"
                                    },
                                    {
                                        pattern: /^[a-zA-Z0-9_()（）\u4e00-\u9fa5]{1,32}$/,
                                        message: "资产为1至32位汉字、字母、数字、下划线或中英文括号"
                                    },
                                ]}
                            >
                                <Input placeholder="请输入资产名称" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="设备" name="createQuestion_equipment"
                                rules={[
                                    {
                                        required: true,
                                        message: "设备不能为空"
                                    },
                                    {
                                        pattern: /^[a-zA-Z0-9_()（）\u4e00-\u9fa5]{1,32}$/,
                                        message: "设备为1至32位汉字、字母、数字、下划线或中英文括号"
                                    },
                                ]}
                            >
                                <Input placeholder="请输入设备名称" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item label="优先级" name="createQuestion_priority"
                                rules={[
                                    {
                                        required: true,
                                        message: "优先级不能为空"
                                    }
                                ]}>
                                <Select placeholder="请选择优先级" style={{ width: '100%' }}>
                                    <Select.Option value="0">低</Select.Option>
                                    <Select.Option value="1">中</Select.Option>
                                    <Select.Option value="2">高</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="时间" name="createQuestion_time"
                                rules={[
                                    {
                                        required: true,
                                        message: "时间不能为空"
                                    }
                                ]}
                            >
                                <DatePicker.RangePicker locale={locale} style={{ width: '100%' }} onChange={() => this.createQuestion_onSelectTime} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item label="状态" name="createQuestion_status"
                                rules={[
                                    {
                                        required: true,
                                        message: "状态不能为空"
                                    }
                                ]}
                            >
                                <Select placeholder="请选择优先级" style={{ width: '100%' }}>
                                    <Select.Option value="0">新建</Select.Option>
                                    <Select.Option value="1">处理中</Select.Option>
                                    <Select.Option value="2">已解决</Select.Option>
                                    <Select.Option value="3">已忽略</Select.Option>
                                    <Select.Option value="4">待反馈</Select.Option>
                                    <Select.Option value="5">已关闭</Select.Option>
                                    <Select.Option value="6">重新打开</Select.Option>
                                    <Select.Option value="7">已指定</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="类型" name="createQuestion_type"
                                rules={[
                                    {
                                        required: true,
                                        message: "类型不能为空"
                                    }
                                ]}
                            >
                                <Select placeholder="请选择优先级" style={{ width: '100%' }}>
                                    <Select.Option value="0">Bug</Select.Option>
                                    <Select.Option value="1">任务</Select.Option>
                                    <Select.Option value="2">功能</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item label="版本" name="createQuestion_version"
                                rules={[
                                    {
                                        required: true,
                                        message: "版本不能为空"
                                    }
                                ]}
                            >
                                <Select placeholder="请选择版本" style={{ width: '100%' }}>
                                    <Select.Option value="jack">无</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="模块" name="createQuestion_modular"
                                rules={[
                                    {
                                        required: true,
                                        message: "模块不能为空"
                                    }
                                ]}
                            >
                                <Select placeholder="请选择模块" style={{ width: '100%' }}>
                                    <Select.Option value="jack">无</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item label="指派给" name="createQuestion_assignedTo"
                                rules={[
                                    {
                                        required: true,
                                        message: "指派不能为空"
                                    }
                                ]}
                            >
                                <Select placeholder="请选择指派人" style={{ width: '100%' }}>
                                    <Select.Option value="jack">我</Select.Option>
                                    <Select.Option value="lucy">未指派</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            {/* <Form.Item label="关注" name="createQuestion_follow"
                                rules={[
                                    {
                                        required: true,
                                        message: "关注不能为空"
                                    }
                                ]}
                            >
                                <Select placeholder="请选择关注" style={{ width: '100%' }}>
                                    <Select.Option value="lucy">梦远他乡</Select.Option>
                                </Select>
                            </Form.Item> */}
                        </Col>
                    </Row>
                    <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} label="描述" name="createQuestion_describe"
                        rules={[
                            {
                                required: true,
                                message: "描述不能为空"
                            }
                        ]}
                    >
                        <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
                    </Form.Item>
                    {/* <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} label="附件" name="createQuestion_enclosure">
                        <Upload {...props}>
                            <Button icon={<UploadOutlined />}>点击上传</Button>
                        </Upload>
                    </Form.Item> */}
                </Form>
            </Modal>

            <Modal
                title="问题详情"
                visible={this.state.checkQuestion_visible}
                width={660}
                // onOk={this.checkQuestion_onOk}
                onCancel={this.checkQuestion_onCancel}
                okText="确认"
                cancelText="取消"
                afterClose={this.checkQuestion_onAfterClose}
                maskClosable={false}
                width={800}
                destroyOnClose={true}
                footer={null}
            >
                <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} ref={this.checkQuestion_formRef} onFinish={this.checkQuestion_onSubmit} initialValues={this.state.checkQuestion_initialValues}>
                    <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} label="主题" name="checkQuestion_subject">
                        <Input disabled />
                    </Form.Item>
                    <Row>
                        <Col span={12}>
                            <Form.Item label="创建时间" name="checkQuestion_creationTime">
                                <Input disabled />
                            </Form.Item>

                        </Col>
                        <Col span={12}>
                            <Form.Item label="编辑时间" name="checkQuestion_updateTime">
                                <Input disabled />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item label="创建人" name="checkQuestion_creator">
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="编辑人" name="checkQuestion_editor">
                                <Input disabled />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item label="状态" name="checkQuestion_status"
                                rules={[
                                    {
                                        required: true,
                                        message: "状态不能为空"
                                    }
                                ]}
                            >
                                <Select placeholder="请选择状态" style={{ width: '100%' }}>
                                    <Select.Option value="0">新建</Select.Option>
                                    <Select.Option value="1">处理中</Select.Option>
                                    <Select.Option value="2">已解决</Select.Option>
                                    <Select.Option value="3">已忽略</Select.Option>
                                    <Select.Option value="4">待反馈</Select.Option>
                                    <Select.Option value="5">已关闭</Select.Option>
                                    <Select.Option value="6">重新打开</Select.Option>
                                    <Select.Option value="7">已指定</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="类型" name="checkQuestion_type"
                                rules={[
                                    {
                                        required: true,
                                        message: "状态不能为空"
                                    }
                                ]}
                            >
                                <Select placeholder="请选择问题类型" style={{ width: '100%' }}>
                                    <Select.Option value="0">Bug</Select.Option>
                                    <Select.Option value="1">任务</Select.Option>
                                    <Select.Option value="2">功能</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item label="资产" name="checkQuestion_capital">
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="设备" name="checkQuestion_equipment">
                                <Input disabled />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item label="优先级" name="checkQuestion_priority"
                                rules={[
                                    {
                                        required: true,
                                        message: "优先级不能为空"
                                    }
                                ]}
                            >
                                <Select placeholder="请选择优先级" style={{ width: '100%' }}>
                                    <Select.Option value="0">低</Select.Option>
                                    <Select.Option value="1">中</Select.Option>
                                    <Select.Option value="2">高</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="时间" name="checkQuestion_time"
                                rules={[
                                    {
                                        required: true,
                                        message: "时间不能为空"
                                    }
                                ]}
                            >
                                <DatePicker.RangePicker style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item label="版本" name="checkQuestion_version"
                                rules={[
                                    {
                                        required: true,
                                        message: "版本不能为空"
                                    }
                                ]}
                            >
                                <Select placeholder="请选择版本" style={{ width: '100%' }}>
                                    <Select.Option value="jack">无</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="模块" name="checkQuestion_modular"
                                rules={[
                                    {
                                        required: true,
                                        message: "模块不能为空"
                                    }
                                ]}
                            >
                                <Select placeholder="请选择模块" style={{ width: '100%' }}>
                                    <Select.Option value="jack">无</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item label="指派给" name="checkQuestion_assignedTo"
                                rules={[
                                    {
                                        required: true,
                                        message: "指派给不能为空"
                                    }
                                ]}
                            >
                                <Select placeholder="请选择指派人" style={{ width: '100%' }}>
                                    <Select.Option value="jack">我</Select.Option>
                                    <Select.Option value="lucy">未指派</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            {/* <Form.Item label="关注" name="checkQuestion_follow"
                                rules={[
                                    {
                                        required: true,
                                        message: "关注不能为空"
                                    }
                                ]}
                            >
                                <Select placeholder="请选择关注" style={{ width: '100%' }}>
                                    <Select.Option value="lucy">梦远他乡</Select.Option>
                                </Select>
                            </Form.Item> */}
                        </Col>
                    </Row>
                    <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} label="描述" name="checkQuestion_describe">

                    </Form.Item>
                    <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} label="解决方案" name="checkQuestion_resolve">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item wrapperCol={{ span: 21, offset: 3 }}>
                        <Button type="primary" htmlType="submit">保存</Button>
                    </Form.Item>
                    {/* <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} label="附件" name="checkQuestion_enclosure">
                        <Upload {...props}>
                            <Button icon={<UploadOutlined />}>点击上传</Button>
                        </Upload>
                    </Form.Item> */}
                    <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} label="动态" name="checkQuestion_enclosure" style={{ marginBottom: 0 }}>
                        <Timeline style={{ background: "#f8f9fb", paddingLeft: "20px", paddingTop: "20px", paddingRight: "20px", height: "150px", overflow: "auto" }}>
                            <Timeline.Item>Create a services site <span style={{ float: "right", paddingRight: "20px" }}>2015-09-01</span></Timeline.Item>
                            <Timeline.Item>Solve initial network problems <span style={{ float: "right", paddingRight: "20px" }}>2015-09-01</span></Timeline.Item>
                            <Timeline.Item dot={<ClockCircleOutlined className="timeline-clock-icon" />} color="red">
                                Technical testing <span style={{ float: "right", paddingRight: "20px" }}>2015-09-01</span>
                            </Timeline.Item>
                            <Timeline.Item>Network problems being solved <span style={{ float: "right", paddingRight: "20px" }}>2015-09-01</span></Timeline.Item>
                            <Timeline.Item>
                                <p>Network problems being solved <span style={{ float: "right", paddingRight: "20px" }}>2015-09-01</span></p>
                                <p>大孙菲菲</p>
                            </Timeline.Item>
                        </Timeline>
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 3, span: 21 }} name="checkQuestion_describe">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 3, span: 21 }}>
                        <Button type="primary">评论</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div >)
    }
}