import { Allow } from "class-validator";

type DeviceType = 'rocket' | 'drone' | 'car' | 'other';

export class DeviceDto {
  @Allow()
  device_eui: string;

  @Allow()
  nickname: string;
  
  @Allow()
  type: DeviceType;

  constructor(device_eui: string) {
    this.device_eui = device_eui;
  }
}
