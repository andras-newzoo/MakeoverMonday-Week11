import React, { Component } from 'react'
import './Map.css'

import { select } from 'd3-selection'
import { geoPath, geoAlbers } from 'd3-geo'
import { extent } from 'd3-array'

import { updateSvg, appendArea } from '../chartFunctions'

import * as chroma from 'chroma-js'

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
          projection = geoAlbers().scale([70000]).translate([-19580, 3910]),
          colorScale = chroma.scale([ '#3d7eaa',
                                      '#4897b5',
                                      '#62afbd',
                                      '#84c6c5',
                                      '#aadcce',
                                      '#aae3bf',
                                      '#bbe8a8',
                                      '#d8e88f',
                                      '#ffe47a']).domain(extent(data, d => d.total))

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

      //Coloring
      for (var i = 0; i < data.length; i ++){

        svg.select(`.zip${data[i].zip}`)
            //.attr('class', `${data[i].country} country all-data`)
            .attr('fill', colorScale(data[i].total))
      }


  }

  updateData(){

      const { highlightHover, highlight, mapData } = this.props

      this.chartArea.selectAll('.map-path')
            .attr('stroke', (d,i) => +mapData.features[i].properties['CODE'] === highlight ||  +mapData.features[i].properties['CODE'] === highlightHover ? '#333' :  'none')

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
