import { 
  Body, Controller, Get,
  NotFoundException,
  Param, Put, ValidationPipe 
} from '@nestjs/common';
import { DeviceDto } from './device.dto';
import { DeviceService } from './device.service';

@Controller('devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}
  
  @Get(':eui')
  public async findOneDevice(
    @Param('eui') deviceEui: string
  ): Promise<DeviceDto> {
    const device = await this.deviceService.findOne(deviceEui);
    if (!device) {
      throw new NotFoundException('Device with the given ID not found');
    }
    return device;
  }

  @Put(':eui')
  public async update(
    @Param('eui') deviceEui: string,
    @Body(new ValidationPipe()) deviceDto: DeviceDto
  ): Promise<number> {
    const updateCount = await this.deviceService.update(deviceEui, deviceDto);
    return updateCount;
  }
}