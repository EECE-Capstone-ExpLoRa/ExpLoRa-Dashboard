import { 
  BadRequestException,
  Body, Controller, Delete, 
  Get,
  NotFoundException, 
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
  public async findUserById(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    const user = await this.userService.findUserById(id);
    if (!user) {
      throw new NotFoundException(`The user with the id: ${id} does not exist`);
    }
    return user;
  }

  @Get('username/:username')
  public async findUserByUsername(@Param('username') username: string) {
    const user = await this.userService.findUserByUsername(username);
    if (!user) throw new NotFoundException(`User with the username: ${username} not found`);
    return user;
  }

  @Get()
  public async findAllUsers() {
    return this.userService.findAllUsers();
  }

  @Post()
  public async create(@Body(new ValidationPipe({ whitelist: true })) user: UserDto): Promise<number> {
    try {
      const userId = await this.userService.create(user);
      return userId;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Invalid username (already exists)');
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
    if (deleteCount === 0) {
      throw new NotFoundException(`The user with the id: ${id} does not exist`);
    }
    return deleteCount;
  }

  @Put(':id')
  public async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body(new ValidationPipe({ whitelist: true, skipMissingProperties: true })) user: UserDto
  ): Promise<number> {
    if (Object.keys(user).length === 0) {
      throw new BadRequestException("Object must contain either username or password");
    }
    try {
      const updatedUser = await this.userService.update(id, user);
      return updatedUser;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Invalid username (already exists)')
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