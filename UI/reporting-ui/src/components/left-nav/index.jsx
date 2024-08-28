import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'

import { Menu, Icon } from 'antd'

import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
import './index.less'

const SubMenu = Menu.SubMenu;

class LeftNav extends Component {
    getMenuNodes = (menuList) => {
        const path = this.props.location.pathname

        return menuList.reduce((pre, item) => {
            if(!item.children) {
                pre.push((
                    <Menu.Item key={ item.key }>
                        <Link to={ item.key }>
                            <Icon type={ item.icon }/>
                            <span>{ item.name }</span>
                        </Link>
                    </Menu.Item>
                ))
            } else {
                const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)

                if(cItem) {
                    this.openKey = item.key
                }

                pre.push((
                    <SubMenu
                        key={item.key}
                        title={
                            <span>
                                <Icon type={ item.icon }/>
                                <span>{ item.name }</span>
                            </span>
                        }
                    >
                        { this.getMenuNodes(item.children) }
                    </SubMenu>
                ))
            }

            return pre
        }, [])
    }

    constructor(props) {
        super(props);

        this.menuNodes = this.getMenuNodes(menuList)
    }

    render() {
        let path = this.props.location.pathname

        if(path.indexOf('/project')===0) {
            path = '/project'
        }

        const openKey = this.openKey

        return (
            <div className="left-nav">
                <Link to='/' className="left-nav-header">
                    <img src={ logo } alt="logo"/>
                    <h1>report</h1>
                </Link>

                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                >
                    {this.menuNodes}
                </Menu>
            </div>
        )
    }
}

export default withRouter(LeftNav)