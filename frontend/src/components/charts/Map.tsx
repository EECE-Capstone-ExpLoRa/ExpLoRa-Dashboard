import { GoogleMap, MarkerF, LoadScript } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import ExpandableCard from '../ExpandableCard';
import { registerGeoDataSocket } from '../../services/socket.service';
import { GeoData } from '../../utils/types';

const Map = () => {
  const [lat, setLat] = useState(0)
  const [lng, setLng] = useState(0)

  const containerStyle = {
    height: '225px',
    width: 'full'
  };

  useEffect(() => {
    const socket = registerGeoDataSocket()

    socket.on(GeoData.Latitude, (lats) => {
      if (lats.values) {
        setLat(lats.values.value)
      }
    })

    socket.on(GeoData.Longitude, (lngs) => {
      if (lngs.values) {
        setLng(lngs.values.value)
      }
    })
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