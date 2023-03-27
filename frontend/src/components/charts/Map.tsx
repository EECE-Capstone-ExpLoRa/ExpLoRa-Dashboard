import { GoogleMap, MarkerF, LoadScript } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import ExpandableCard from '../ExpandableCard';

const Map = () => {
  const [lat, setLat] = useState(0)
  const [lng, setLng] = useState(0)

  const containerStyle = {
    height: '225px',
    width: 'full'
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(function(position) {
        setLat(position.coords.latitude)
        setLng(position.coords.longitude)
      });
    }
  }, [])

  return (
    <ExpandableCard title="Location" modalSize="full">
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
  </ExpandableCard>
  );
}

export default Map;