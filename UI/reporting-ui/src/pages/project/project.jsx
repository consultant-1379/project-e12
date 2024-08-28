import React, { Component } from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'

import ProjectHome from './home'
import ProjectDetail from './detail'

import './project.less'

export default class Project extends Component {
    render() {
        return (
            <Switch>
                <Route path='/project' component={ ProjectHome } exact/>
                <Route path='/project/detail' component={ ProjectDetail }/>
                <Redirect to='/project'/>
            </Switch>
        )
    }
}