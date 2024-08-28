import React, { Component } from 'react'
import { Card, Table, Button } from 'antd'

import projectApi from '../../api/project'

export default class ProjectHome extends Component {
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
                dataIndex: 'projectName',
            },
            {
                width: '15%',
                align: 'center',
                title: 'Last scan date',
                dataIndex: 'scanDate',
            },
            {
                width: '20%',
                align: 'center',
                title: 'Vulnerable Dependencies',
                dataIndex: 'vulnerableDependencies',
            },
            {
                width: '17%',
                align: 'center',
                title: 'Dependencies number',
                dataIndex: 'dependencyNum',
            },
            {
                width: '15%',
                align: 'center',
                title: 'Number of scans',
                dataIndex: 'count',
            },
            {
                width: '10%',
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

    getProjectList = (pageNum) => {
        this.setState({ loading: true })

        projectApi.getProjectListWithPagination(pageNum - 1, this.state.size)
            .then((response) => {
                this.setState({
                    total: response.totalElements,
                    projectList: response.content
                })
            })

        this.setState({ loading: false })
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
                    rowKey='projectName'
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