import exploraApi from "./api";

export const getAcceleration = async(deviceEui: string, minTime: number, maxTime: number) => {
  const res = await exploraApi.get(`/timestream/${deviceEui}/accelerations?minTime=${minTime}&maxTime=${maxTime}`)

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
