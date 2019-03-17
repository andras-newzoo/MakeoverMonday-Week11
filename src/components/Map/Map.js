import React, { Component } from 'react'
import './Map.css'

import { select } from 'd3-selection'
import { geoPath, geoAlbers } from 'd3-geo'
import { extent } from 'd3-array'
import { format } from 'd3-format'

import { updateSvg, appendArea } from '../chartFunctions'

import * as chroma from 'chroma-js'

class Map extends Component {

  handleMouseoverMap = (d, i, n) => {
    this.props.handleMouseoverMap(d, i, n)
  }

  handleMouseoutMap = d => {
    this.props.handleMouseoutMap(d)
  }

  handleClickMap = d => {
    this.props.handleClickMap(d)
  }

  componentDidMount(){

    this.initVis()

  }

  componentDidUpdate(prevProps){

        if(prevProps.highlightHover !== this.props.highlightHover){
          this.updateData()
        }

  }

  initVis(){

    const svg = select(this.node),
          { height, width, margin, chartClass} = this.props,
          { data, mapData, highlight, highlightHover, colorArray } = this.props,
          projection = geoAlbers().scale([70000]).translate([-19580, 3910]),
          colorScale = chroma.scale(colorArray.reverse()).domain(extent(data, d => d.total))

    // console.log(colorScale.domain())

    updateSvg( svg, height, width, margin )
    appendArea(svg, `${chartClass}-chart-area`, margin.left, margin.top)

    this.chartArea = select(`.${chartClass}-chart-area`)

    const  mapPath = geoPath().projection(projection)

    //console.log(mapData.features)
    this.chartArea.selectAll('.map-path')
          .data(mapData.features)
          .enter()
          .append('path')
          .attr('class', d => `map-path zip${d.properties['CODE']}`)
          .attr('d', mapPath)
          .attr('fill', '#ccc')
          .attr('stroke-width', 1)
          .attr('stroke', d => +d.properties['CODE'] === highlight ||  +d.properties['CODE'] === highlightHover ? '#333' :  'none')
          .on('mouseover', this.handleMouseoverMap)
          .on('mouseout', this.handleMouseoutMap)
          .on('click', this.handleClickMap)

      for (var i = 0; i < data.length; i ++){

        this.chartArea.select(`.zip${data[i].zip}`)
            .attr('fill', colorScale(data[i].total))

        this.chartArea.append('text')
            .attr('class', `map-tooltip zip${data[i].zip}-tooltip`)
            .attr('x', 0)
            .attr('y', 0)
            .attr('opacity', d => highlightHover === data[i].zip ? 1 : 0)
            .attr('fill', 'black')
            .text(d => `Total No. of Document Transactions: ${format(',.0f')(+data[i].total)}`)

        this.chartArea.append('text')
            .attr('class', `map-tooltip zip${data[i].zip}-tooltip`)
            .attr('x', 0)
            .attr('y', 20)
            .attr('opacity', d => highlightHover === data[i].zip ? 1 : 0)
            .attr('fill', 'black')
            .text(d => `Zip Code: ${format('d')(data[i].zip)}`)
      }

  }

  updateData(){

      const { highlightHover, highlight, mapData } = this.props

      this.chartArea.selectAll('.map-path')
            .attr('stroke', (d,i) => +mapData.features[i].properties['CODE'] === highlight ||  +mapData.features[i].properties['CODE'] === highlightHover ? '#333' :  'none')

      this.chartArea.selectAll('.map-tooltip').attr('opacity', 0 )
      this.chartArea.selectAll(`.zip${highlightHover}-tooltip`).attr('opacity', 1)
  }



  render(){
    return (
      <svg ref={node => this.node = node}/>
    )
  }

}

Map.defaultProps = {
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

export default Map
