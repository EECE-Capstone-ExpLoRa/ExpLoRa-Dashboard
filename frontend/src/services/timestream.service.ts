import axios from "axios";

const timestreamApi = axios.create({
    baseURL: 'http://localhost:8080'
});

const recent_date_range = {
  min: "2023-01-13 10:50:42.701",
  max: "2023-03-15 20:25:25.123"
}

export const getAcceleration = async(deviceEui: string) => {
  const res = await timestreamApi.get(`/timestream/${deviceEui}/accelerations`)

  return res.data;
}

export const getAccelerationX = async (deviceEui: string) => {
  const res = await timestreamApi.get(`/timestream/${deviceEui}/Acceleration%20X`, {data: recent_date_range})

  return res.data;
}

export const getAccelerationY = async (deviceEui: string) => {
  const res = await timestreamApi.get(`/timestream/${deviceEui}/Acceleration%20Y`, {data: recent_date_range})

  return res.data;
}

export const getAccelerationZ = async (deviceEui: string) => {
  const res = await timestreamApi.get(`/timestream/${deviceEui}/Acceleration%20Z`, {data: recent_date_range})

  return res.data;
}



export default timestreamApi;