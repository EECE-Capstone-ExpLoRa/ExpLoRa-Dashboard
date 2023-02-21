import { 
  BadRequestException,
  Body, CACHE_MANAGER, Controller, Delete, 
  Get,
  Inject,
  NotFoundException, 
  Param, ParseIntPipe, Post, Put, 
  Req, 
  UseGuards, 
  UsePipes, 
  ValidationPipe 
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { 
  ApiBadRequestResponse, 
  ApiBearerAuth, ApiBody, 
  ApiCreatedResponse, ApiNotFoundResponse, 
  ApiOperation, ApiParam, ApiTags, 
  ApiUnauthorizedResponse 
} from '@nestjs/swagger';
import { Cache } from 'cache-manager';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DeviceDto } from 'src/devices/device.dto';
import { UserDto, RegisterDeviceDto, UpdateUserDto, CreateUserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('User')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  @Delete('devices/:eui')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({summary: "Allows authorized users to delete a device they registered"})
  @ApiParam({name: "EUI", description: "The device's unique identifier"})
  @ApiCreatedResponse({description: "The device details", type: DeviceDto})
  @ApiNotFoundResponse({description: "Device not registered with current user"})
  @ApiUnauthorizedResponse({description: "You aren't logged into your account"})
  public async unregisterDevice(@Req() req, @Param('eui') deviceEui: string) {
    const user: UserDto = req.user;
    const deletedObj = await this.userService.unregisterDevice(user.userId, deviceEui);
    if (deletedObj.count === 0) {
      throw new NotFoundException(`The user with the id: ${user.userId} is not registered to device: ${deviceEui}`);
    }
    return deletedObj.device;
  }

  @Get('devices')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({summary: "Allows authorized users to view their registered devices"})
  @ApiCreatedResponse({description: "The user's devices", type: DeviceDto, isArray: true})
  @ApiUnauthorizedResponse({description: "You aren't logged into your account"})
  public async findAllDevices(@Req() req): Promise<DeviceDto[]> {
    const user: UserDto = req.user;
    const devices = await this.userService.findAllDevices(user.userId);
    return devices;
  }

  @Post('devices')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({summary: "Allows authorized users to register a new device"})
  @ApiBody({type: RegisterDeviceDto})
  @ApiCreatedResponse({description: "The device eui", type: RegisterDeviceDto})
  @ApiUnauthorizedResponse({description: "You aren't logged into your account"})
  @UsePipes(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true}))
  public async registerDevice(@Req() req, @Body() registerDeviceDto: RegisterDeviceDto) {
    const user: UserDto = req.user;
    await this.userService.registerDevice(user.userId, registerDeviceDto.device_eui);
    return registerDeviceDto;
  }

  @Post()
  @ApiOperation({summary: "Allows users to create an account"})
  @ApiBody({type: CreateUserDto})
  @ApiCreatedResponse({description: "The new user's Id", type: Number})
  @ApiBadRequestResponse({description: "A user with the provided username already exists"})
  @UsePipes(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true}))
  public async createUser(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    try {
      const userId = await this.userService.createUser(createUserDto);
      return userId;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Invalid username (already exists)');
      } else {
        throw error;
      }
    }
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({summary: "Allows authorized users to update their account"})
  @ApiCreatedResponse({description: "The updated user", type: UserDto})
  @ApiBadRequestResponse({description: "Body contains values besides the new username/password/email or username already exists"})
  @ApiUnauthorizedResponse({description: "You aren't logged into your account"})
  @UsePipes(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true}))
  public async updateUser(@Req() req, @Body() updateInfo: UpdateUserDto) {
    const user: UserDto = req.user;
    try {
      const updateAndCount = await this.userService.updateUser(user, updateInfo);
      return updateAndCount.user;
    }
    catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Invalid username (already exists)');
      }
      else {
        throw error;
      }
    }
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({summary: "Allows authorized users to delete their account"})
  @ApiCreatedResponse({description: "The deleted user", type: UserDto})
  @ApiNotFoundResponse({description: "User with the given id not found"})
  @ApiUnauthorizedResponse({description: "You aren't logged into your account"})
  public async deleteUser(@Req() req: any): Promise<UserDto> {
    const userId = req.user.userId;
    const deletedUser = await this.userService.deleteUser(userId);
    if (deletedUser.count === 0) {
      throw new NotFoundException(`The user with the id: ${userId} does not exist`);
    }
    const bearer = req.headers.authorization;
    const jwt = bearer.replace('Bearer ', '');
    this.cacheManager.set(jwt, jwt, 36000000);
    return deletedUser.user;
  }
}