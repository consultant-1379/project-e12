import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import { formatDate } from '../../utils/dateUtils'
import menuList from '../../config/menuConfig'

import './index.less'

class Header extends Component {
    state = {
        currentTime: formatDate(Date.now())
    }

    getTime = () => {
        this.intervalId = setInterval(() => {
            const currentTime = formatDate(Date.now())
            this.setState({currentTime})
        }, 1000)
    }

    getTitle = () => {
        const path = this.props.location.pathname
        let title

        menuList.forEach(item => {
            if(item.key === path) {
                title = item.title
            }else if (item.children) {
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)

                if(cItem) {
                    title = cItem.title
                }
            }
        })

        return title
    }

    componentDidMount () {
        this.getTime()
    }

    componentWillUnmount () {
        clearInterval(this.intervalId)
    }

    render() {
        const { currentTime } = this.state
        const title = this.getTitle()

        return (
            <div className="header">
                <div className="header-top">
                    <span>Welcome to Vulnerability Report</span>
                </div>

                <div className="header-bottom">
                    <div className="header-bottom-left">{ title }</div>
                    <div className="header-bottom-right">{ currentTime }</div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)