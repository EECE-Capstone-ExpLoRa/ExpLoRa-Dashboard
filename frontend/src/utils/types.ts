export enum AccelerationDirection {
  X = "acceleration_x",
  Y = "acceleration_y",
  Z = "acceleration_z",
  All = "accelerations"
}

export enum AircraftAxis {
  Yaw = "yaw",
  Pitch = "pitch",
  Roll = "roll"
}

export enum AirQuality {
  PM_1P0 = "mass_concentration_pm1p0",
  PM_2P5 = "mass_concentration_pm2p5",
  PM_4P0 = "mass_concentration_pm4p0",
  PM_10P0 = "mass_concentration_pm10p0",
  Humidity = "ambient_humidity",
  Temperature = "ambient_temperature",
  VOC = "voc_index"
}

export enum GeoData {
  Latitude = "latitude",
  Longitude = "longitude",
  Altitude = "altitude",
  Speed = "speed"
}

export type TimestreamSocketResponse = {
  timestamp: number,
  value: number
}[]

export type TimestreamAccelerationsResponse = {
  timestamp: number, 
  "AccelerationX": number,
  "AccelerationY": number,
  "AccelerationZ": number
}[]