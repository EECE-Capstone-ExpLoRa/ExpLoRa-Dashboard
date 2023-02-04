import { Injectable } from '@nestjs/common';
import { DeviceDto } from './device.dto';
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

  public async update(deviceEui: string, device: DeviceDto): Promise<number> {
    const updateCount = await this.knex<DeviceDto>('device')
      .where('device_eui', deviceEui)
      .update(device);
    return updateCount;
  }
}