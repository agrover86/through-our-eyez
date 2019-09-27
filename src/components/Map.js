import React, { Component }  from 'react';
import {GoogleMap, withScriptsjs, withGoogleMap} from "react-google-maps";

function Map(){
console.log(props.location)
  return (
    <GoogleMap defaultZoom={10} defaultCenter={{lat:-39.601200, lng:176.796005}}/>
  )
}
export default Map;
