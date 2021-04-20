import React from 'react'
import { Row, Col, Card, Form, Input, Button, Table, Tag, Space, Modal, Select, DatePicker, message, Tooltip, Timeline } from 'antd';
import { ClockCircleOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import moment from 'moment'
import E from 'wangeditor'
import axios from 'axios'
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import "./question.css"

export default class MenuCom extends React.Component {
    state = {
        selectedRowKeys: [], // 表格选择项Keys
        selectedRows: [], // 表格选择项Rows
        tableData: [], // 表格数据源
        total: 0, // 表格数据数
        title: "", // 普通搜索(只要搜索标题)
        // 高级搜索
        advancedSearch_visible: false,
        advancedSearch_type: "", // 类型
        advancedSearch_status: "", // 状态
        advancedSearch_priority: "", // 优先级
        advancedSearch_creator: "", // 创建人
        advancedSearch_assign: "", // 指派
        advancedSearch_modular: "", // 模块
        advancedSearch_createTime: "", // 创建时间
        advancedSearch_lastUpdateTime: "", // 最后更新时间
        advancedSearch_beginTime: "", // 开始时间
        advancedSearch_finishTime: "", // 结束时间
        // 创建问题
        createQuestion_visible: false,
        // 查看、编辑问题
        checkQuestion_id: "",
        checkQuestion_visible: true,
        checkQuestion_initialValues: {}, // 问题详情
        checkQuestion_resolve_visible: false,
        checkQuestion_comments: [],
    }

    onSearchTitle = value => {
        this.setState({
            title: value
        }, function () {
            this.getData(1, 5);
        })
    }

    /**
     * 高级搜索
     */
    advancedSearch_formRef = React.createRef();

    advancedSearch_onOk = () => {
        const _this = this;
        this.advancedSearch_formRef.current.validateFields().then(values => {
            _this.setState({
                advancedSearch_type: values.advancedSearch_type === undefined ? "" : values.advancedSearch_type,
                advancedSearch_status: values.advancedSearch_status === undefined ? "" : values.advancedSearch_status,
                advancedSearch_priority: values.advancedSearch_priority === undefined ? "" : values.advancedSearch_priority,
                advancedSearch_creator: values.advancedSearch_creator === undefined ? "" : values.advancedSearch_creator,
                advancedSearch_assign: values.advancedSearch_assign === undefined ? "" : values.advancedSearch_assign,
                advancedSearch_modular: values.advancedSearch_modular === undefined ? "" : values.advancedSearch_modular,
                advancedSearch_beginTime: values.advancedSearch_beginTime === undefined ? "" : moment(values.advancedSearch_beginTime).format('YYYY-MM-DD'),
                advancedSearch_finishTime: values.advancedSearch_finishTime === undefined ? "" : moment(values.advancedSearch_finishTime).format('YYYY-MM-DD'),
            }, () => {
                _this.getData(1, 5);
                _this.advancedSearch_formRef.current.resetFields();
                _this.setState({
                    advancedSearch_visible: false
                });
            })
        }).catch(error => {
            message.error("error");
        })
    }

    advancedSearch_onCancel = () => {
        this.advancedSearch_formRef.current.resetFields();

        this.setState({
            advancedSearch_visible: false
        })
    }

    //设置开始日期不能选择的时间
    disabled_advancedSearch_beginTime = startValue => {
        const { advancedSearch_finishTime } = this.state
        if (!startValue || !advancedSearch_finishTime) {
            return false
        }
        return startValue.valueOf() > advancedSearch_finishTime.valueOf()
    }

    //设置结束不能选择的时间
    disabled_advancedSearch_finishTime = endValue => {
        const { advancedSearch_beginTime } = this.state
        if (!endValue || !advancedSearch_beginTime) {
            return false
        }
        return endValue.valueOf() <= advancedSearch_beginTime.valueOf()
    }
    //触发组件改变默认value
    on_advancedSearch_beginFinishTime = (field, value) => {
        this.setState({
            [field]: value,
        })
    }

    on_advancedSearch_beginTime = value => {
        this.on_advancedSearch_beginFinishTime('advancedSearch_beginTime', value)
    }
    on_advancedSearch_finishTime = value => {
        this.on_advancedSearch_beginFinishTime('advancedSearch_finishTime', value)
    }

    /**
     * 新建问题
     */

    createQuestion_formRef = React.createRef();
    createQuestion_descriptionWangEditor = {}; // 编辑器

    createQuestion_onSelectTime = (value, dateString) => {
        console.log('value：', value)
        console.log('dateString：', dateString)
    }

    createQuestion_showModal = () => {
        const _this = this;

        this.setState({
            createQuestion_visible: true
        }, function () {
            setTimeout(function () {
                _this.createQuestion_descriptionWangEditor = new E(document.getElementById("createQuestion_description"));

                // 上传图片
                _this.createQuestion_descriptionWangEditor.config.uploadImgServer = '/api/bug/create_upload/';
                _this.createQuestion_descriptionWangEditor.config.uploadFileName = 'createQuestion_descriptionImg';
                _this.createQuestion_descriptionWangEditor.config.height = 150;
                _this.createQuestion_descriptionWangEditor.config.showLinkImg = false;
                _this.createQuestion_descriptionWangEditor.config.uploadImgTimeout = 60 * 1000;
                _this.createQuestion_descriptionWangEditor.config.placeholder = '请输入评论描述内容';

                _this.createQuestion_descriptionWangEditor.config.uploadImgHooks = {
                    customInsert: function (insertImg, result) {
                        if (!result.error) {
                            insertImg(result.data.url);
                        } else {
                            message.error(result.error);
                        }
                    }
                }

                /**一定要创建 */
                _this.createQuestion_descriptionWangEditor.create()
            }, 100)
        })
    }

    createQuestion_onOk = () => {
        const _this = this;
        this.createQuestion_formRef.current.validateFields().then(values => {
            let params = {
                title: values.createQuestion_title,
                devices: values.createQuestion_equipment,
                asset: values.createQuestion_asset,
                priority: values.createQuestion_priority,
                type: values.createQuestion_type,
                description: _this.createQuestion_descriptionWangEditor.txt.html(),
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
        }).catch(error => {
            console.log("error");
        })
    }

    createQuestion_onCancel = () => {
        this.createQuestion_formRef.current.resetFields();

        this.setState({
            createQuestion_visible: false
        })
    }

    /**
     * 问题详情、编辑问题
    */

    // 编辑器
    wangEditor = {};
    commentWangEditor = {};

    checkQuestion_showModal = (data) => {
        const _this = this;
        this.setState({
            checkQuestion_visible: true,
            checkQuestion_id: data.id,
            checkQuestion_initialValues: {
                checkQuestion_title: data.title,
                checkQuestion_asset: data.asset,
                checkQuestion_equipment: data.devices,
                checkQuestion_creator: data.create_by,
                checkQuestion_designator: data.designator,
                checkQuestion_status: data.status + "",
                checkQuestion_type: data.type + "",
                checkQuestion_description: data.description,
                checkQuestion_priority: data.priority + "",
                checkQuestion_creationTime: data.create_at,
                checkQuestion_version: data.release,
                checkQuestion_modular: data.model,
                checkQuestion_assignedTo: data.assign_by,
                checkQuestion_follow: data.follow,
                checkQuestion_time: [moment(data.start_time, "YYYY-MM-DD"), moment(data.finish_time, "YYYY-MM-DD")],
            }
        }, function () {
            /**
             * 编辑器相关
             */
            setTimeout(function () {
                _this.wangEditor = new E(document.getElementById("checkQuestion_description"));

                // 上传图片
                _this.wangEditor.config.uploadImgServer = '/api/bug/upload/';
                _this.wangEditor.config.uploadFileName = 'checkQuestion_descriptionImg';
                _this.wangEditor.config.height = 150;
                _this.wangEditor.config.showLinkImg = false;
                _this.wangEditor.config.uploadImgTimeout = 60 * 1000;
                _this.wangEditor.config.menus = [

                ]

                _this.wangEditor.config.uploadImgHooks = {
                    customInsert: function (insertImg, result) {
                        if (!result.error) {
                            insertImg(result.data.url);
                        } else {
                            message.error(result.error);
                        }
                    }
                }

                _this.wangEditor.create()

                _this.wangEditor.txt.html(data.description) // 重新设置编辑器内容

                _this.wangEditor.disable()

                /**
                 * 评论
                 */
                _this.commentWangEditor = new E(document.getElementById("checkQuestion_comment"));

                // 上传图片
                _this.commentWangEditor.config.uploadImgServer = '/api/bug/comment_upload/';
                _this.commentWangEditor.config.uploadFileName = 'checkQuestion_commentImg';
                _this.commentWangEditor.config.height = 150;
                _this.commentWangEditor.config.showLinkImg = false;
                _this.commentWangEditor.config.uploadImgTimeout = 60 * 1000;
                _this.commentWangEditor.config.placeholder = '请输入评论';

                _this.commentWangEditor.config.uploadImgHooks = {
                    customInsert: function (insertImg, result) {
                        if (!result.error) {
                            insertImg(result.data.url);
                        } else {
                            message.error(result.error);
                        }
                    }
                }

                _this.commentWangEditor.create();

                //_this.commentWangEditor.txt.html('<p>用 JS 设置的内容</p>');
            }, 100)

            /**
             * 获取评论
             */
            _this.checkQuestion_getComments(this.state.checkQuestion_id);
        })
    }

    checkQuestion_getComments = id => {
        const _this = this;
        axios.get(`/api/bug/comment/?id=${id}`).then(resp => {
            console.log("resp.data.data");
            console.log(resp.data.data);
            if (!resp.data.error) {
                _this.setState({
                    checkQuestion_comments: resp.data.data
                })
            } else {
                message.error(resp.data.error);
            }
        }).catch(error => {
            message.error("error");
        })
    }

    checkQuestion_formRef = React.createRef();

    checkQuestion_onSave = () => {
        const _this = this;

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
                description: _this.wangEditor.txt.html(),
                resolve: values.checkQuestion_resolve
            }

            axios({
                method: "PATCH",
                url: "/api/bug/buginfo/",
                data: JSON.stringify(params)
            }).then(resp => {
                if (!resp.data.error) { // None
                    message.success('修改问题成功。');
                    this.setState({
                        checkQuestion_visible: false
                    });

                    this.getData(1, 5);
                } else {
                    message.error(resp.data.error);
                }
            }, error => {
                console.log("error");
            });
        }).catch(error => {
            console.log("error");
        })
    }

    checkQuestion_status_onChange = value => {
        value == "2" ? this.setState({ checkQuestion_resolve_visible: true }) : this.setState({ checkQuestion_resolve_visible: false });
    }

    checkQuestion_onSubmitComment = () => {
        const _this = this;

        const params = {
            bug_id: this.state.checkQuestion_id,
            content: this.commentWangEditor.txt.html()
        }

        axios({
            method: "POST",
            url: "/api/bug/comment/",
            data: JSON.stringify(params)
        }).then(resp => {
            if (!resp.data.error) { // None
                message.success('添加评论成功。');
                _this.checkQuestion_getComments(this.state.checkQuestion_id);
                _this.commentWangEditor.txt.html("");
            } else {
                message.error(resp.data.error);
            }
        }, (err) => {
            console.log("err");
        });
    }

    checkQuestion_onCancel = () => {
        const _this = this;
        this.setState({
            checkQuestion_visible: false
        }, function () {
            _this.wangEditor.destroy();
            _this.commentWangEditor.destroy();
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
                        return (<Tag color="#c9cacb">bug</Tag>);
                    } else if (Number(record.type) === 1) {
                        return (<Tag color="#f50">任务</Tag>);
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
        axios.get(`/api/bug/buginfo/?pageSize=${pageSize}&pageNumber=${pageNumber}&title=${this.state.title}&type=${this.state.advancedSearch_type}&status=${this.state.advancedSearch_status}&priority=${this.state.advancedSearch_priority}&created_by=${this.state.advancedSearch_creator}&assign_by=${this.state.advancedSearch_assign}&model=${this.state.advancedSearch_modular}&start_time=${this.state.advancedSearch_beginTime}&finish_time=${this.state.advancedSearch_finishTime}`).then(resp => {
            if (!resp.data.error) {
                let ajaxData = [];
                for (let i = 0; i < resp.data.data.length; i++) {
                    ajaxData.push({
                        assign_by: resp.data.data[i].assign_by,
                        create_at: resp.data.data[i].create_at,
                        create_by: resp.data.data[i].create_by,
                        finish_time: resp.data.data[i].finish_time,
                        id: resp.data.data[i].id,
                        priority: resp.data.data[i].priority,
                        start_time: resp.data.data[i].start_time,
                        status: resp.data.data[i].status,
                        title: resp.data.data[i].title,
                        type: resp.data.data[i].type,
                        update_at: resp.data.data[i].update_at,
                        update_by: resp.data.data[i].update_by,
                        description: resp.data.data[i].description,
                        release: resp.data.data[i].release,
                        model: resp.data.data[i].model,
                        asset: resp.data.data[i].asset,
                        devices: resp.data.data[i].devices
                    });
                }

                this.setState({
                    tableData: ajaxData,
                    total: resp.data.other.total
                })
            } else {
                message.error(resp.data.error);
            }
        }, error => {
            message.error("error");
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
                            })}>高级搜索</Button> <Button type="primary" icon={<PlusOutlined />} onClick={() => this.createQuestion_showModal()}>新建问题</Button>
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
                // afterClose={this.advancedSearch_onAfterClose}
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
                                <DatePicker locale={locale} placeholder="请选择开始时间" disabledDate={this.disabled_advancedSearch_beginTime} onChange={this.on_advancedSearch_beginTime} style={{ width: "100%" }} format={"YYYY-MM-DD"} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="结束时间" name="advancedSearch_finishTime">
                                <DatePicker locale={locale} placeholder="请选择结束时间" disabledDate={this.disabled_advancedSearch_finishTime} onChange={this.on_advancedSearch_finishTime} style={{ width: "100%" }} format={"YYYY-MM-DD"} />
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
                style={{ top: 5 }}
                // afterClose={this.createQuestion_onAfterClose}
                maskClosable={false}
                destroyOnClose={true}
                width={800}
            >
                <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} ref={this.createQuestion_formRef}>
                    <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} label="主题" name="createQuestion_title"
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
                            <Form.Item label="资产" name="createQuestion_asset"
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
                                    <Select.Option value="0">无</Select.Option>
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
                                    <Select.Option value="0">无</Select.Option>
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
                                    <Select.Option value="0">我</Select.Option>
                                    <Select.Option value="1">未指派</Select.Option>
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
                    <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} label="描述" name="createQuestion_description">
                        <div id="createQuestion_description"></div>
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
                okText="评论"
                cancelText="关闭"
                // afterClose={this.checkQuestion_onAfterClose}
                maskClosable={false}
                width={800}
                destroyOnClose={true}
                style={{ top: 5 }}
            // footer={null}
            >
                <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} ref={this.checkQuestion_formRef} onFinish={this.checkQuestion_onSubmit} initialValues={this.state.checkQuestion_initialValues} style={{ height: 400, overflow: 'auto', paddingRight: 10 }}>
                    <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} label="主题" name="checkQuestion_title">
                        <Input disabled />
                    </Form.Item>
                    <Row>
                        <Col span={12}>
                            <Form.Item label="创建人" name="checkQuestion_creator">
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="创建时间" name="checkQuestion_creationTime">
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
                                <Select placeholder="请选择状态" style={{ width: '100%' }} onChange={this.checkQuestion_status_onChange}>
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
                            <Form.Item label="资产" name="checkQuestion_asset">
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
                                    <Select.Option value="0">无</Select.Option>
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
                                    <Select.Option value="0">无</Select.Option>
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
                                    <Select.Option value="0">我</Select.Option>
                                    <Select.Option value="1">未指派</Select.Option>
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
                    <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} label="描述" name="checkQuestion_description">
                        <div id="checkQuestion_description"></div>
                    </Form.Item>
                    {this.state.checkQuestion_resolve_visible ? (
                        <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} label="解决方案" name="checkQuestion_resolve"
                            rules={[
                                {
                                    required: true,
                                    message: "解决方案不能为空"
                                }
                            ]}
                        >
                            <Input.TextArea />
                        </Form.Item>) : (<></>)}

                    {/* <Form.Item wrapperCol={{ span: 21, offset: 3 }}>
                        <Button type="primary" onClick={() => this.checkQuestion_onSave()}>保存</Button>
                    </Form.Item> */}
                    <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} label="动态" name="checkQuestion_enclosure" style={{ marginBottom: 0 }}>
                        <Timeline style={{ background: "#f8f9fb", paddingLeft: "20px", paddingTop: "20px", paddingRight: "20px", minHeight: "50px", maxHeight: "300px", overflow: "auto" }}>
                            {
                                this.state.checkQuestion_comments.map((v, i) => (
                                    <Timeline.Item><p>创建人：{v.create_by} <span style={{ float: "right", paddingRight: "20px" }}>创建时间：{v.create_at}</span></p>
                                        <div dangerouslySetInnerHTML={{ __html: v.content }}></div></Timeline.Item>))
                            }
                        </Timeline>
                    </Form.Item>
                </Form>
                <Form labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} style={{ borderTop: '1px solid #dddddd' }}>
                    <Form.Item wrapperCol={{ offset: 3, span: 21 }} name="checkQuestion_comment">
                        <div id="checkQuestion_comment"></div>
                    </Form.Item>
                    {/* <Form.Item wrapperCol={{ offset: 3, span: 21 }}>
                        <Button type="primary" onClick={() => { this.checkQuestion_onSubmitComment() }}>评论</Button>
                    </Form.Item> */}
                </Form>
            </Modal>
        </div >)
    }
}