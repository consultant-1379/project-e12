import React, { Component } from 'react'
import { Chart, Geom, Axis, Tooltip } from "bizcharts"

import projectApi from "../../api/project"

export default class Bar extends Component {
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
              scanDate: item.scanDate.substring(0, 10),
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

    return (
      <div style={{ width: '100%',marginLeft: -30 }}>
        <Chart height={ 340 } data={ vulnerabilities } forceFit>
          <Axis name="count"/>
          <Axis name="date"/>
          <Tooltip
              crosshairs={{
                type: "y"
              }}
          />
          <Geom type="interval" position="scanDate*vulnerabilities" size={ 15 }/>
        </Chart>
      </div>
    )
  }
}