import React, { Component } from 'react'
import './Map.css'

import { select } from 'd3-selection'
import { geoPath, geoAlbers } from 'd3-geo'

import { updateSvg, appendArea } from '../chartFunctions'


class Map extends Component {

  handleMouseoverMap = d => {
    this.props.handleMouseoverMap(d)
  }

  handleMouseoutMap = d => {
    this.props.handleMouseoutMap(d)
  }

  handleClickMap = d => {
    this.props.handleClickMap(d)
  }

  componentDidMount(){
    const { mapData, data, width, height } = this.props

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
          { data, mapData, highlight, highlightHover } = this.props,
          { chartWidth, chartHeight } = updateSvg( svg, height, width, margin ),
          projection = geoAlbers().scale([70000]).translate([-19580, 3910])

    appendArea(svg, `${chartClass}-chart-area`, margin.left, margin.top)

    this.chartArea = select(`.${chartClass}-chart-area`)

    const  mapPath = geoPath().projection(projection)

    console.log(mapData.features)
    this.chartArea.selectAll('.map-path')
          .data(mapData.features)
          .enter()
          .append('path')
          .attr('class', 'map-path')
          .attr('d', mapPath)
          .attr('fill', '#ccc')
          .attr('stroke-width', 1)
          .attr('stroke', d => +d.properties['CODE'] === highlight ||  +d.properties['CODE'] === highlightHover ? 'steelblue' :  'none')
          .on('mouseover', this.handleMouseoverMap)
          .on('mouseout', this.handleMouseoutMap)
          .on('click', this.handleClickMap)

  }

  updateData(){

      const { highlightHover, highlight, mapData } = this.props

      this.chartArea.selectAll('.map-path')
            .attr('stroke', (d,i) => +mapData.features[i].properties['CODE'] === highlight ||  +mapData.features[i].properties['CODE'] === highlightHover ? 'steelblue' :  'none')

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
