import React, { Component } from 'react'

import './thirdParty.less'
import {Button, Card, Table} from "antd";

export default class ThirdParty extends Component {
    state = {
        total: 0,
        size: 6,
        projectList: [],
        loading: false
    }

    initColumns = () => {
        this.columns = [
            {
                title: 'Project name',
                dataIndex: 'name',
            },
            {
                title: 'tbd',
                dataIndex: 'b',
            },
            {
                title: 'tbd',
                dataIndex: 'c',
            },
            {
                width: 100,
                align: 'center',
                title: 'Detail',
                render: (project) => {
                    return (
                        <span>
                            <Button type="primary" onClick={() => this.props.history.push('/project/detail', { project })}>Detail</Button>
                        </span>
                    )
                }
            },
        ];
    }

    getProjectList = async (pageNum) => {
        // let result
        this.pageNum = pageNum
        this.setState({ loading: true })

        // result = await getProjectList(pageNum, this.state.size)

        const list = [{
            _id: 0,
            name: 1,
            b: 2,
            c: 3
        }, {
            _id: 1,
            name: 4,
            b: 5,
            c: 6
        }, {
            _id: 2,
            name: 4,
            b: 5,
            c: 6
        }, {
            _id: 3,
            name: 4,
            b: 5,
            c: 6
        }, {
            _id: 4,
            name: 4,
            b: 5,
            c: 6
        }, {
            _id: 5,
            name: 4,
            b: 5,
            c: 6
        }]

        this.setState({
            total: 4,
            projectList: list
        })

        this.setState({ loading: false })
        // if (result.status === 0) {
        //     const {total, list} = result.data
        //     this.setState({
        //         total,
        //         products: list
        //     })
        // }
    }

    constructor(props) {
        super(props);

        this.initColumns()
    }

    componentDidMount () {
        this.getProjectList(1)
    }

    render() {
        const { projectList, total, size, loading } = this.state

        return (
            <Card>
                <Table
                    bordered
                    rowKey='_id'
                    loading={ loading }
                    dataSource={ projectList }
                    columns={ this.columns }
                    pagination={{
                        current: 0,
                        total,
                        defaultPageSize: size,
                        showQuickJumper: true,
                        onChange: this.getProjectList
                    }}
                />
            </Card>
        )
    }
}