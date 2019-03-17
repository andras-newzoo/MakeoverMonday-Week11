import React, { Component } from 'react';
import './App.css';

import mapData from './data/map.json'
import total from './data/total.json'
import movingAvg from './data/movingAvg.json'

import { timeParse, timeFormat } from 'd3-time-format';

import Map from './components/Map/Map'
import LineChart from './components/LineChart/LineChart'

import { List, Button, Popup } from 'semantic-ui-react'

class App extends Component {
    constructor(props){
        super(props)
        this.state = {
              width: 20000,
              height: undefined,

              highlight: 19111,
              highlightHover: '-',

              lineTooltipHoverMonth: '----',
              lineTooltipHoverZip: '----',
              lineTooltipHoverValue: '0',

        }

      this.handleResize = this.handleResize.bind(this)
    }

    handleMouseoverLine = d => {
      let copy = {...this.state}
          copy.highlightHover = d.data.zip
          copy.lineTooltipHoverMonth = d.data.date
          copy.lineTooltipHoverZip = d.data.zip
          copy.lineTooltipHoverValue = d.data.movingAvg
          copy.lineTooltipHoverFilter = d.data.month

          this.setState(copy)
    }

    handleMouseoutLine = d => {
      let copy = {...this.state}
          copy.highlightHover = ''
          copy.lineTooltipHoverMonth = '----'
          copy.lineTooltipHoverZip = '----'
          copy.lineTooltipHoverValue = '0'
          this.setState(copy)
    }

    handleClickLine = d => {
      let copy = {...this.state}
          copy.highlight = d.data.zip
          this.setState(copy)
    }

    handleMouseoverMap = (d, i, n) => {
      let copy = {...this.state}
      copy.highlightHover = d.properties['CODE']
      this.setState(copy)
    }

    handleMouseoutMap = d => {
      let copy = {...this.state}
      copy.highlightHover = ''
      this.setState(copy)
    }

    handleClickMap = d => {
      let copy = {...this.state}
          copy.highlight = d.properties['CODE']
          this.setState(copy)
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
    const { height, width, highlight, highlightHover } = this.state,
          { lineTooltipHoverMonth, lineTooltipHoverZip, lineTooltipHoverValue } = this.state,
          colorArray = [  '#3d7eaa', '#4897b5', '#62afbd', '#84c6c5', '#aadcce', '#aae3bf', '#bbe8a8', '#d8e88f', '#ffe47a']

    this.formatData(movingAvg)

    return (
      <div className="App" >
        <div className="header-section">
          <h1>Philadelhia Real Estate Market</h1>
          <h2>Number of Document Transactions for Every ZIP Code (rolling 12-month average)</h2>
            <div id="paragraph">
              <p>This visualization is looking at the total number of Real Estate Tax documents in Philadelhia from 2000 to 2018.
                  It includes every type of document registered like Mortgage, Deed, Satisfaction, etc.</p>
            </div>
          <div id='how-to'>
            <Popup trigger={<Button icon='question circle' />} content='
                Hover over the map or the lines to highlight a certain ZIP code, and click on it to keep it highlighted!
                The darker blue the color, means the more documents transactions in total, while yellow is the least number of transactions over the period.' />
          </div>
        </div>
        <div className="map-section">
          <Map
            mapData = {mapData}
            data = {total}
            chartClass = {'map'}
            width = {400}
            height = {400}
            highlight = {+highlight}
            highlightHover = {+highlightHover}
            handleMouseoverMap = {this.handleMouseoverMap}
            handleMouseoutMap = {this.handleMouseoutMap}
            handleClickMap = {this.handleClickMap}
            colorArray = {colorArray}
          />
        </div>
        <div className="linechart-section" ref={parent => (this.container = parent)}>
          <LineChart
            data = {movingAvg}
            dataTotal = {total}
            chartClass = {'linechart'}
            width = {width}
            height = {height}
            highlight = {+highlight}
            highlightHover = {+highlightHover}
            xKey = {'xValue'}
            yKey = {'yValue'}
            handleMouseoverLine = {this.handleMouseoverLine}
            handleMouseoutLine = {this.handleMouseoutLine}
            handleClickLine = {this.handleClickLine}
            colorArray = {colorArray}
            lineTooltipHoverMonth = {lineTooltipHoverMonth}
            lineTooltipHoverZip = {lineTooltipHoverZip}
            lineTooltipHoverValue = {lineTooltipHoverValue}
          />
        </div>
        <div className='credit-section'>
          <List bulleted horizontal link>
              <List.Item href='https://twitter.com/AndSzesztai' target='_blank' as='a'>Built and somewhat redesigned by: Andras Szesztai</List.Item>
              <List.Item href='https://public.tableau.com/profile/dorian.barosan#!/vizhome/PhiladelphiaRealEstateMarket/Dashboard1' target='_blank' as='a'>Original design, text and calculations: Dorian Banutoiu</List.Item>
              <List.Item href='https://www.makeovermonday.co.uk/' target='_blank' as='a'>#MakeoverMonday Week 11 2019</List.Item>
              <List.Item href='https://data.world/makeovermonday/2019week11' target='_blank' as='a'>Data and Map: OpenDataPhilly</List.Item>
          </List>
        </div>
      </div>
    );
  }
}

export default App;
