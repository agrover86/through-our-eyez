import React, { Component }  from 'react';
import {GoogleMap, withScriptsjs, withGoogleMap, Marker,InfoWindow, Polyline} from "react-google-maps";
import { geolocated } from "react-geolocated";


class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {startloc_long:0,
      startloc_lat:0,
      endloc_long:"",
      endloc_lat:"",
      markers:[{long:"", lat:"",name:"", description:"", imgURL:""}],
      selectedLoc:null,
      };
    this.setSelectedLoc = this.setSelectedLoc.bind(this);

  }


  componentWillMount() {
    this.setState({ startloc_long:-0.084587,
      startloc_lat:51.521972,
      markers:[{long: -0.081438,lat:51.519966, name:"Liverpool Street Station",description:"International Train Station",imgURL:"https://cdn.prgloo.com/media/36493494fee44871831995e42061a62f.jpg?width=1135&height=960"},
      {long:-0.046489,lat:51.522823, name:"Stepney Green", description:"Iconic London Station",imgURL:"https://www.themontcalm.com/blog/wp-content/uploads/2016/08/Stepney-Green-Station.jpg"}],

      selectedLoc:null,
    });
   }

   setSelectedLoc(location){
      this.setState({selectedLoc:location});
   }


render(){
  return (
   <div>
    <GoogleMap
      defaultZoom={12}
      defaultCenter={{lat:this.state.startloc_lat, lng:this.state.startloc_long}}>
      {this.state.markers.map((loc, i) => (
        <Marker
          key={i}
          position={{
            lat: loc.lat,
            lng: loc.long
          }}
          onClick={() => {
            this.setSelectedLoc(loc);
          }}
        />
       ))}
       {this.state.selectedLoc && (
          <InfoWindow
          onCloseClick={() => {
            this.setSelectedLoc(null);
          }}
          position={{lat: this.state.selectedLoc.lat,lng: this.state.selectedLoc.long}}
          >
          <div style={{color: 'black'}}>
            <h2>{this.state.selectedLoc.name}</h2>
            <img src={this.state.selectedLoc.imgURL}  height="100px" width="250px"/>
            <p>{this.state.selectedLoc.description}</p>
          </div>
          </InfoWindow>


      )}
    </GoogleMap>

   </div>
  )
}
}
export default Map;
