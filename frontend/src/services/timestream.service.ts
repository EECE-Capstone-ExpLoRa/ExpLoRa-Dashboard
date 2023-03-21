import axios from "axios";


const timestreamApi = axios.create({
    baseURL: 'http://localhost:8080'
});

export const getAcceleration = async(deviceEui: string) => {
  const res = await timestreamApi.get(`/timestream/Acceleration/${deviceEui}`)

  return res.data;
}

export const getAccelerationX = async (deviceEui: string) => {
  const res = await timestreamApi.get(`/timestream/Acceleration%20X/${deviceEui}`)

  return res.data;
}

export const getAccelerationY = async (deviceEui: string) => {
  const res = await timestreamApi.get(`/timestream/Acceleration%20Y/${deviceEui}`)

  return res.data;
}

export const getAccelerationZ = async (deviceEui: string) => {
  const res = await timestreamApi.get(`/timestream/Acceleration%20Z/${deviceEui}`)

  return res.data;
}



export default timestreamApi;