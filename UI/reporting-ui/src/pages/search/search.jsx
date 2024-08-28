import React, { Component } from 'react'
import { Card, Select, Input, Button, Table } from 'antd'
import { v4 as uuidv4 } from 'uuid'

import projectApi from "../../api/project"

const Option = Select.Option

export default class Search extends Component {
    state = {
        total: 0,
        size: 6,
        projectList: [],
        searchType: 'All',
        searchKeyword: '',
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
                title: 'Scan date',
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
                render: (project) => {
                    const vendorEvidence = project.vulnerabilities.dependencies
                    const evidenceCount = vendorEvidence.length

                    return (
                        <span>
                           { evidenceCount }
                        </span>
                    )
                }
            },
            {
                width: '15%',
                align: 'center',
                title: 'Severity',
                dataIndex: 'level'
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

        let projectName

        if(this.state.searchKeyword === '') {
            projectName = 'empty project search'
        }else {
            projectName = this.state.searchKeyword
        }

        projectApi.searchProjectByLevelAndProjectName(this.state.searchType, projectName)
            .then((response) => {
                this.setState({
                    projectList: response
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
        const { projectList, total, size, searchType, searchKeyword, loading } = this.state

        const title = (
            <span>
                <Select
                    style={{ width: '15%' }}
                    value= { searchType }
                    onChange={ value => this.setState({ searchType:value }) }
                >
                    <Option value='All'>All</Option>
                    <Option value='Critical'>Critical</Option>
                    <Option value='High'>High or above</Option>
                    <Option value='Medium'>Medium or above</Option>
                    <Option value='Low'>Low or above</Option>
                    <Option value='None'>None</Option>
                </Select>

                <Input
                    placeholder='project name'
                    style={{ width: '30%', margin: '0 15px' }}
                    value={ searchKeyword }
                    onChange={ event => this.setState({ searchKeyword:event.target.value }) }
                />

                <Button type='primary' onClick={() => this.getProjectList(1)}>Search</Button>
            </span>
        )

        return (
            <Card title={ title }>
                <Table
                    bordered
                    rowKey={() => uuidv4()}
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