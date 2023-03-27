import exploraApi from "./api";

const recent_date_range = {
  min: "2023-01-13 10:50:42.701",
  max: "2023-03-15 20:25:25.123"
};

export const getAcceleration = async(deviceEui: string) => {
  const res = await exploraApi.get(`/timestream/${deviceEui}/accelerations`)

  return res.data;
};

export const getAccelerationX = async (deviceEui: string, minTime: number, maxTime: number) => {
  const res = await exploraApi.get(`/timestream/${deviceEui}/Acceleration%20X?minTime=${minTime}&maxTime=${maxTime}`)

  return res.data;
};

export const getAccelerationY = async (deviceEui: string, minTime: number, maxTime: number) => {
  const res = await exploraApi.get(`/timestream/${deviceEui}/Acceleration%20Y?minTime=${minTime}&maxTime=${maxTime}`)

  return res.data;
};

export const getAccelerationZ = async (deviceEui: string, minTime: number, maxTime: number) => {
  const res = await exploraApi.get(`/timestream/${deviceEui}/Acceleration%20Z?minTime=${minTime}&maxTime=${maxTime}`)

  return res.data;
};
