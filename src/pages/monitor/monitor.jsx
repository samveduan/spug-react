import React, { Component } from 'react'
import { Row, Col, Card, Form, Select, Input, Button, Table, Steps } from 'antd'
import { Modal, Radio, Checkbox, message, Space, Alert, Typography, Transfer } from 'antd';
import { SyncOutlined, PlusOutlined, ImportOutlined, UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios'
import './monitor.less'

const mockData = [];
for (let i = 0; i < 20; i++) {
    mockData.push({
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`
    });
}

const oriTargetKeys = mockData.filter(item => +item.key % 3 > 1).map(item => item.key);

export default class Monitor extends Component {
    state = {
        createTask_visible: false, // 新建任务modal
        page: 0, // 新建任务modal step
        targetKeys: oriTargetKeys, // 穿梭框
        selectedKeys: [], // 穿梭框
        b1: true,
        b2: true,
        task_selectedRowKeys: [], // 表格选择项Keys
        task_selectedRows: [], // 表格选择项Rows
        task_tableData: [], // 表格相关
        task_total: 0 // 表格相关
    }

    /**
     * 新建任务
     */

    createTask_showModal = () => {
        this.setState({
            createTask_visible: true,
        });
    }

    createTask_formRef = React.createRef(); // 定义一个表单

    createTask_handleOk = e => {
        this.createTask_formRef.current.validateFields()
            .then(values => {
                this.createTask_formRef.current.resetFields();
                this.setState({
                    createTask_visible: false
                });
                console.log("表单值：");
                console.log(values);
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    }

    createTask_handleCancel = e => {
        this.createTask_formRef.current.resetFields();
        this.setState({
            createTask_visible: false,
        })
    }

    createTask_handleAfterClose = () => {
        console.log("modal 关闭了！");
    }

    // 穿梭框
    handleChange = (nextTargetKeys, direction, moveKeys) => {
        this.setState({ targetKeys: nextTargetKeys });

        console.log('targetKeys: ', nextTargetKeys);
        console.log('direction: ', direction);
        console.log('moveKeys: ', moveKeys);
    };

    handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });

        console.log('sourceSelectedKeys: ', sourceSelectedKeys);
        console.log('targetSelectedKeys: ', targetSelectedKeys);
    };

    handleScroll = (direction, e) => {
        console.log('direction:', direction);
        console.log('target:', e.target);
    };

    // 表单
    onCreateTask = values => {
        console.log(values);
    }

    onCheckTaskForm1 = () => {
        const _this = this;
        this.createTask_formRef.current.validateFields(['2name2', '2host2']).then(data => {
            console.log('data');

            _this.setState({
                b1: false
            })
        }).catch(error => {
            console.log('error');

            _this.setState({
                b1: true
            })
        })
    }

    /**
     * 表格
    */
    task_getColumns = () => {
        return [
            {
                title: 'ID',
                dataIndex: 'id',
                width: 30,
            },
            {
                title: '标题',
                dataIndex: 'title',
                width: 300,
                render: (text, record) => <a href="javascript: void(0)" target="_self" onClick={() => this.handleShowDetailBlog(record.id)}>{text}</a>
            },
            {
                title: '内容',
                dataIndex: 'content',
                render(text, record) {
                    return <div dangerouslySetInnerHTML={{ __html: record.content }} style={{}} />
                }
            }
        ];
    }

    // 获取表格数据
    task_getData(pageNumber, pageSize) {
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
                task_tableData: ajaxData,
                task_total: resp.data.total
            })
        }, (err) => {
            console.log(err);
        });
    }

    task_onChange = (pageNumber, pageSize) => {
        this.task_pageNum = pageNumber;
        this.task_pageSize = pageSize;
        this.task_getData(pageNumber, pageSize);
    };

    task_onTableSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ task_selectedRowKeys: selectedRowKeys, task_selectedRows: selectedRows });
    };

    /**
     * 生命周期函数
     */
    componentDidMount() {
        //this.task_getData(1, 5);
    }

    render() {
        const { targetKeys, selectedKeys, page, b1, b2 } = this.state;

        // 控制主机表格选择
        const task_rowSelection = {
            selectedRowKeys: this.state.task_selectedRowKeys,
            onChange: this.task_onTableSelectChange
        };

        return (<>
            <Card>
                <Form layout='inline'>
                    <Form.Item label='任务名称' name='name_' style={{ width: '20%' }}>
                        <Input placeholder='请输入' />
                    </Form.Item>
                    <Form.Item label='检测类型' name='type_' style={{ width: '20%' }}>
                        <Select placeholder='请选择'>
                            <Select.Option>端口检测</Select.Option>
                            <Select.Option>站点检测</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label='任务状态' name='status' style={{ width: '20%' }}>
                        <Select placeholder='请选择'>
                            <Select.Option>未激活</Select.Option>
                            <Select.Option>已激活</Select.Option>
                            <Select.Option>待检测</Select.Option>
                            <Select.Option>正常</Select.Option>
                            <Select.Option>异常</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type='primary' htmlType='submit' icon={<SyncOutlined />}>刷新</Button>
                    </Form.Item>
                </Form>

                <div style={{ height: 20, clear: 'both' }}></div>

                <Row>
                    <Col span={24}>
                        <Button type='primary' icon={<PlusOutlined />} onClick={() => this.createTask_showModal()}>新建</Button>
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
                            rowSelection={task_rowSelection}
                            columns={this.task_getColumns()}
                            dataSource={this.state.task_tableData}
                            pagination={{
                                current: this.task_pageNum,
                                total: this.state.task_total,
                                pageSizeOptions: [5, 10, 20, 50, 100],
                                defaultPageSize: 5,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (task_total, range) => `共 ${task_total} 条`,
                                onChange: this.task_onChange
                            }}
                            bordered
                        >
                        </Table></Col>
                </Row>
            </Card>

            <Modal
                title="新建任务"
                visible={this.state.createTask_visible}
                width={800}
                onOk={this.createTask_handleOk}
                onCancel={this.createTask_handleCancel}
                okText="确认"
                cancelText="取消"
                afterClose={this.createTask_handleAfterClose}
                maskClosable={false}
                destroyOnClose={true}
                footer={null}
            >
                <Steps current={page} className='steps'>
                    <Steps.Step title="创建任务" description="" />
                    <Steps.Step title="设置规则" description="" />
                </Steps>

                <Form labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} ref={this.createTask_formRef} onFinish={this.onCreateTask}>
                    <div style={{ display: this.state.page === 0 ? 'block' : 'none' }}>
                        <Form.Item label='监控类型' help='返回HTTP状态码200-399则判定为正常，其他为异常。' style={{ marginBottom: 15 }}>
                            <Select placeholder="请选择监控类型">
                                <Select.Option value="1">站点检测</Select.Option>
                                <Select.Option value="2">端口检测</Select.Option>
                                <Select.Option value="5">Ping检测</Select.Option>
                                <Select.Option value="3">进程检测</Select.Option>
                                <Select.Option value="4">自定义脚本</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label='任务名称' name='2name2' rules={[
                            {
                                required: true,
                                message: "用户名不能为空"
                            },
                            {
                                pattern: /^[a-zA-Z0-9_()（）\u4e00-\u9fa5]{1,32}$/,
                                message: "账号为1至32位汉字、字母、数字、下划线或中英文括号"
                            },
                        ]}>
                            <Input placeholder="请输入任务名称" onInput={() => this.onCheckTaskForm1()} />
                        </Form.Item>

                        <Form.Item label='监控地址' name='2host2' rules={[
                            {
                                required: true,
                                message: "用户名不能为空"
                            },
                            {
                                pattern: /^[a-zA-Z0-9_()（）\u4e00-\u9fa5]{1,32}$/,
                                message: "监控地址为1至32位汉字、字母、数字、下划线或中英文括号"
                            },
                        ]}
                        >
                            <Input addonBefore={
                                <Select defaultValue="http://" className="select-before">
                                    <Select.Option value="http://">http://</Select.Option>
                                    <Select.Option value="https://">https://</Select.Option>
                                </Select>
                            } onInput={() => this.onCheckTaskForm1()} placeholder='请输入监控地址' />
                        </Form.Item>

                        <Form.Item label='备注信息' name="describe">
                            <Input.TextArea placeholder="请输入备注信息" rows={5} />
                        </Form.Item>
                    </div>
                    <div style={{ display: this.state.page === 1 ? 'block' : 'none' }}>
                        <Form.Item label='监控频率' name='frequency' initialValue={5}>
                            <Radio.Group>
                                <Radio value={1}>1分钟</Radio>
                                <Radio value={5}>5分钟</Radio>
                                <Radio value={15}>15分钟</Radio>
                                <Radio value={30}>30分钟</Radio>
                                <Radio value={60}>60分钟</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item label='报警阈值' name="threshold" initialValue={1}>
                            <Radio.Group>
                                <Radio value={1}>1次</Radio>
                                <Radio value={2}>2次</Radio>
                                <Radio value={3}>3次</Radio>
                                <Radio value={4}>4次</Radio>
                                <Radio value={5}>5次</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item label='报警联系人组' required name='contacts'>
                            <Transfer
                                dataSource={mockData}
                                titles={['已有联系组', '已选联系组']}
                                targetKeys={targetKeys}
                                selectedKeys={selectedKeys}
                                onChange={this.handleChange}
                                onSelectChange={this.handleSelectChange}
                                onScroll={this.handleScroll}
                                render={item => item.title}
                                style={{ marginBottom: 16 }}
                            />
                        </Form.Item>

                        <Form.Item label='报警方式' name='methods' initialValue={['wechat', 'email']}
                            rules={[
                                {
                                    required: true,
                                    message: "报警方式不能为空"
                                }
                            ]}
                        >
                            <Checkbox.Group options={[
                                { label: '微信', value: 'wechat' },
                                { label: '短信', value: 'msg' },
                                { label: '钉钉', value: 'dingding' },
                                { label: '邮件', value: 'email' },
                                { label: '企业微信', value: 'qi_wechat' },
                            ]} />
                        </Form.Item>

                        <Form.Item label='通道沉默' help='相同的告警信息，沉默期内只发送一次。' name='silence' style={{ marginBottom: 15 }}>
                            <Select placeholder="请选择">
                                <Select.Option value={5}>5分钟</Select.Option>
                                <Select.Option value={10}>10分钟</Select.Option>
                                <Select.Option value={15}>15分钟</Select.Option>
                                <Select.Option value={30}>30分钟</Select.Option>
                                <Select.Option value={60}>60分钟</Select.Option>
                                <Select.Option value={3 * 60}>3小时</Select.Option>
                                <Select.Option value={6 * 60}>6小时</Select.Option>
                                <Select.Option value={12 * 60}>12小时</Select.Option>
                                <Select.Option value={24 * 60}>24小时</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
                        {page === 1 && <Button type="primary" disabled={this.state.b2} htmlType='submit'>提交</Button>}
                        {page === 1 && <Button style={{ marginLeft: 20 }} onClick={() => this.setState({ page: page - 1 })}>上一步</Button>}
                        {page === 0 && (<><Button disabled={this.state.b1} type="primary" onClick={() => this.setState({ page: page + 1 })}>下一步</Button>
                            <Button type="link" style={{ marginLeft: 20 }}>执行测试</Button></>)}
                    </Form.Item>
                </Form>
            </Modal>
        </>)
    }
}