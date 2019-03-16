import React, { Component } from 'react';
import './App.css';

import mapData from './data/map.json'
import total from './data/total.json'
import movingAvg from './data/movingAvg.json'

import { timeParse, timeFormat } from 'd3-time-format';

import Map from './components/Map/Map'
import LineChart from './components/LineChart/LineChart'

import { List } from 'semantic-ui-react'

class App extends Component {
    constructor(props){
        super(props)
        this.state = {
              width: 20000,
              height: undefined
        }

      this.handleResize = this.handleResize.bind(this)
    }

    componentDidMount(){

      window.addEventListener("resize", this.handleResize);
      this.handleResize()

    }

    handleResize() {
      this.setState({
          height: this.container && this.container.clientHeight,
          width: this.container && this.container.clientWidth
      });
    }

    formatData(raw){
      const parseTime = timeParse('%Y/%m/%d'),
            formatTime = timeFormat('%B %Y')
      raw.forEach(d => {
          d.xValue = parseTime(d.month)
          d.date = formatTime(d.xValue)
          d.yValue = +d.movingAvg
      })
      return raw
    }


  render() {
    const { height, width } = this.state

    this.formatData(movingAvg)

    //console.log(movingAvg)

    return (
      <div className="App" >
        <div className="header-section">

        </div>
        <div className="map-section">
          <Map
            mapData = {mapData}
            data = {total}
            chartClass = {'map'}
            width = {400}
            height = {400}
          />
        </div>
        <div className="linechart-section" ref={parent => (this.container = parent)}>
          <LineChart
            data = {movingAvg}
            chartClass = {'linechart'}
            width = {width}
            height = {height}
            highlight = {19154}
            xKey = {'xValue'}
            yKey = {'yValue'}
          />
        </div>
        <div className='credit-section'>
          <List bulleted horizontal link>
              <List.Item href='https://twitter.com/AndSzesztai' target='_blank' as='a'>Built and somewhat redesigned by: Andras Szesztai</List.Item>
              <List.Item href='' target='_blank' as='a'>A</List.Item>
              <List.Item href='https://www.makeovermonday.co.uk/' target='_blank' as='a'>#MakeoverMonday Week 11 2019</List.Item>
              <List.Item href='https://data.world/makeovermonday/2019w11' target='_blank' as='a'>A</List.Item>
          </List>
        </div>
      </div>
    );
  }
}

export default App;
