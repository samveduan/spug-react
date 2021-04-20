import React, { Component } from 'react'
import { Row, Col, Card, Table, Form, Select, Button, Radio, DatePicker, Space, Divider, Typography, Spin, Tag } from 'antd'
import { SyncOutlined, PlusOutlined, ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios'

export default class ReleaseApp extends Component {
    state = {
        value3: 'all',
        release_selectedRowKeys: [], // 表格选择项Keys
        release_selectedRows: [], // 表格选择项Rows
        release_tableData: [], // 表格相关
        release_total: 0, // 表格相关
        release_tableSpin: true, // 表格相关
    }

    onChange3 = e => {
        console.log('radio3 checked', e.target.value);
        this.setState({
            value3: e.target.value,
        });
    };

    /**
     * 表格
    */
    release_getColumns = () => {
        return [
            {
                title: '申请标题',
                dataIndex: 'title',
                width: 200,
            },
            {
                title: '应用',
                dataIndex: 'appname',
                width: 150
            },
            {
                title: '发布环境',
                dataIndex: 'environment',
                width: 150
            },
            {
                title: '版本',
                dataIndex: 'version'
            },
            {
                title: '状态',
                dataIndex: 'status',
                render: (text, record) => (record.status == 0 ? <Tag color="green">发布成功</Tag> : <Tag color="red">发布异常</Tag>)
            },
            {
                title: '申请人',
                dataIndex: 'applicant'
            },
            {
                title: '申请时间',
                dataIndex: 'datetime'
            }, {
                title: '操作',
                width: 220,
                render: (text, record) => (
                    <Space split={<Divider type='vertical' />}>
                        <Typography.Link onClick={() => this.editrelease_showModal(record.id, record.name, record.uuid, record.describe)}>查看</Typography.Link>
                        <Typography.Link onClick={() => this.onDeleteService(record.id)}>回滚</Typography.Link>
                        <Typography.Link>配置</Typography.Link>
                    </Space>
                )
            }
        ];
    }

    // 获取表格数据
    release_getData(pageNumber, pageSize) {
        let _this = this;
        _this.setState({
            release_tableSpin: true
        })
        axios.get(`http://localhost:5555/api/release_list/?pageSize=${pageSize}&pageNumber=${pageNumber}&sortName=id&sortOrder=desc&_=1595230808893`).then((resp) => {
            let ajaxData = [];
            for (let i = 0; i < resp.data.rows.length; i++) {
                ajaxData.push({
                    key: resp.data.rows[i].id,
                    id: resp.data.rows[i].id,
                    title: resp.data.rows[i].title,
                    appname: resp.data.rows[i].appname,
                    environment: resp.data.rows[i].environment,
                    version: resp.data.rows[i].version,
                    status: resp.data.rows[i].status,
                    datetime: resp.data.rows[i].datetime,
                    applicant: resp.data.rows[i].applicant,
                });
            }

            this.setState({
                release_tableData: ajaxData,
                release_total: resp.data.total,
                release_tableSpin: false
            })
        }, (err) => {
            _this.setState({
                release_tableSpin: false
            })
        });
    }

    release_onChange = (pageNumber, pageSize) => {
        this.release_pageNum = pageNumber;
        this.release_pageSize = pageSize;
        this.release_getData(pageNumber, pageSize);
    };

    release_onTableSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ release_selectedRowKeys: selectedRowKeys, release_selectedRows: selectedRows });
    };

    /**
     * 生命周期
     */
    componentDidMount() {
        this.release_getData(1, 5);
    }

    render() {
        const { value3, release_tableSpin } = this.state;

        return (
            <div>
                <Card>
                    <Form layout='horizontal'>
                        <Row gutter={24}>
                            <Col span={6}>
                                <Form.Item label='发布环境' name=''>
                                    <Select placeholder='请选择'>
                                        <Select.Option>线上环境</Select.Option>
                                        <Select.Option>线下环境</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label='应用名称' name=''>
                                    <Select placeholder='请选择'>
                                        <Select.Option>test</Select.Option>
                                        <Select.Option>订单服务</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label='申请时间' name=''>
                                    <DatePicker.RangePicker />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item style={{ textAlign: 'right' }}>
                                    <Button type='primary' icon={<SyncOutlined />}>刷新</Button>
                                </Form.Item></Col>
                        </Row>
                    </Form>

                    <div style={{ height: 20, clear: 'both' }}></div>

                    <Row>
                        <Col span={16}>
                            <Radio.Group
                                options={[
                                    { label: '全部', value: 'all' },
                                    { label: '待审核', value: 'toBeReviewed' },
                                    { label: '待发布', value: 'ToBeReleased' },
                                    { label: '发布成功', value: 'success' },
                                    { label: '发布异常', value: 'abnormal' },
                                    { label: '其它', value: 'other' },
                                ]}
                                onChange={this.onChange3}
                                value={value3}
                                optionType="button"
                            />
                        </Col>
                        <Col span={8} style={{ textAlign: 'right' }}>
                            <Space>
                                <Button type='primary' icon={<DeleteOutlined />}>批量删除</Button>
                                <Button type='primary' icon={<PlusOutlined />}>新建发布申请</Button>
                            </Space>
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
                                //rowSelection={release_rowSelection}
                                columns={this.release_getColumns()}
                                dataSource={this.state.release_tableData}
                                pagination={{
                                    current: this.release_pageNum,
                                    total: this.state.release_total,
                                    pageSizeOptions: [5, 10, 20, 50, 100],
                                    defaultPageSize: 5,
                                    showSizeChanger: true,
                                    showQuickJumper: true,
                                    showTotal: (release_total, range) => `共 ${release_total} 条`,
                                    onChange: this.release_onChange
                                }}
                                bordered
                            >
                                <Spin spinning={release_tableSpin} />
                            </Table>
                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}
