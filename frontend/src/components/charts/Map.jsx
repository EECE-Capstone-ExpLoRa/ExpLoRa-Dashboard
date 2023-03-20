import { GoogleMap, MarkerF, LoadScript } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import Card from '../Card';

const containerStyle = {
  height: '610px'
};

const Map = () => {
  const [lat, setLat] = useState(0)
  const [lng, setLng] = useState(0)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(function(position) {
        setLat(position.coords.latitude)
        setLng(position.coords.longitude)

        console.log(position.coords)
      });
    }
  }, [])

  return (
    <Card title="Location" modalSize="full">
    { window.google === undefined ?
    <LoadScript
      googleMapsApiKey="AIzaSyAjXb38TAKTaGtD9XypfgFjsVqVnTV-vf8"
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{lat, lng}}
        zoom={20}
      >
        { /* Child components, such as markers, info windows, etc. */ }
 
        <MarkerF position={{lat, lng}}/>
      </GoogleMap>
    </LoadScript>
    : 
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{lat, lng}}
      zoom={20}
    >
      { /* Child components, such as markers, info windows, etc. */ }

      <MarkerF position={{lat, lng}}/>
    </GoogleMap> }
  </Card>
  );
}

export default Map;