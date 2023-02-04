import { Injectable } from '@nestjs/common';
import { InjectKnex } from 'nestjs-knex/dist/knex.decorators';
import { Knex } from 'nestjs-knex/dist/knex.interfaces';

import { UserDto, UserDeviceDto, UpdateUserDto, CreateUserDto } from './user.dto';
import { DeviceDto } from 'src/devices/device.dto';
import { hashPassword, isMatch } from 'src/utils/bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  public async findUserById(userId: number): Promise<UserDto> {
    const user = await this.knex<UserDto>('user')
      .select('user_id', 'username', 'email')
      .where('user_id', userId)
      .first();
    return user;
  }

  public async findUserByUsername(username: string): Promise<UserDto> {
    const user = await this.knex<UserDto>('user')
      .select('user_id', 'username', 'email')
      .where('username', username)
      .first();
    return user;
  }

  public async findAllUsers(): Promise<UserDto[]> {
    const users = await this.knex<UserDto>('user')
      .select('user_id', 'username', 'email');
    return users;
  }

  public async create(createUserDto: CreateUserDto): Promise<number> {
    console.log(`Raw password: ${createUserDto.password}`);
    const password = await hashPassword(createUserDto.password);
    console.log(`Stored password: ${password}`);
    const hashedUser = { ...createUserDto, password};
    const userId = await this.knex<UserDto>('user')
      .insert(hashedUser);
    console.log(userId);
    return userId[0];
  }

  public async update(userId: number, updateUserDto: UpdateUserDto): Promise<number> {
    const updateCount = await this.knex<UserDto>('user')
      .where('user_id', userId)
      .update(updateUserDto);
    console.log(updateCount)
    return updateCount;
  }

  public async delete(userId: number): Promise<number> {
    const deleteCount = await this.knex<UserDto>('user')
      .where('user_id', userId)
      .del();
    console.log(deleteCount);
    return deleteCount;
  }

  public async findAllDevices(userId: number): Promise<DeviceDto[]> {
    const devices = await this.knex<DeviceDto>('user_device')
      .join('device', 'user_device.device_eui', '=', 'device.device_eui')
      .select('device.device_eui', 'device.type', 'device.nickname')
      .where('user_device.user_id', userId);
    return devices;
  } 

  public async registerDevice(userId: number, deviceEui: string): Promise<void> {
    // find device (if not found, create a new entry)
    const device = await this.knex<DeviceDto>('device')
      .where('device_eui', deviceEui)
      .first();
    if (!device) {
      await this.knex<DeviceDto>('device')
        .insert(new DeviceDto(deviceEui));
    }

    // register the user with the device
    await this.knex<UserDeviceDto>('user_device')
      .insert(new UserDeviceDto(userId, deviceEui));
  }

  public async unregisterDevice(userId: number, deviceEui: string): Promise<number> {
    const deleteCount = await this.knex<UserDeviceDto>('user_device')
      .where('user_id', userId)
      .andWhere('device_eui', deviceEui)
      .del();
    return deleteCount;
  }
}