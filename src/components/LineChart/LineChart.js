import React, { Component } from 'react'
import './LineChart.css'

import { select } from 'd3-selection'
import { nest } from 'd3-collection'
import { line } from 'd3-shape'
import { scaleTime, scaleLinear, scaleBand } from 'd3-scale'
import { axisBottom, axisLeft, axisTop } from 'd3-axis'
import { format} from 'd3-format'
import { extent, max } from 'd3-array'
import { voronoi } from 'd3-voronoi'

import { updateSvg, appendArea } from '../chartFunctions'
import { createUpdateGridlines, createUpdateAxes } from './functionsLineChart'

import * as chroma from 'chroma-js'

class LineChart extends Component {


  handleMouseoverLine = d => {
    this.props.handleMouseoverLine(d)
  }

  handleMouseoutLine = d => {
    this.props.handleMouseoutLine(d)
  }

  handleClickLine = d => {
    this.props.handleClickLine(d)
  }

  componentDidUpdate(prevProps){

    if(prevProps.width === 20000 ) {this.initVis()}
    else if (prevProps.width !== this.props.width) {}

    if(prevProps.highlightHover !== this.props.highlightHover || prevProps.highlight !== this.props.highlight){
      this.updateData()
    }

  }

  initVis(){

    const svg = select(this.node),
          { height, width, margin, chartClass} = this.props,
          { data, dataTotal, xKey, yKey, highlight, highlightHover, colorArray} = this.props,
          { chartWidth, chartHeight } = updateSvg( svg, height, width, margin ),
          yearArray = [...new Set(data.map(d => d.year))],
          colorScale = chroma.scale(colorArray.reverse()).domain(extent(dataTotal, d => d.total))

    appendArea( svg, `${chartClass}-chart-area`, margin.left, margin.top)
    appendArea( svg, `${chartClass}-y-axis y-axis`, margin.left, margin.top)
    appendArea( svg, `${chartClass}-x-axis x-axis`, margin.left, margin.top + chartHeight)

    this.chartArea = select(`.${chartClass}-chart-area`)

    this.xScale = scaleTime().range([0, chartWidth]).domain(extent(data, d => d[xKey]))
    this.yScale = scaleLinear().range([chartHeight, 0]).domain([-10, max(data, d => d[yKey])*1.1])
    this.axisScale = scaleBand().range([0, chartWidth]).domain(yearArray)

    this.xAxis = svg.select(`.${chartClass}-x-axis`)
    this.yAxis = svg.select(`.${chartClass}-y-axis`)

    this.yAxisCall = axisLeft(this.yScale).tickSizeOuter(0).tickSizeInner(5).tickFormat(format('.1s')).ticks(chartHeight/100)
    this.xAxisCall = axisBottom(this.axisScale).tickSizeInner(5).tickSizeOuter(0).tickFormat(format('d'))
    this.gridlineOneCall = axisTop(this.xScale).tickSize(chartHeight).ticks(20)
    this.gridlineTwoCall = axisTop(this.xScale).tickSize(chartHeight).ticks(20)

    this.voronoiData = voronoi()
                      .x( d => this.xScale(d[xKey]))
                      .y( d => this.yScale(d[yKey]))
                      .extent([[0, 0], [chartWidth, chartHeight]])

    createUpdateAxes(this.xAxis, this.xAxisCall)
    createUpdateAxes(this.yAxis, this.yAxisCall)

    const lineData = nest()
              .key( d => d.zip)
              .entries(data),
          linePath = line()
              .x(d => this.xScale(d[xKey]) )
              .y(d => this.yScale(d[yKey]) ),
          paths = this.chartArea.selectAll('.line-path').data(lineData),
          voronoiPath = this.chartArea.selectAll('.voronoi').data(this.voronoiData(data).polygons())

    paths.enter()
        .append('path')
        .attr('class',  d => `line-path zip${d.key}`)
        .attr("fill", "none")
        .attr("stroke-width", d => +d.key === highlight || +d.key === highlightHover ? 4 : 1)
        .attr("stroke-opacity", d => +d.key === highlight || +d.key === highlightHover ? 1 : .2)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .style("mix-blend-mode", "multiply")
        .attr('d', d => linePath(d.values))


    //Coloring
    for (var i = 0; i < dataTotal.length; i ++){

      this.chartArea.select(`.zip${dataTotal[i].zip}`)
          .attr('stroke', colorScale(dataTotal[i].total))
    }

    voronoiPath.enter()
        .append("path")
        .attr("class", "voronoi")
        .attr("d", d => d ? "M" + d.join("L") + "Z" : null )
        .style("fill", "none")
        .style("pointer-events", "all")
        .on('mouseover', this.handleMouseoverLine)
        .on('mouseout', this.handleMouseoutLine)
        .on('click', this.handleClickLine)

    appendArea( this.chartArea, `gridline-one`, 0, chartHeight)
    appendArea( this.chartArea, `gridline-two`, 0, chartHeight)

    this.gridlineOne = this.chartArea.select(`.gridline-one`)
    this.gridlineTwo = this.chartArea.select(`.gridline-two`)

    createUpdateGridlines(this.gridlineOne,  this.gridlineOneCall,  '#fff', 6)
    createUpdateGridlines(this.gridlineTwo,  this.gridlineTwoCall,  '#ccc', 1)

    //console.log(lineData)
  }

  updateDims(){


  }

  updateData(){

    const { highlight, highlightHover } = this.props


    this.chartArea.selectAll('.line-path')
              .attr("stroke-width", d => +d.key === highlight || +d.key === highlightHover ? 4 : 1)
              .attr("stroke-opacity", d => +d.key === highlight || +d.key === highlightHover ? 1 : .2)


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
    bottom: 25,
    left: 30
  },
  transition: {
    long: 1000,
    short: 300,
  }
}

export default LineChart
