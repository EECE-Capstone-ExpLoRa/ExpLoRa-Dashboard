import { 
  Body, Controller, Get,
  NotFoundException,
  Param, Put, ValidationPipe 
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeviceDto } from './device.dto';
import { DeviceService } from './device.service';

@Controller('devices')
@ApiTags('Device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}
  
  @Get(':eui')
  public async findOneDevice(
    @Param('eui') deviceEui: string
  ): Promise<DeviceDto> {
    const device = await this.deviceService.findOne(deviceEui);
    if (!device) {
      throw new NotFoundException(`No device exists with EUI: ${deviceEui}`);
    }
    return device;
  }

  @Put(':eui')
  public async update(
    @Param('eui') deviceEui: string,
    @Body(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true})) deviceDto: DeviceDto
  ): Promise<number> {
    const updateCount = await this.deviceService.update(deviceEui, deviceDto);
    if (updateCount === 0) {
      throw new NotFoundException(`No device exists with EUI: ${deviceEui}`);
    }
    return updateCount;
  }
}