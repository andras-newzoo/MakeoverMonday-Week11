import React, { Component } from 'react';
import './App.css';

import { List } from 'semantic-ui-react'

class App extends Component {
    constructor(props){
        super(props)
        this.state = {

        }
    }

    componentDidMount(){

    }



  render() {
    return (
      <div className="App">
        <div className="header-section">

        </div>
        <div className="map-section">

        </div>
        <div className="linechart-section">

        </div>
        <div id='credit-section'>
          <List bulleted horizontal link>
              <List.Item href='https://twitter.com/AndSzesztai' target='_blank' as='a'>Built and somewhat redesigned by: Andras Szesztai</List.Item>
              <List.Item href='' target='_blank' as='a'></List.Item>
              <List.Item href='https://www.makeovermonday.co.uk/' target='_blank' as='a'>#MakeoverMonday Week 11 2019</List.Item>
              <List.Item href='https://data.world/makeovermonday/2019w11' target='_blank' as='a'></List.Item>
          </List>
        </div>
      </div>
    );
  }
}

export default App;
