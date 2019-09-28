import React, { Component } from 'react';
import Map from './components/Map';
import './App.css';
import {GoogleMap, withScriptjs, withGoogleMap} from "react-google-maps";
import { geolocated } from "react-geolocated";
import Album from './components/Album';

const WrappedMap = withScriptjs(withGoogleMap(Map));

class App extends React.Component{

  constructor(props) {
    super(props);

  }

  render(){
  return (
  <div className="App">
    <header>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400,800,600,700,300"/>
      <link rel="stylesheet" href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css"/>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.css"/>
    </header>

      <Album/>
      <div style={{width:'400px', height:'400px', alignSelf: 'center' }}>
          <WrappedMap googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${
            process.env.REACT_APP_GOOGLE_KEY
          }`}
          loadingElement={<div style={{ height: "100%" }} />}
          containerElement={<div style={{ height: "400px" }} />}
          mapElement={<div style={{ height: "100%" }} />}

          />


     </div>
    </div>

    );
 }
}

export default App;
