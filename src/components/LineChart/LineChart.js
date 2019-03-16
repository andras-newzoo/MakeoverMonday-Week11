import React, { Component } from 'react'
import './LineChart.css'

import { select } from 'd3-selection'

import { updateSvg, appendArea } from '../chartFunctions'

class LineChart extends Component {


  componentDidUpdate(prevProps){

    if(prevProps.width === 20000 ) {this.initVis()}
    else if (prevProps.width !== this.props.width) {}

  }

  initVis(){

    const svg = select(this.node),
          { height, width, margin, chartClass} = this.props,
          { data } = this.props,
          { chartWidth, chartHeight } = updateSvg( svg, height, width, margin )

    appendArea( svg, `${chartClass}-chart-area`, margin.left, margin.top)

    this.chartArea = select(`.${chartClass}-chart-area`)



  }


  render(){
    return (
      <svg ref={node => this.node = node}/>
    )
  }

}

LineChart.defaultProps = {
  margin: {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  },
  transition: {
    long: 1000,
    short: 300,
  }
}

export default LineChart
