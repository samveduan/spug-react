import React, { Component } from 'react'
import { Card, Form, Input, Select, Button, Tag, Space, Divider, Typography } from 'antd'
import { Modal, Table } from 'antd';
import { PlusOutlined, ThunderboltOutlined, SyncOutlined } from '@ant-design/icons';
import ACEditor from '../../components/ACEditor';
import axios from 'axios'

export default class config extends Component {
    state = {
        body: 'df -kdf -k', // 初始化ace编辑器内容
        tagsArr: [
            {
                id: 1,
                name: 'Tag1'
            },
            {
                id: 2,
                name: 'Tag2'
            },
            {
                id: 3,
                name: 'Tag3'
            }
        ],
        chooseTask_Visible: false, // 主机选择执行模板modal
        chooseTask_selectedRowKeys: [], // 主机表格选择项Keys
        chooseTask_selectedRows: [], // 主机表格选择项Rows
        chooseTask_tableData: [], // 主机表格相关
        chooseTask_total: 0, // 主机表格相关
        chooseTemplate_Visible: false, // 模板选择执行模板modal
        chooseTemplate_selectedRowKeys: [], // 模板表格选择项Keys
        chooseTemplate_selectedRows: [], // 模板表格选择项Rows
        chooseTemplate_tableData: [], // 模板表格相关
        chooseTemplate_total: 0 // 模板表格相关
    }

    /**
     * 创建主机
    */
    chooseTask_ShowModal = () => {
        this.setState({
            chooseTask_Visible: true,
        }, function () {
            this.chooseTask_getData(1, 5);
        });
    }

    chooseTask_FormRef = React.createRef(); // 定义一个表单

    chooseTask_HandleOk = e => {
        this.chooseTask_FormRef.current.validateFields()
            .then(values => {
                this.chooseTask_FormRef.current.resetFields();
                this.setState({
                    chooseTask_Visible: false
                });
                console.log("表单值：");
                console.log(values);
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    }

    chooseTask_HandleCancel = e => {
        this.chooseTask_FormRef.current.resetFields();
        this.setState({
            chooseTask_Visible: false
        })
    }

    chooseTask_HandleAfterClose = () => {
        console.log("modal 关闭了！");
    }

    /**
     * 表格
    */
    chooseTask_getColumns = () => {
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
    chooseTask_getData(pageNumber, pageSize) {
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
                chooseTask_tableData: ajaxData,
                chooseTask_total: resp.data.total
            })
        }, (err) => {
            console.log(err);
        });
    }

    chooseTask_onChange = (pageNumber, pageSize) => {
        this.chooseTask_pageNum = pageNumber;
        this.chooseTask_pageSize = pageSize;
        this.chooseTask_getData(pageNumber, pageSize);
    };

    chooseTask_onTableSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ chooseTask_selectedRowKeys: selectedRowKeys, chooseTask_selectedRows: selectedRows });
    };

    /**
     * 创建模板
    */
    chooseTemplate_ShowModal = () => {
        this.setState({
            chooseTemplate_Visible: true,
        }, function () {
            this.chooseTemplate_getData(1, 5);
        });
    }

    chooseTemplate_FormRef = React.createRef(); // 定义一个表单

    chooseTemplate_HandleOk = e => {
        this.chooseTemplate_FormRef.current.validateFields()
            .then(values => {
                this.chooseTemplate_FormRef.current.resetFields();
                this.setState({
                    chooseTemplate_Visible: false
                });
                console.log("表单值：");
                console.log(values);
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    }

    chooseTemplate_HandleCancel = e => {
        this.chooseTemplate_FormRef.current.resetFields();
        this.setState({
            chooseTemplate_Visible: false
        })
    }

    chooseTemplate_HandleAfterClose = () => {
        console.log("modal 关闭了！");
    }

    /**
     * 表格
    */
    chooseTemplate_getColumns = () => {
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
    chooseTemplate_getData(pageNumber, pageSize) {
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
                chooseTemplate_tableData: ajaxData,
                chooseTemplate_total: resp.data.total
            })
        }, (err) => {
            console.log(err);
        });
    }

    chooseTemplate_onChange = (pageNumber, pageSize) => {
        this.chooseTemplate_pageNum = pageNumber;
        this.chooseTemplate_pageSize = pageSize;
        this.chooseTemplate_getData(pageNumber, pageSize);
    };

    chooseTemplate_onTableSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ chooseTemplate_selectedRowKeys: selectedRowKeys, chooseTemplate_selectedRows: selectedRows });
    };

    handleSubmit = () => {
        console.log(this.state.tagsArr);
    }

    /**
     * 执行所有
     */
    onAllFinish = () => {
        alert('执行所有！');
    }

    render() {
        const { body, tagsArr } = this.state;

        // 控制主机表格选择
        const chooseTask_rowSelection = {
            selectedRowKeys: this.state.chooseTask_selectedRowKeys,
            onChange: this.chooseTask_onTableSelectChange
        };

        // 控制模板表格选择
        const chooseTemplate_rowSelection = {
            selectedRowKeys: this.state.chooseTemplate_selectedRowKeys,
            onChange: this.chooseTemplate_onTableSelectChange
        };

        return (
            <>
                <Card>
                    <Form layout='vertical' onFinish={this.onAllFinish}>
                        <Form.Item label='执行主机'>
                            {
                                tagsArr.map(item => <Tag
                                    closable
                                    color="#108ee9"
                                    key={item.id}
                                    onClose={() => this.setState({ tagsArr: tagsArr.filter(x => x.id !== item.id) })}
                                >{item.name}</Tag>)
                            }
                        </Form.Item>
                        <Form.Item label=''>
                            <Button icon={<PlusOutlined />} onClick={() => this.chooseTask_ShowModal()}>从主机列表中选择</Button>
                        </Form.Item>
                        <Form.Item label='执行命令'>
                            <ACEditor mode="sh" value={body} height="300px" onChange={body => this.setState({ body })} />
                        </Form.Item>
                        <Form.Item>
                            <Button icon={<PlusOutlined />} onClick={() => this.chooseTemplate_ShowModal()}>从执行模板中选择</Button>
                        </Form.Item>
                        <Button type='primary' htmlType="submit" icon={<ThunderboltOutlined />}>开始执行</Button>
                    </Form>
                </Card>

                <Modal
                    title="选择执行主机"
                    visible={this.state.chooseTask_Visible}
                    width={1000}
                    onOk={this.chooseTask_HandleOk}
                    onCancel={this.chooseTask_HandleCancel}
                    okText="确认"
                    cancelText="取消"
                    afterClose={this.chooseTask_HandleAfterClose}
                    maskClosable={false}
                    destroyOnClose={true}
                >
                    <Form layout='inline' ref={this.chooseTask_FormRef} style={{marginBottom: 20}}>
                        <Form.Item
                            label='主机类别'
                            name="type"
                            style={{ width: '30%' }}
                        >
                            <Select style={{ width: '100%' }} placeholder="请选择" allowClear>
                                <Select.Option value="web">web服务</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label='主机别名'
                            name="name"
                            style={{ width: '40%' }}
                        >
                            <Input placeholder="请输入" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" icon={<SyncOutlined />}>
                                刷新
                                </Button>
                        </Form.Item>
                    </Form>

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
                        rowSelection={chooseTask_rowSelection}
                        columns={this.chooseTask_getColumns()}
                        dataSource={this.state.chooseTask_tableData}
                        pagination={{
                            current: this.chooseTask_pageNum,
                            total: this.state.chooseTask_total,
                            pageSizeOptions: [5, 10, 20, 50, 100],
                            defaultPageSize: 5,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (chooseTask_total, range) => `共 ${chooseTask_total} 条`,
                            onChange: this.chooseTask_onChange
                        }}
                        bordered
                    >
                    </Table>
                </Modal>

                <Modal
                    title="选择执行模板"
                    visible={this.state.chooseTemplate_Visible}
                    width={1000}
                    onOk={this.chooseTemplate_HandleOk}
                    onCancel={this.chooseTemplate_HandleCancel}
                    okText="确认"
                    cancelText="取消"
                    afterClose={this.chooseTemplate_HandleAfterClose}
                    maskClosable={false}
                    destroyOnClose={true}
                >
                    <Form layout='inline' ref={this.chooseTemplate_FormRef} style={{marginBottom: 20}}>
                        <Form.Item
                            label='主机类别'
                            name="type"
                            style={{ width: '30%' }}
                        >
                            <Select style={{ width: '100%' }} placeholder="请选择" allowClear>
                                <Select.Option value="web">web服务</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label='主机别名'
                            name="name"
                            style={{ width: '40%' }}
                        >
                            <Input placeholder="请输入" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" icon={<SyncOutlined />}>
                                刷新
                                </Button>
                        </Form.Item>
                    </Form>

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
                        rowSelection={chooseTemplate_rowSelection}
                        columns={this.chooseTemplate_getColumns()}
                        dataSource={this.state.chooseTemplate_tableData}
                        pagination={{
                            current: this.chooseTemplate_pageNum,
                            total: this.state.chooseTemplate_total,
                            pageSizeOptions: [5, 10, 20, 50, 100],
                            defaultPageSize: 5,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (chooseTemplate_total, range) => `共 ${chooseTemplate_total} 条`,
                            onChange: this.chooseTemplate_onChange
                        }}
                        bordered
                    >
                    </Table>
                </Modal>
            </>
        )
    }
}
