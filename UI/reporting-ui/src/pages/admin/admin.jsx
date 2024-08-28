import React, { Component } from 'react'
import { Redirect, Route, Switch } from "react-router-dom"

import Header from '../../components/header'
import LeftNav from '../../components/left-nav'

import Home from '../home/home'
import Project from '../project/project'
import Search from "../search/search"
// import Product from '../product/product'
// import ThirdParty from '../thirdParty/thirdParty'

import { Layout } from 'antd'
const { Footer, Sider, Content } = Layout

export default class Admin extends Component {
    render () {
        return (
            <Layout style={{minHeight: '100%'}}>
                <Sider>
                    <LeftNav/>
                </Sider>

                <Layout>
                    <Header>Header</Header>
                    <Content style={{margin: '20px 20px 0 20px', backgroundColor: '#fff'}}>
                        <Switch>
                            <Redirect from='/' exact to='/home'/>
                            <Route path='/home' component={ Home }/>
                            <Route path='/project' component={ Project }/>
                            <Route path='/search' component={ Search }/>
                            {/*<Route path='/product' component={ Product }/>*/}
                            {/*<Route path='/thirdParty' component={ ThirdParty }/>*/}
                        </Switch>
                    </Content>
                    <Footer style={{textAlign: 'center', color: '#969696'}}>Welcome to Vulnerability Report</Footer>
                </Layout>
            </Layout>
        )
    }
}