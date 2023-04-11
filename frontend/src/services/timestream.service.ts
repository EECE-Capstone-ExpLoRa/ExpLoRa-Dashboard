import exploraApi from "./api";

export const getAcceleration = async (
  deviceEui: string,
  minTime: number,
  maxTime: number
) => {
  const res = await exploraApi.get(
    `/timestream/${deviceEui}/accelerations?minTime=${minTime}&maxTime=${maxTime}`
  );

  return res.data;
};

export const getData = async (
  deviceEui: string,
  measureName: string,
  minTime: number,
  maxTime: number
) => {
  const res = await exploraApi.get(
    `/timestream/${deviceEui}/${measureName}?minTime=${minTime}&maxTime=${maxTime}`
  );

  return res.data;
};

export const getAccelerationX = async (
  deviceEui: string,
  minTime: number,
  maxTime: number
) => {
  const res = await exploraApi.get(
    `/timestream/${deviceEui}/acceleration_x?minTime=${minTime}&maxTime=${maxTime}`
  );

  return res.data;
};

export const getAccelerationY = async (
  deviceEui: string,
  minTime: number,
  maxTime: number
) => {
  const res = await exploraApi.get(
    `/timestream/${deviceEui}/acceleration_y?minTime=${minTime}&maxTime=${maxTime}`
  );

  return res.data;
};

export const getAccelerationZ = async (
  deviceEui: string,
  minTime: number,
  maxTime: number
) => {
  const res = await exploraApi.get(
    `/timestream/${deviceEui}/acceleration_z?minTime=${minTime}&maxTime=${maxTime}`
  );

  return res.data;
};
