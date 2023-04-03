import { io, Socket } from "socket.io-client";
import { AccelerationDirection, AircraftAxis, AirQuality, GeoData } from "../utils/types";

const socket = io('http://localhost:8080/socket/timestream', {
  transports: ['websocket', 'polling']
})

const CONNECTION_EVENT = 'connect_to_device';

//TODO: remove default param here, should use user state to pass in the eui
export const registerAccelerationSocket = (deviceEui="00-80-00-00-04-03-f9-e5"): Socket => {
  socket.emit(CONNECTION_EVENT, {deviceEui: deviceEui, measureName: AccelerationDirection.All})
  socket.emit(CONNECTION_EVENT, {deviceEui: deviceEui, measureName: AccelerationDirection.X})
  socket.emit(CONNECTION_EVENT, {deviceEui: deviceEui, measureName: AccelerationDirection.Y})
  socket.emit(CONNECTION_EVENT, {deviceEui: deviceEui, measureName: AccelerationDirection.Z})

  return socket;
}

export const registerAircraftMotionSocket = (deviceEui="00-80-00-00-04-03-f9-e5"): Socket => {
  socket.emit(CONNECTION_EVENT, {deviceEui: deviceEui, measureName: AircraftAxis.Yaw})
  socket.emit(CONNECTION_EVENT, {deviceEui: deviceEui, measureName: AircraftAxis.Pitch})
  socket.emit(CONNECTION_EVENT, {deviceEui: deviceEui, measureName: AircraftAxis.Roll})

  return socket;
}

export const registerAirQualitySocket = (deviceEui="00-80-00-00-04-03-f9-e5"): Socket => {
  socket.emit(CONNECTION_EVENT, {deviceEui: deviceEui, measureName: AirQuality.PM_1P0})
  socket.emit(CONNECTION_EVENT, {deviceEui: deviceEui, measureName: AirQuality.PM_2P5})
  socket.emit(CONNECTION_EVENT, {deviceEui: deviceEui, measureName: AirQuality.PM_4P0})
  socket.emit(CONNECTION_EVENT, {deviceEui: deviceEui, measureName: AirQuality.PM_10P0})
  socket.emit(CONNECTION_EVENT, {deviceEui: deviceEui, measureName: AirQuality.Humidity})
  socket.emit(CONNECTION_EVENT, {deviceEui: deviceEui, measureName: AirQuality.Temperature})
  socket.emit(CONNECTION_EVENT, {deviceEui: deviceEui, measureName: AirQuality.VOC})

  return socket;
}

export const registerGeoDataSocket = (deviceEui="00-80-00-00-04-03-f9-e5"): Socket => {
  socket.emit(CONNECTION_EVENT, {deviceEui: deviceEui, measureName: GeoData.Latitude})
  socket.emit(CONNECTION_EVENT, {deviceEui: deviceEui, measureName: GeoData.Longitude})
  socket.emit(CONNECTION_EVENT, {deviceEui: deviceEui, measureName: GeoData.Altitude})


  // maybe
  socket.emit(CONNECTION_EVENT, {deviceEui: deviceEui, measureName: GeoData.Speed})
  return socket;
}

export const registerPressureSocket = (deviceEui="00-80-00-00-04-05-b6-b1"): Socket => {
  socket.emit(CONNECTION_EVENT, {deviceEui: deviceEui, measureName: "pressure"})

  return socket;
}

export const registerTemperatureSocket = (deviceEui="00-80-00-00-04-05-b6-b1"): Socket => {
  socket.emit(CONNECTION_EVENT, {deviceEui: deviceEui, measureName: "temperature"})

  return socket;
}
