import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Allow } from "class-validator";

type DeviceType = 'rocket' | 'drone' | 'car' | 'other';

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

export type DeviceAndCount = {
  device: DeviceDto,
  count: number
}
