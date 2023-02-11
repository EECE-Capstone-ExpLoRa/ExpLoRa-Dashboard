import { 
  Body, Controller, Get,
  NotFoundException,
  Param, Put, UseGuards, UsePipes, ValidationPipe 
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DeviceAndCount, DeviceDto, UpdateDeviceDto } from './device.dto';
import { DeviceService } from './device.service';

@Controller('devices')
@ApiTags('Device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}
  
  @Get(':eui')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({summary: "Allows authorized users to view a device they registered"})
  @ApiParam({name: "EUI", description: "The device's unique identifier"})
  @ApiCreatedResponse({description: "The device details", type: DeviceDto})
  @ApiNotFoundResponse({description: "Device not registered with current user"})
  @ApiUnauthorizedResponse({description: "You aren't logged into your account"})
  public async findOneDevice(@Param('eui') deviceEui: string): Promise<DeviceDto> {
    const device = await this.deviceService.findOne(deviceEui);
    if (!device) {
      throw new NotFoundException(`No device exists with EUI: ${deviceEui}`);
    }
    return device;
  }

  @Put(':eui')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({summary: "Allows authorized users to update a device they registered"})
  @ApiParam({name: "EUI", description: "The device's unique identifier"})
  @ApiBody({type: UpdateDeviceDto})
  @ApiCreatedResponse({description: "The updated device details", type: DeviceDto})
  @ApiNotFoundResponse({description: "Device not registered with current user"})
  @ApiUnauthorizedResponse({description: "You aren't logged into your account"})
  @UsePipes(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true}))
  public async update(@Param('eui') deviceEui: string, @Body() updateDeviceDto: UpdateDeviceDto): Promise<DeviceDto> {
    const deviceAndCount: DeviceAndCount = await this.deviceService.update(deviceEui, updateDeviceDto);
    if (!deviceAndCount) {
      throw new NotFoundException(`No device exists with EUI: ${deviceEui}`);
    }
    return deviceAndCount.device;
  }
}