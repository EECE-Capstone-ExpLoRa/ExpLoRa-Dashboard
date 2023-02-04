import { Injectable } from '@nestjs/common';
import { InjectKnex } from 'nestjs-knex/dist/knex.decorators';
import { Knex } from 'nestjs-knex/dist/knex.interfaces';

import { UserDto, UserDeviceDto } from './user.dto';
import { DeviceDto } from 'src/devices/device.dto';

@Injectable()
export class UserService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  public async findOne(userId: number): Promise<UserDto> {
    const user = await this.knex<UserDto>('user')
      .where('user_id', userId)
      .first();
    return user;
  }

  public async create(user: UserDto): Promise<number> {
    const userId = await this.knex<UserDto>('user')
      .insert(user);
    console.log(userId);
    return userId[0];
  }

  public async update(userId: number, user: UserDto): Promise<number> {
    const updateCount = await this.knex<UserDto>('user')
      .where('user_id', userId)
      .update(user);
    console.log(updateCount);
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