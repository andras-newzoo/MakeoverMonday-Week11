import React, { Component } from 'react'
import './Map.css'

import { select } from 'd3-selection'
import { geoPath, geoAlbers } from 'd3-geo'

import { updateSvg, appendArea } from '../chartFunctions'


class Map extends Component {

  componentDidMount(){
    const { mapData, data, width, height } = this.props

    this.initVis()

    console.log(mapData)

  }

  initVis(){

    const svg = select(this.node),
          { height, width, margin, chartClass} = this.props,
          { data, mapData } = this.props,
          { chartWidth, chartHeight } = updateSvg( svg, height, width, margin ),
          projection = geoAlbers().scale([70000]).translate([-19580, 3910])

    appendArea(svg, `${chartClass}-chart-area`, margin.left, margin.top)

    this.chartArea = select(`.${chartClass}-chart-area`)
    
    const  mapPath = geoPath().projection(projection)

    this.chartArea.selectAll('.map-path')
          .data(mapData.features)
          .enter()
          .append('path')
          .attr('class', 'map-path')
          .attr('d', mapPath)
          .attr('fill', 'steelblue')







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
