import React, { Component } from 'react'
import './LineChart.css'

import { select } from 'd3-selection'
import { nest } from 'd3-collection'
import { line } from 'd3-shape'
import { scaleTime, scaleLinear } from 'd3-scale'
import { extent, max } from 'd3-array'

import { updateSvg, appendArea } from '../chartFunctions'

class LineChart extends Component {


  componentDidUpdate(prevProps){

    if(prevProps.width === 20000 ) {this.initVis()}
    else if (prevProps.width !== this.props.width) {}

  }

  initVis(){

    const svg = select(this.node),
          { height, width, margin, chartClass} = this.props,
          { data, xKey, yKey } = this.props,
          { chartWidth, chartHeight } = updateSvg( svg, height, width, margin )

    appendArea( svg, `${chartClass}-chart-area`, margin.left, margin.top)

    this.chartArea = select(`.${chartClass}-chart-area`)
    this.xScale = scaleTime().range([0, chartWidth]).domain(extent(data, d => d[xKey]))
    this.yScale = scaleLinear().range([chartHeight, 0]).domain([0, max(data, d => d[yKey])])

    const lineData = nest()
              .key( d => d.zip)
              .entries(data),
          linePath = line()
              .x(d => this.xScale(d[xKey]) )
              .y(d => this.yScale(d[yKey]) )

    const paths = this.chartArea.selectAll('.line-path').data(lineData)

          paths.exit().remove()

          paths.enter()
              .append('path')
              .attr('class', 'line-path')
              .attr("fill", "none")
              .attr("stroke", "steelblue")
              .attr("stroke-width", 1.5)
              .attr("stroke-linejoin", "round")
              .attr("stroke-linecap", "round")
              .style("mix-blend-mode", "multiply")
              .attr('d', d => linePath(d.values))


    console.log(lineData)

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
