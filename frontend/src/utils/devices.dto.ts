export enum DeviceType {
    rocket = "rocket",
    drone = "drone",
    car = "car",
    other = "other"
  }

  export type deviceResponse = {
    device_eui: string;
    nickname: string;
    type: DeviceType;
  }