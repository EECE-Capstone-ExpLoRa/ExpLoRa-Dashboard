export const TEST_DEVICE_EUI_1 = "00-80-00-00-04-05-b6-b1";
export const TEST_DEVICE_EUI_2 = "00-80-00-00-04-03-f9-e5";

export const getRecentData = (data: any[]) => {
  return data.slice(-50);
};

export const getEventName = (deviceEui: string, measure: string) => {
  return `${deviceEui}:${measure}`;
};

export const getRocketTestingDateTimes = () => {
  const dt1 = new Date(2023, 3, 2, 12);
  const dt2 = new Date(2023, 3, 2, 16);

  return [dt1, dt2];
};
