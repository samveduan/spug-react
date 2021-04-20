import React, { Component } from 'react'
import { Layout } from 'antd'
import { Route, Redirect, Switch } from 'react-router-dom'
import LeftNav from '../../components/left-nav/left-nav'
import Header from '../../components/header/header'
import ReleaseApp from '../app-release/release-app'
import Plan from '../plan/plan'
import ServiceConfig from '../config/service-config'
import AppConfig from '../config/app-config'
import Monitor from '../monitor/monitor'
import Question from '../question/question'
import Analysis from '../home/analysis'
import StandardList from '../home/standard-list'
import Workbench from '../home/workbench'
import Host from '../host/host'
import Task from '../exec/task'
import Config from '../system-manage/config'
import './admin.less'

const { Content, Sider } = Layout;

export default class Admin extends Component {
    state = {
        collapsed: false
    };

    // 控制菜单左右缩放
    onCollapse = collapsed => {
        this.setState({ collapsed });
    };

    render() {
        return (
            <Layout style={{ height: '100%' }}>
                <Header/>
                <Layout style={{ height: '100%' }}>
                    <Sider width={200} style={{ background: '#000000' }} collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                        <LeftNav/>
                    </Sider>
                    <Layout className="site-layout" style={{ paddingTop: 64 }}>
                        <Content
                            className="main-content"
                            style={{ overflowX: 'hidden' }}
                        >
                            <Switch>
                                <Route path="/workbench" component={Workbench}/>
                                <Route path="/host" component={Host}/>
                                <Route path="/release-app" component={ReleaseApp}/>
                                <Route path="/plan" component={Plan}/>
                                <Route path="/service-config" component={ServiceConfig}/>
                                <Route path="/app-config" component={AppConfig}/>
                                <Route path="/monitor" component={Monitor}/>
                                <Route path="/question" component={Question}/>
                                <Route path="/analysis" component={Analysis}/>
                                <Route path="/standardlist" component={StandardList}/>
                                <Route path="/config" component={Config}/>
                                <Route path="/task" component={Task}/>
                                <Redirect to="/monitor"/>
                            </Switch>
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        )
    }
}