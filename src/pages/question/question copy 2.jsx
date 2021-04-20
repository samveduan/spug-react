import React from 'react'
import { Row, Col, Card, Form, Input, Button, Table, Tag, Space, Modal, Select, DatePicker, message, Tooltip, Timeline } from 'antd';
import { ClockCircleOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import moment from 'moment'
import E from 'wangeditor'
import axios from 'axios'
import locale from 'antd/es/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn';
import "./question.css"


export default class MenuCom extends React.Component {
    state = {
        // 表格
        selectedRowKeys: [], // 表格选择项Keys
        selectedRows: [], // 表格选择项Rows
        tableData: [], // 表格数据源
        total: 0, // 表格数据数
        // 普通搜索(只要搜索标题)
        title: "", 
        // 高级搜索
        advancedSearch_visible: false, // 高级搜索
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
        // 创建问题
        createQuestion_visible: false, // 创建问题
        // 查看、编辑问题
        checkQuestion_id: "",
        checkQuestion_visible: false,
        checkQuestion_initialValues: {}, // 问题详情
        checkQuestion_resolve_visible: false,
    }

    /**
     * 普通搜索
     */
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
        this.advancedSearch_formRef.current.validateFields().then(values => {
            this.setState({
                advancedSearch_type: values.advancedSearch_type === undefined ? "" : values.advancedSearch_type,
                advancedSearch_status: values.advancedSearch_status === undefined ? "" : values.advancedSearch_status,
                advancedSearch_priority: values.advancedSearch_priority === undefined ? "" : values.advancedSearch_priority,
                advancedSearch_creator: values.advancedSearch_creator === undefined ? "" : values.advancedSearch_creator,
                advancedSearch_assign: values.advancedSearch_assign === undefined ? "" : values.advancedSearch_assign,
                advancedSearch_modular: values.advancedSearch_modular === undefined ? "" : values.advancedSearch_modular,
                advancedSearch_beginTime: values.advancedSearch_beginTime === undefined ? "" : moment(values.advancedSearch_beginTime).format('YYYY-MM-DD'),
                advancedSearch_finishTime: values.advancedSearch_finishTime === undefined ? "" : moment(values.advancedSearch_finishTime).format('YYYY-MM-DD'),
            }, function () {
                this.getData(1, 5);
                this.advancedSearch_formRef.current.resetFields();
                this.setState({
                    advancedSearch_visible: false
                });
            })
        }).catch(error => {
            message.error(error);
        })
    }

    advancedSearch_onCancel = () => {
        this.advancedSearch_formRef.current.resetFields();

        this.setState({
            advancedSearch_visible: false
        })
    }

    //设置开始日期不能选择的时间
    advancedSearch_beginTime_disabled = startValue => {
        const { advancedSearch_finishTime } = this.state
        if (!startValue || !advancedSearch_finishTime) {
            return false
        }
        return startValue.valueOf() > advancedSearch_finishTime.valueOf()
    }

    //设置结束不能选择的时间
    advancedSearch_finishTime_disabled = endValue => {
        const { advancedSearch_beginTime } = this.state
        if (!endValue || !advancedSearch_beginTime) {
            return false
        }
        return endValue.valueOf() <= advancedSearch_beginTime.valueOf()
    }
    //触发组件改变默认value
    advancedSearch_onBeginFinishTime = (field, value) => {
        this.setState({
            [field]: value,
        })
    }

    advancedSearch_onBeginTime = value => {
        this.advancedSearch_onBeginFinishTime('advancedSearch_beginTime', value)
    }
    advancedSearch_onFinishTime = value => {
        this.advancedSearch_onBeginFinishTime('advancedSearch_finishTime', value)
    }

    /**
     * 新建问题
     */
    createQuestion_formRef = React.createRef();

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
                    }, function(){
                        this.getData(1, 5);
                    });
                } else {
                    message.error(resp.data.error);
                }
            }, (err) => {
                message.error(err);
            });
        }).catch(error => {
            message.error(error);
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
                checkQuestion_follow: data.follow,
                checkQuestion_time: [moment(data.start_time, "YYYY-MM-DD"), moment(data.finish_time, "YYYY-MM-DD")],
            }
        }, function () {
            setTimeout(function () {
                _this.wangEditor = new E(document.getElementById("checkQuestion_describe"));

                // 上传图片
                _this.wangEditor.config.uploadImgServer = '/api/upload';
                _this.wangEditor.config.uploadFileName = 'myFileName';
                _this.wangEditor.config.height = 150;
                _this.wangEditor.config.showLinkImg = false;
                _this.wangEditor.config.uploadImgTimeout = 60 * 1000;

                _this.wangEditor.config.uploadImgHooks = {
                    // 图片上传并返回了结果，想要自己把图片插入到编辑器中
                    // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
                    customInsert: function (insertImg, result) {
                        // result 即服务端返回的接口
                        console.log('customInsert', result)
                        console.log('customInsert')
                        console.log(result)

                        //var c = result.data[0].imgPath
                        //insertImg(insertImg);
                        insertImg("https://x0.ifengimg.com/res/2021/21921B99567A8C981CD0503086C2956B68888571_size381_w1200_h856.jpeg") //根据返回的图片路径，将图片插入到页面中，回显
                    }
                }

                /**一定要创建 */
                _this.wangEditor.create()

                _this.wangEditor.txt.html('<p>用 JS 设置的内容</p>') // 重新设置编辑器内容

                /**
                 * 评论
                 */
                _this.commentWangEditor = new E(document.getElementById("checkQuestion_comment"));

                // 上传图片
                _this.commentWangEditor.config.uploadImgServer = '/api/upload';
                _this.commentWangEditor.config.uploadFileName = 'myFileName';
                _this.commentWangEditor.config.height = 150;
                _this.commentWangEditor.config.showLinkImg = false;
                _this.commentWangEditor.config.uploadImgTimeout = 60 * 1000;

                _this.commentWangEditor.config.uploadImgHooks = {
                    // 图片上传并返回了结果，想要自己把图片插入到编辑器中
                    // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
                    customInsert: function (insertImg, result) {
                        // result 即服务端返回的接口
                        console.log('customInsert', result)
                        console.log('customInsert')
                        console.log(result)

                        //var c = result.data[0].imgPath
                        insertImg(insertImg);
                        //insertImg("https://x0.ifengimg.com/res/2021/21921B99567A8C981CD0503086C2956B68888571_size381_w1200_h856.jpeg") //根据返回的图片路径，将图片插入到页面中，回显
                    }
                }

                /**一定要创建 */
                _this.commentWangEditor.create()

                _this.commentWangEditor.txt.html('<p>用 JS 设置的内容</p>') // 重新设置编辑器内容
            }, 500)
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

            // axios({
            //     method: "PATCH",
            //     url: "/api/bug/buginfo/",
            //     data: JSON.stringify(params)
            // }).then(resp => {
            //     if (!resp.data.error) { // None
            //         message.success('修改问题成功。');
            //         this.setState({
            //             checkQuestion_visible: false
            //         });

            //         this.getData(1, 5);
            //     } else {
            //         message.error(resp.data.error);
            //     }
            // }, (err) => {
            //     console.log("err");
            // });
        }).catch(error => {
            message.error(error);
        })
    }

    checkQuestion_status_onChange = value => {
        value == "2" ? this.setState({ checkQuestion_resolve_visible: true }) : this.setState({ checkQuestion_resolve_visible: false });
    }

    checkQuestion_onSubmitComment = () => {
        const comment = this.commentWangEditor.txt.html();
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
                    total: resp.data.total
                })
            } else {
                message.error(resp.data.error);
            }
        }, error => {
            message.error(error);
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
                                <DatePicker locale={locale} placeholder="请选择开始时间" disabledDate={this.advancedSearch_beginTime_disabled} onChange={this.advancedSearch_onBeginTime} style={{ width: "100%" }} format={"YYYY-MM-DD"} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="结束时间" name="advancedSearch_finishTime">
                                <DatePicker locale={locale} placeholder="请选择结束时间" disabledDate={this.advancedSearch_finishTime_disabled} onChange={this.advancedSearch_onFinishTime} style={{ width: "100%" }} format={"YYYY-MM-DD"} />
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
                <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} labelAlign="left" ref={this.createQuestion_formRef}>
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
                                <DatePicker.RangePicker locale={locale} style={{ width: '100%' }} />
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
                        <Input.TextArea></Input.TextArea>
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
                // afterClose={this.checkQuestion_onAfterClose}
                maskClosable={false}
                width={800}
                destroyOnClose={true}
                style={{ top: 5 }}
                footer={null}
            >
                <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} labelAlign="left" ref={this.checkQuestion_formRef} onFinish={this.checkQuestion_onSubmit} initialValues={this.state.checkQuestion_initialValues}>
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
                        <div id="checkQuestion_describe"></div>
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

                    <Form.Item wrapperCol={{ span: 21, offset: 3 }}>
                        <Button type="primary" onClick={() => this.checkQuestion_onSave()}>保存</Button>
                    </Form.Item>
                    <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} label="动态" name="checkQuestion_enclosure" style={{ marginBottom: 0 }}>
                        <Timeline style={{ background: "#f8f9fb", paddingLeft: "20px", paddingTop: "20px", paddingRight: "20px", height: "200px", overflow: "auto" }}>
                            <Timeline.Item>
                                <p>习近平的博鳌关键词 <span style={{ float: "right", paddingRight: "20px" }}>2021-04-18 16:36:27</span></p>
                                <p> 海阔天高美 椰风暖人醉20年前在海南省琼海市的一个小镇一个国际高端对话平台宣告成立</p>
                                <p><img width="300" src="https://x0.ifengimg.com/ucms/2021_17/ADD4D89247E5A2237E7CE22DDDCD269CDA570E87_size88_w1000_h999.jpg"/></p>
                            </Timeline.Item>
                            <Timeline.Item>生态环境部：希望日本对国际社会负责习近平8个比喻意蕴深远 <span style={{ float: "right", paddingRight: "20px" }}>2015-09-01</span></Timeline.Item>
                            <Timeline.Item dot={<ClockCircleOutlined className="timeline-clock-icon" />} color="red">
                            学好百年党史 汲取奋进力量 <span style={{ float: "right", paddingRight: "20px" }}>2015-09-01</span>
                            </Timeline.Item>
                            <Timeline.Item>40位国家政要、前政要相聚博鳌，他们在讨论啥？ <span style={{ float: "right", paddingRight: "20px" }}>2015-09-01</span></Timeline.Item>
                            <Timeline.Item>2021互联网岳麓峰会“创意新高地 数字新世界”专场论坛举行 <span style={{ float: "right", paddingRight: "20px" }}>2015-09-01</span></Timeline.Item>
                        </Timeline>
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 3, span: 21 }} name="checkQuestion_comment">
                        <div id="checkQuestion_comment"></div>
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 3, span: 21 }}>
                        <Button type="primary" onClick={() => { this.checkQuestion_onSubmitComment() }}>评论</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div >)
    }
}