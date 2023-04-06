export const TEST_DEVICE_EUI = "00-80-00-00-04-05-b6-b1";

export const getRecentData = (data: any[]) => {
  return data.slice(-50);
};

//TODO: pass in device eui as param here
export const getEventName = (measure: string) => {
  return `${TEST_DEVICE_EUI}:${measure}`;
};
