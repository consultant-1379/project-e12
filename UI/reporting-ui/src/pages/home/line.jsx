import React, { Component } from 'react'
import { Chart, Geom, Axis, Legend, Tooltip } from "bizcharts"

import DataSet from "@antv/data-set"

import projectApi from "../../api/project"


export default class Line extends Component {
    state = {
        projectName:'',
        projectList:'',
        vulnerabilities: ''
    }

    componentDidMount () {
        projectApi.getProjectListByProjectName(this.props.data)
            .then((response) => {
                this.setState({
                    projectList: response
                })

                const vulnerabilities = this.state.projectList.map((item, index) => {
                    const dependencies = item.vulnerabilities.dependencies
                    let count = 0

                    for(const dependency of dependencies) {
                        if(dependency.vulnerabilities) {
                            count++
                        }
                    }

                    return {
                        index: item.scanDate.substring(0, 10),
                        scanDate: item.scanDate,
                        vulnerabilities: count
                    }
                })

                this.setState({
                    vulnerabilities: vulnerabilities
                })
            })
    }

    render() {
        const { vulnerabilities } = this.state

        const ds = new DataSet()
        const dv = ds.createView().source(Object.values(vulnerabilities))

        dv.transform({
            type: 'fold',
            fields: ['count'],
            key: 'scanDate',
            value: 'count',
        });

        return (
            <div style={{ width: '100%' }}>
                <Chart height={ 300 } data={ dv } forceFit>
                    <Legend />
                    <Axis name="scanDate" title={{ textStyle: { fontSize: 12 } }} />
                    <Axis name="count" title={{ textStyle: { fontSize: 12 } }} />
                    <Tooltip
                        crosshairs={{
                            type: "y"
                        }}
                    />
                    <Geom type="line" position="index*vulnerabilities" size={2} shape="smooth" />
                    <Geom
                        type="point"
                        position="index*vulnerabilities"
                        size={4}
                        shape="circle"
                        style={{
                            stroke: '#fff',
                            lineWidth: 1,
                        }}
                    />
                </Chart>
            </div>
        )
    }
}
