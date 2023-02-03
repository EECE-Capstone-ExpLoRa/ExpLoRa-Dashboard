import { 
  Body, Controller, Delete, 
  Get, HttpException, HttpStatus, 
  Param, ParseIntPipe, Post, Put, 
  ValidationPipe 
} from '@nestjs/common';
import { DeviceDto } from 'src/devices/device.dto';
import { UserDto, RegisterDeviceDto } from './user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Get(':id')
  public async findOne(
    @Param('id', ParseIntPipe) id: number
  ): Promise<UserDto> {
    const user = await this.userService.findOne(id);
    return user;
  }

  @Post()
  public async create(
    @Body(new ValidationPipe({ whitelist: true })) user: UserDto
  ): Promise<number> {
    try {
      const userId = await this.userService.create(user);
      return userId;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException('Invalid username (already exists)', HttpStatus.BAD_REQUEST);
      } else {
        throw error;
      }
    }
  }

  @Delete(':id')
  public async delete(
    @Param('id', ParseIntPipe) id: number
  ): Promise<number> {  
    const deleteCount = await this.userService.delete(id);
    return deleteCount;
  }

  @Put(':id')
  public async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body(new ValidationPipe({ whitelist: true, skipMissingProperties: true })) user: UserDto
  ): Promise<number> {
    try {
      const updatedUser = await this.userService.update(id, user);
      return updatedUser;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException('Invalid username (already exists)', HttpStatus.BAD_REQUEST);
      } else {
        throw error;
      }
    }
  }

  @Get(':id/devices')
  public async findAllDevices(
    @Param('id', ParseIntPipe) userId: number
  ): Promise<DeviceDto[]> {
    const devices = await this.userService.findAllDevices(userId);
    return devices;
  }

  @Post(':id/devices')
  public async registerDevice(
    @Param('id', ParseIntPipe) userId: number,
    @Body(new ValidationPipe()) registerDeviceDto: RegisterDeviceDto
  ): Promise<void> {
    await this.userService.registerDevice(userId, registerDeviceDto.device_eui);
  }

  @Delete(':id/devices/:eui')
  public async unregisterDevice(
    @Param('id', ParseIntPipe) userId: number,
    @Param('eui') deviceEui: string,
  ): Promise<number> {
    const deleteCount = await this.userService.unregisterDevice(userId, deviceEui);
    return deleteCount;
  }
}