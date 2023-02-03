import { IsNotEmpty } from "class-validator";

export class UserDto {
  user_id: number;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}

export class RegisterDeviceDto {
  @IsNotEmpty()
  device_eui: string; // TODO: enforce more constraints for what how device EUI is formatted
}

export class UserDeviceDto {
  user_id: number;

  device_eui: string;

  constructor(user_id: number, device_eui: string) {
    this.user_id = user_id;
    this.device_eui = device_eui;
  }
}