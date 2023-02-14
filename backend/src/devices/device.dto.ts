import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Allow, IsEnum, IsNotEmpty, IsOptional } from "class-validator";

export enum DeviceType {
  rocket = "rocket",
  drone = "drone",
  car = "car",
  other = "other"
}

export class DeviceDto {
  @Allow()
  @ApiProperty({
    type: String,
    description: "The device registration code"
  })
  device_eui: string;

  @Allow()
  @ApiPropertyOptional({
    type: String,
    description: "Alternate name for device (besides registration code)"
  })
  nickname: string;
  
  @Allow()
  @ApiProperty({
    enum: ["rocket", "drone", "car", "other"],
    enumName: "DeviceType"
  })
  type: DeviceType;

  constructor(device_eui: string) {
    this.device_eui = device_eui;
  }
}

export class UpdateDeviceDto {
  @Allow()
  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional()
  nickname: string;

  @Allow()
  @IsOptional()
  @IsEnum(DeviceType)
  @IsNotEmpty()
  @ApiPropertyOptional()
  type: DeviceType;
}

export type DeviceAndCount = {
  device: DeviceDto,
  count: number
}
