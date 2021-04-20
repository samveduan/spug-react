import React, { Component } from 'react'
import { Row, Col, Card, Table, Form, Select, Button, Radio, Input, Space, Divider, Typography, Spin, Tag, Dropdown, Menu } from 'antd'
import { SyncOutlined, PlusOutlined, DownOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios'

export default class Plan extends Component {
    state = {
        plan_selectedRowKeys: [], // 表格选择项Keys
        plan_selectedRows: [], // 表格选择项Rows
        plan_tableData: [], // 表格相关
        plan_total: 0, // 表格相关
        plan_tableSpin: true, // 表格相关
    }

    /**
     * 表格
    */
    plan_getColumns = () => {
        return [
            {
                title: '任务名称',
                dataIndex: 'title',
                width: 200,
            },
            {
                title: '任务类型',
                dataIndex: 'type',
                width: 150
            },
            {
                title: '最新状态',
                dataIndex: 'status',
                render: (text, record) => (record.status == 0 ? <Tag color="green">发布成功</Tag> : <Tag color="red">发布异常</Tag>)
            },
            {
                title: '更新于',
                dataIndex: 'datetime'
            },
            {
                title: '描述信息',
                dataIndex: 'describe'
            }, {
                title: '操作',
                width: 220,
                render: (text, record) => (
                    <Space split={<Divider type='vertical' />}>
                        <Typography.Link onClick={() => this.editplan_showModal(record.id, record.name, record.uuid, record.describe)}>查看</Typography.Link>
                        <Typography.Link onClick={() => this.onDeleteService(record.id)}>回滚</Typography.Link>
                        <Dropdown overlay={<Menu>
                            <Menu.Item>
                                <a target="_blank" href="https://www.antgroup.com">
                                    执行测试
                                </a>
                            </Menu.Item>
                            <Menu.Item>
                                <a target="_blank" href="https://www.aliyun.com">
                                    禁用任务
                                </a>
                            </Menu.Item>
                            <Menu.Item>
                                <a target="_blank" href="https://www.luohanacademy.com">
                                    历史记录
                                </a>
                            </Menu.Item>
                            <Menu.Item>删除</Menu.Item>
                        </Menu>}>
                            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                更多 <DownOutlined />
                            </a>
                        </Dropdown>
                    </Space>
                )
            }
        ];
    }

    // 获取表格数据
    plan_getData(pageNumber, pageSize) {
        let _this = this;
        _this.setState({
            plan_tableSpin: true
        })
        axios.get(`http://localhost:5555/api/plan_list/?pageSize=${pageSize}&pageNumber=${pageNumber}&sortName=id&sortOrder=desc&_=1595230808893`).then((resp) => {
            let ajaxData = [];
            for (let i = 0; i < resp.data.rows.length; i++) {
                ajaxData.push({
                    key: resp.data.rows[i].id,
                    id: resp.data.rows[i].id,
                    title: resp.data.rows[i].title,
                    describe: resp.data.rows[i].describe,
                    environment: resp.data.rows[i].environment,
                    type: resp.data.rows[i].type,
                    status: resp.data.rows[i].status,
                    datetime: resp.data.rows[i].datetime,
                    applicant: resp.data.rows[i].applicant,
                });
            }

            this.setState({
                plan_tableData: ajaxData,
                plan_total: resp.data.total,
                plan_tableSpin: false
            })
        }, (err) => {
            _this.setState({
                plan_tableSpin: false
            })
        });
    }

    plan_onChange = (pageNumber, pageSize) => {
        this.plan_pageNum = pageNumber;
        this.plan_pageSize = pageSize;
        this.plan_getData(pageNumber, pageSize);
    };

    plan_onTableSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ plan_selectedRowKeys: selectedRowKeys, plan_selectedRows: selectedRows });
    };

    /**
     * 生命周期
     */
    componentDidMount() {
        this.plan_getData(1, 5);
    }

    render() {
        const { plan_tableSpin } = this.state;

        return (
            <>
                <Card>
                    <Form layout='inline'>
                        <Form.Item label='状态' name='status' style={{ width: '25%' }}>
                            <Select placeholder='请选择'>
                                <Select.Option>未激活</Select.Option>
                                <Select.Option>已激活</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label='类型' name='type' style={{ width: '25%' }}>
                            <Select placeholder='请选择'>
                                <Select.Option>订单服务</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label='名称' name='name' style={{ width: '25%' }}>
                            <Input placeholder='请输入' />
                        </Form.Item>
                        <Form.Item>
                            <Button type='primary' icon={<SyncOutlined />}>刷新</Button>
                        </Form.Item>
                    </Form>

                    <div style={{ height: 20, clear: 'both' }}></div>

                    <Row>
                        <Col span={24}>
                            <Button type='primary' icon={<PlusOutlined />}>新建</Button>
                        </Col>
                    </Row>

                    <div style={{ height: 20, clear: 'both' }}></div>

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
                        //rowSelection={plan_rowSelection}
                        columns={this.plan_getColumns()}
                        dataSource={this.state.plan_tableData}
                        pagination={{
                            current: this.plan_pageNum,
                            total: this.state.plan_total,
                            pageSizeOptions: [5, 10, 20, 50, 100],
                            defaultPageSize: 5,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (plan_total, range) => `共 ${plan_total} 条`,
                            onChange: this.plan_onChange
                        }}
                        bordered
                    >
                        <Spin spinning={plan_tableSpin} />
                    </Table>
                </Card>
            </>
        )
    }
}
