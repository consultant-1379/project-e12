import React, { Component } from 'react'

import { Icon, Card, Select, Input, Descriptions, DatePicker, Timeline, Button } from 'antd'

import moment from 'moment'
import Bar from './bar'
import Line from './line'
import './home.less'

import projectApi from '../../api/project'

const dateFormat = 'YYYY/MM/DD'
const { RangePicker } = DatePicker
const { Option } = Select

export default class Home extends Component {
    state = {
        projectName: '',
        projectURL: '',
        loading: false,
        chartType: true,
        projectList: []
    }

    getColorByVulnerabilities(vulnerabilities) {
        const minColor = [0, 0, 255]
        const maxColor = [255, 0, 0]

        const r = minColor[0] + (maxColor[0] - minColor[0]) * (vulnerabilities / 20)
        const g = minColor[1] + (maxColor[1] - minColor[1]) * (vulnerabilities / 20)
        const b = minColor[2] + (maxColor[2] - minColor[2]) * (vulnerabilities / 20)

        return `rgb(${r},${g},${b})`
    }

    componentDidMount () {
        projectApi.getProjectListWithPagination(0, 10000)
            .then((response) => {
                const latestData = response.content.reduce((latest, current) => {
                    const latestDate = new Date(latest.scanDate);
                    const currentDate = new Date(current.scanDate);

                    return latestDate > currentDate ? latest : current;
                });

                this.setState({
                    projectList: latestData
                })

                projectApi.getProjectListByProjectName(latestData.projectName)
                    .then((response) => {
                        this.setState({
                            projectListSide: response
                        })

                        const vulnerabilities = this.state.projectListSide.map((item, index) => {
                            const dependencies = item.vulnerabilities.dependencies
                            let count = 0

                            for(const dependency of dependencies) {
                                if(dependency.vulnerabilities) {
                                    count++
                                }
                            }

                            return {
                                index: index,
                                scanDate: item.scanDate.substring(0, 10),
                                vulnerabilities: count,
                                color: this.getColorByVulnerabilities(count)
                            }
                        })

                        this.setState({
                            vulnerabilities: vulnerabilities
                        })
                    })

                setTimeout(() => {
                    this.setState({
                        renderDelayedContent: true
                    })
                }, 50);
            })
    }

    startNewProject = () => {
        this.setState({ loading:true })
    }

    handleChange = (chartType) => {
        return () => this.setState({ chartType })
    }

    render() {
        const { projectName, projectURL, loading,  chartType, projectList, renderDelayedContent, vulnerabilities } = this.state

        const selectBefore = (
            <Select defaultValue="Http://" style={{ width: 90 }}>
                <Option value="Http://">Http://</Option>
                <Option value="Https://">Https://</Option>
            </Select>
        );

        const title = (
            <div className="home-menu">
                <span className={ chartType ? "home-menu-active home-menu-visited" : 'home-menu-visited' }
                      onClick={ this.handleChange(true) }>Bar Chart</span>
                <span className={ chartType ? "" : 'home-menu-active'} onClick={ this.handleChange(false) }>Line Chart</span>
            </div>
        )

        const extra = (
            <RangePicker
                defaultValue={ [moment('2023/01/01', dateFormat), moment('2023/10/01', dateFormat)] }
                format={ dateFormat }
            />
        )

        return (
            <div className='home'>
                <Card className="home-card" title="Start a New Project">
                    <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Input style={{ width: '25%' }}
                               placeholder='Project Name'
                               value= { projectName }/>
                        <Input style={{ width: '40%', margin: '0 15px' }}
                               addonBefore={ selectBefore }
                               placeholder='Repositories URL'
                               value= { projectURL }/>
                        <Button type='primary' loading={ loading } onClick={() => this.startNewProject()}>Submit</Button>
                    </span>
                </Card>

                <Card className="home-card" title="Last Analyzed Poject">
                    <Descriptions title="Project Information">
                        <Descriptions.Item label="Project name">{ projectList.projectName }</Descriptions.Item>
                        <Descriptions.Item label="Last scan date">{ projectList.scanDate }</Descriptions.Item>
                        <Descriptions.Item label="Number of scan">{ projectList.count }</Descriptions.Item>
                        <Descriptions.Item label="Dependency number">{ projectList.dependencyNum }</Descriptions.Item>
                        <Descriptions.Item label="Vulnerable Dependency number">{ projectList.vulnerableDependencies }</Descriptions.Item>
                    </Descriptions>
                </Card>

                <Card className="home-content" title={ title } extra={ extra }>
                    <Card
                        className="home-table-left"
                        title="Vulnerability trend over time"
                        bodyStyle={{ padding: 0, height: 275 }}
                        extra={ <Icon type="reload"/> }
                    >
                        {renderDelayedContent && (
                            chartType ? (
                                <Bar data={ 'Your Project Name' } />
                            ) : (
                                <Line data={ projectList.projectName } />
                            )
                        )}
                    </Card>

                    <Card title='History' extra={<Icon type="reload"/>} className="home-table-right">
                        <Timeline>
                            {renderDelayedContent && (
                                vulnerabilities.map(item => (
                                    <Timeline.Item key={item.index} color={item.color}>
                                        { item.scanDate + " Vulnerabilities: " + item.vulnerabilities }
                                    </Timeline.Item>
                                ))
                            )}
                        </Timeline>
                    </Card>
                </Card>
            </div>
        )
    }
}