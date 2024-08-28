import React, { PureComponent } from 'react'

import { Card, Table, Collapse } from "antd";
import Line from './line'
import { v4 as uuidv4 } from 'uuid'

import projectApi from '../../api/project'

const { Panel } = Collapse

export default class Detail extends PureComponent {
    state = {
        projectList: [],
        loading: false
    }

    initColumns = () => {
        this.columns = [
            {
                width: '25%',
                align: 'center',
                title: 'Dependency',
                dataIndex: 'fileName',
            },
            {
                width: '25%',
                align: 'center',
                title: 'Description',
                dataIndex: 'description',
            },
            {
                width: '17%',
                align: 'center',
                title: 'Confidence',
                render: (project) => {
                    const vulnerabilityIds = project.vulnerabilityIds

                    if(vulnerabilityIds && vulnerabilityIds.length > 0) {
                        return (
                            <span>
                                { vulnerabilityIds[0].confidence }
                            </span>
                        );
                    }else {
                        return (
                            <span></span>
                        );
                    }
                }
            },
            {
                width: '15%',
                align: 'center',
                title: 'Evidence',
                render: (project) => {
                    const vendorEvidence = project.evidenceCollected.vendorEvidence
                    const productEvidence = project.evidenceCollected.productEvidence
                    const versionEvidence = project.evidenceCollected.versionEvidence
                    const evidenceCount = vendorEvidence.length + productEvidence.length + versionEvidence.length

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
                render: (project) => {
                    const vulnerabilities = project.vulnerabilities

                    if(vulnerabilities && vulnerabilities.length > 0) {
                        return (
                            <span>
                                { vulnerabilities[0].severity }
                            </span>
                        );
                    }else {
                        return (
                            <span>None</span>
                        );
                    }
                }
            },
        ];
    }

    constructor(props) {
        super(props);

        this.initColumns()
    }

    componentDidMount () {
        const { projectName } = this.props.location.state.project

        this.setState({ loading: true })

        projectApi.getProjectListByProjectName(projectName)
            .then((response) => {
                this.setState({
                    projectList: response
                })
            })

        this.setState({ loading: false })
    }

    render() {
        const { projectList, loading } = this.state

        const panelItems = projectList.map((item, index) => (
            <Panel header={
                <div>
                    Project name: { item.projectName }
                    <br />
                    Project scan time: { item.scanDate }
                </div>
            } key={ index + 1 }>
                <Table
                    bordered
                    rowKey={() => uuidv4()}
                    loading={ loading }
                    dataSource={ item.vulnerabilities.dependencies }
                    columns={ this.columns }
                    pagination={{
                        defaultPageSize: 5,
                        showQuickJumper: true
                    }}
                />
            </Panel>
        ));

        return (
            <div className='detail'>
                <Card>
                    <Collapse accordion defaultActiveKey={['1']}>
                        { panelItems }
                    </Collapse>
                    <Line data={ this.props.location.state.project }/>
                </Card>
            </div>
        )
    }
}