import { Injectable } from '@nestjs/common';
import { DeviceAndCount, DeviceDto, UpdateDeviceDto } from './device.dto';
import { InjectKnex } from 'nestjs-knex/dist/knex.decorators';
import { Knex } from 'nestjs-knex/dist/knex.interfaces';

@Injectable()
export class DeviceService {
  constructor(
    @InjectKnex() private readonly knex: Knex,
  ) {}

  public async findOne(deviceEui: string): Promise<DeviceDto> {
    const device = await this.knex<DeviceDto>('device')
      .where('device_eui', deviceEui)
      .first();
    return device;
  }

  public async update(deviceEui: string, device: UpdateDeviceDto): Promise<DeviceAndCount> {
    const queriedDevice = await this.findOne(deviceEui);
    if (queriedDevice) {
      const updatedDevice: DeviceDto = {
        device_eui: deviceEui,
        nickname: device.nickname? device.nickname : queriedDevice.nickname,
        type: device.type? device.type: queriedDevice.type
      };
      const updateCount = await this.knex<DeviceDto>('device')
        .where('device_eui', deviceEui)
        .update(updatedDevice);
      return {device: updatedDevice, count: updateCount};
    }
    return undefined;
  }
}