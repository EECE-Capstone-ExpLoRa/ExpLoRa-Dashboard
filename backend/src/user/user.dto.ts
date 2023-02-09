import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail, Allow } from "class-validator";

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
  email: string;
}

export class UpdateUserDto {
  @Allow()
  @ApiPropertyOptional()
  newUsername: string;

  @Allow()
  @ApiPropertyOptional()
  newPassword: string;

  @Allow()
  @IsEmail()
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
  // so currently it only takes in a device id, should we want to add optional nicknames and the type? or where is that determined?
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