import { GoogleMap, MarkerF, LoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import ExpandableCard from "../ExpandableCard";
import { getSocket } from "../../services/socket.service";
import { GeoData } from "../../utils/types";
import { getEventName } from "../../utils/utils";
import { DashboardProp } from "../../utils/dashboardProps";

const Map = ({ eui }: DashboardProp) => {
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);

  const containerStyle = {
    height: "225px",
    width: "full",
  };

  useEffect(() => {
    const socket = getSocket();

    socket.on(getEventName(eui, GeoData.Latitude), (res) => {
      setLat(res.datapoint.value);
    });

    socket.on(getEventName(eui, GeoData.Longitude), (res) => {
      setLng(res.datapoint.value);
    });
  }, [eui]);

  return (
    <ExpandableCard title="Location" modalSize="full">
      {window.google === undefined ? (
        <LoadScript googleMapsApiKey="AIzaSyAjXb38TAKTaGtD9XypfgFjsVqVnTV-vf8">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{ lat, lng }}
            zoom={20}
          >
            {/* Child components, such as markers, info windows, etc. */}

            <MarkerF position={{ lat, lng }} />
          </GoogleMap>
        </LoadScript>
      ) : (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{ lat, lng }}
          zoom={20}
        >
          {/* Child components, such as markers, info windows, etc. */}

          <MarkerF position={{ lat, lng }} />
        </GoogleMap>
      )}
    </ExpandableCard>
  );
};

export default Map;
