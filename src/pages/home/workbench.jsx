import React, { Component, useState } from 'react'
import { Row, Col, Card, Table, Avatar, Typography, Progress, Button, Input, Select, List, Tabs, DatePicker } from 'antd'
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios'
import store from '../../store'
import { sendAction } from '../../action'
import ReactEcharts from 'echarts-for-react'
import './workbench.less'

const { TabPane } = Tabs;
const { Title, Paragraph, Text, Link } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

export default class Workbench extends Component {
    state = {
        noTitleKey: 'app',
        createHostVisible: false,
    }

    callback = key => {
        console.log(key);
    }

    getOption = () => {
        return {
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                smooth: true
            }]
        };
    }

    getBarChartOption = () => {
        return {
            title: {
                text: '',
                subtext: '',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                left: 'center',
                top: 'bottom',
                data: ['rose1', 'rose2', 'rose3', 'rose4', 'rose5', 'rose6', 'rose7', 'rose8']
            },
            toolbox: {
                show: true,
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            series: [
                {
                    name: '半径模式',
                    type: 'pie',
                    radius: [20, 140],
                    center: ['25%', '50%'],
                    roseType: 'radius',
                    itemStyle: {
                        borderRadius: 5
                    },
                    label: {
                        show: false
                    },
                    emphasis: {
                        label: {
                            show: true
                        }
                    },
                    data: [
                        { value: 40, name: 'rose 1' },
                        { value: 33, name: 'rose 2' },
                        { value: 28, name: 'rose 3' },
                        { value: 22, name: 'rose 4' },
                        { value: 20, name: 'rose 5' },
                        { value: 15, name: 'rose 6' },
                        { value: 12, name: 'rose 7' },
                        { value: 10, name: 'rose 8' }
                    ]
                },
                {
                    name: '面积模式',
                    type: 'pie',
                    radius: [20, 140],
                    center: ['75%', '50%'],
                    roseType: 'area',
                    itemStyle: {
                        borderRadius: 5
                    },
                    data: [
                        { value: 30, name: 'rose 1' },
                        { value: 28, name: 'rose 2' },
                        { value: 26, name: 'rose 3' },
                        { value: 24, name: 'rose 4' },
                        { value: 22, name: 'rose 5' },
                        { value: 20, name: 'rose 6' },
                        { value: 18, name: 'rose 7' },
                        { value: 16, name: 'rose 8' }
                    ]
                }
            ]
        };
    }

    getForecastChartOption = () => {
        return {
            grid: {
                x: 30,
                y: 10,
                x2: 0,
                y2: 20
            },
            xAxis: {
                type: 'category',
                boundaryGap: false
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '30%']
            },
            visualMap: {
                type: 'piecewise',
                show: false,
                dimension: 0,
                seriesIndex: 0,
                pieces: [{
                    gt: 1,
                    lt: 3,
                    color: 'rgba(0, 180, 0, 0.5)'
                }, {
                    gt: 5,
                    lt: 7,
                    color: 'rgba(0, 180, 0, 0.5)'
                }]
            },
            series: [
                {
                    type: 'line',
                    smooth: 0.6,
                    symbol: 'none',
                    lineStyle: {
                        color: 'green',
                        width: 5
                    },
                    markLine: {
                        symbol: ['none', 'none'],
                        label: { show: false },
                        data: [
                            { xAxis: 1 },
                            { xAxis: 3 },
                            { xAxis: 5 },
                            { xAxis: 7 }
                        ]
                    },
                    areaStyle: {},
                    data: [
                        ['2019-10-10', 200],
                        ['2019-10-11', 400],
                        ['2019-10-12', 650],
                        ['2019-10-13', 500],
                        ['2019-10-14', 250],
                        ['2019-10-15', 300],
                        ['2019-10-16', 450],
                        ['2019-10-17', 300],
                        ['2019-10-18', 100]
                    ]
                }
            ]
        };
    }

    render() {
        const select = <Select style={{ width: 200 }} placeholder="过滤监控项，默认所有">
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="Yiminghe">yiminghe</Option>
        </Select>

        const data = [
            'Racing car sprays burning fuel into crowd.',
            'Japanese princess to wed commoner.',
            'Australian walks 100km after outback crash.',
            'Man charged over missing wedding girl.',
            'Los Angeles battles huge wildfires.',
        ];

        const tabListNoTitle = [
            {
                key: 'article',
                tab: '今日',
            },
            {
                key: 'app',
                tab: '本周',
            },
            {
                key: 'project',
                tab: '本月',
            },
        ];

        const contentListNoTitle = {
            article: <ReactEcharts option={this.getBarChartOption()}></ReactEcharts>,
            app: <ReactEcharts option={this.getForecastChartOption()}></ReactEcharts>,
            project: <ReactEcharts option={this.getBarChartOption()}></ReactEcharts>,
        };

        const operations = <Button>Extra Action</Button>;

        return (<>
            <Row gutter={16}>
                <Col span={6}>
                    <Card title="应用">
                        <Title level={2}><Text className='blue'>7</Text><Text className='noramlWord'>个</Text></Title>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card title="主机">
                        <Title level={2}><Text className='blue'>7</Text><Text className='noramlWord'>个</Text></Title>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card title="任务">
                        <Title level={2}><Text className='blue'>7</Text><Text className='noramlWord'>个</Text></Title>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card title="监控">
                        <Title level={2}><Text className='blue'>7</Text><Text className='noramlWord'>个</Text></Title>
                    </Card>
                </Col>
            </Row>

            <div style={{ height: 16, clear: 'both' }}></div>

            <Row>
                <Card title="报警趋势" style={{ width: '100%' }} extra={select}>
                    <ReactEcharts option={this.getOption()}></ReactEcharts>
                </Card>
            </Row>

            <div style={{ height: 16, clear: 'both' }}></div>

            <Row gutter={16}>
                <Col span={16} tabList={tabListNoTitle}>
                    <Card>
                        <Tabs defaultActiveKey="1" tabBarExtraContent={<RangePicker defaultValue={[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]}
                            format={dateFormat} />}>
                            <TabPane tab="今日" key="1">
                                <ReactEcharts option={this.getForecastChartOption()}></ReactEcharts>
                            </TabPane>
                            <TabPane tab="本周" key="2">
                                <ReactEcharts option={this.getBarChartOption()}></ReactEcharts>
                            </TabPane>
                            <TabPane tab="本月" key="3">
                                <ReactEcharts option={this.getForecastChartOption()}></ReactEcharts>
                            </TabPane>
                        </Tabs>
                    </Card>
                </Col>

                <Col span={8}>
                    <Card title="最近30天登录" style={{ width: '100%' }}>
                        <List
                            dataSource={data}
                            renderItem={item => (
                                <List.Item>
                                    <Typography.Text mark>[ITEM]</Typography.Text> {item}
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </>)
    }
}
