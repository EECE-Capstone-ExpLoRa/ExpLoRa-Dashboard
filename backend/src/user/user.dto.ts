import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail, Allow } from "class-validator";

export class UserDto {
  @ApiProperty({
    type: Number,
    description: "The user's Id"
  })
  user_id: number;

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
  email: string;
}

export class UpdateUserDto {
  @Allow()
  @ApiProperty()
  username: string;

  @Allow()
  @ApiProperty()
  email: string;
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

export type DeletedUser = {
  user: UserDto,
  deleteCount: number
}