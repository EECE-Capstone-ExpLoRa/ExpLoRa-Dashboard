import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail, Allow, IsOptional, ValidateIf, IsEnum, IsAlphanumeric } from "class-validator";
import { DeviceType } from "src/devices/device.dto";

export class LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  username: string

  @ApiProperty()
  @IsNotEmpty()
  password: string
}

export class FullUser {
  userId: number;
  email: string;
  username: string;
  password: string;
}

export class UserDto {
  @ApiProperty({
    type: Number,
    description: "The user's Id"
  })
  userId: number;

  @ApiProperty({
    type: String,
    description: "The user's username"
  })
  username: string;

  @ApiProperty({
    type: String,
    description: "The user's email"
  })
  email: string;
}

export class CreateUserDto {
  @ApiProperty({
    type: String,
    description: "The username the user would like to go as"
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    type: String,
    description: "The password the user would like to use"
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    type: String,
    description: "The email the user would like to register with"
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsAlphanumeric()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional()
  deviceEui?: string;
}

export class UpdateUserDto {
  @Allow()
  @IsOptional()
  @ApiPropertyOptional()
  newUsername: string;

  @Allow()
  @IsOptional()
  @ApiPropertyOptional()
  newPassword: string;

  @Allow()
  @IsEmail()
  @IsOptional()
  @ApiPropertyOptional()
  newEmail: string
}

export class RegisterDeviceDto {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: "The device registration code"
  })
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

export type CountAndUser = {
  user: UserDto,
  count: number
}