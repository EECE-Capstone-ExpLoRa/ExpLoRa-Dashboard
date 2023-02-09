import { 
  BadRequestException,
  Body, Controller, Delete, 
  Get,
  NotFoundException, 
  Param, ParseIntPipe, Post, Put, 
  Req, 
  UseGuards, 
  UsePipes, 
  ValidationPipe 
} from '@nestjs/common';
import { 
  ApiBadRequestResponse, 
  ApiBearerAuth, ApiBody, 
  ApiCreatedResponse, ApiNotFoundResponse, 
  ApiOperation, ApiParam, ApiTags, 
  ApiUnauthorizedResponse 
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DeviceDto } from 'src/devices/device.dto';
import { UserDto, RegisterDeviceDto, UpdateUserDto, CreateUserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Get('username/:username')
  @ApiOperation({summary: "Test endpoint for getting users by username"})
  @ApiParam({name: "username", description: "The user's username"})
  @ApiCreatedResponse({description: "The Queried user", type: UserDto})
  @ApiNotFoundResponse({description: "User with the given username not found"})
  public async findUserByUsername(@Param('username') username: string): Promise<UserDto> {
    const user = await this.userService.findUserByUsername(username);
    if (!user) {
      throw new NotFoundException(`User with the username: ${username} not found`);
    }
    return user;
  }


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

  @Post('devices') //Do we want to add optional arugments (nickname and type) I think type at least should be required
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

  @Get(':id')
  @ApiOperation({summary: "Test enpoint for getting users by id"})
  @ApiNotFoundResponse({description: "User with the given Id not found"})
  @ApiParam({name: "id", description: "The user's Id"})
  @ApiCreatedResponse({description: "The Queried user", type: UserDto})
  public async findUserById(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    const user = await this.userService.findUserById(id);
    if (!user) {
      throw new NotFoundException(`The user with the id: ${id} does not exist`);
    }
    return user;
  }

  @Post() // should this also include an optional eui number?
  @ApiOperation({summary: "Allows users to create an account"})
  @ApiBody({type: CreateUserDto})
  @ApiCreatedResponse({description: "The new user's Id", type: Number})
  @ApiBadRequestResponse({description: "A user with the provided username already exists"})
  @UsePipes(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true}))
  public async createUser(@Body() createUserDto: CreateUserDto) {
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

  @Get()
  @ApiOperation({summary: "Test endpoint for getting all users"})
  @ApiCreatedResponse({description: "List of Users", type: UserDto, isArray: true})
  public async findAllUsers(): Promise<UserDto[]> {
    return this.userService.findAllUsers();
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({summary: "Allows authorized users to update their account"})
  @ApiCreatedResponse({description: "The updated user", type: UserDto})
  @ApiBadRequestResponse({description: "Body contains values besides the new username/password or username already exists"})
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
    return deletedUser.user;
  }
}