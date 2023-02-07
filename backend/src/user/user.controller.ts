import { 
  BadRequestException,
  Body, Controller, Delete, 
  Get,
  NotFoundException, 
  Param, ParseIntPipe, Post, Put, 
  UsePipes, 
  ValidationPipe 
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { DeviceDto } from 'src/devices/device.dto';
import { UserDto, RegisterDeviceDto, UpdateUserDto, CreateUserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Get(':id')
  @ApiNotFoundResponse({description: "User with the given Id not found"})
  @ApiParam({
    name: "id",
    description: "The user's Id"
  })
  @ApiCreatedResponse({
    description: "The Queried user",
    type: UserDto
  })
  public async findUserById(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    const user = await this.userService.findUserById(id);
    if (!user) {
      throw new NotFoundException(`The user with the id: ${id} does not exist`);
    }
    return user;
  }

  @Get('username/:username')
  @ApiNotFoundResponse({description: "User with the given username not found"})
  @ApiParam({
    name: "username",
    description: "The user's username"
  })
  @ApiCreatedResponse({
    description: "The Queried user",
    type: UserDto
  })
  public async findUserByUsername(@Param('username') username: string): Promise<UserDto> {
    const user = await this.userService.findUserByUsername(username);
    if (!user) {
      throw new NotFoundException(`User with the username: ${username} not found`);
    }
    return user;
  }

  @Get()
  @ApiCreatedResponse({
    description: "List of Users",
    type: UserDto,
    isArray: true
  })
  public async findAllUsers(): Promise<UserDto[]> {
    return this.userService.findAllUsers();
  }

  @Post()
  @UsePipes(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true}))
  @ApiBody({
    type: CreateUserDto
  })
  @ApiBadRequestResponse({description: "A user with the provided username already exists"})
  @ApiCreatedResponse({description: "The new user's Id", type: Number})
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

  @Delete(':id')
  @ApiNotFoundResponse({description: "User with the given id not found"})
  @ApiParam({
    name: "id",
    description: "The user's id"
  })
  @ApiCreatedResponse({
    description: "The deleted user",
    type: UserDto
  })
  public async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<UserDto> { // I'm assuming this would have to be within a validate path?
    const deletedUser = await this.userService.deleteUser(id);
    if (deletedUser.deleteCount === 0) {
      throw new NotFoundException(`The user with the id: ${id} does not exist`);
    }
    return deletedUser.user;
  }

  @Put(':id')
  @ApiParam({
    name: "id",
    description: "The user's id"
  })
  @ApiBody({
    type: UpdateUserDto
  })
  @ApiCreatedResponse({
    description: "The updated user object",
    type: UserDto
  })
  @ApiNotFoundResponse({description: "User with the given id not found"})
  @ApiBadRequestResponse({description: "A user with the provided username already exists"})
  public async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true})) updateUserDto: UpdateUserDto
  ): Promise<number> { // A user should be able to change their password right? on top of that should we check the password to update user?
    try {
      const updateCount = await this.userService.update(id, updateUserDto);
      if (updateCount === 0) {
        throw new NotFoundException(`The user with the id: ${id} does not exist`);
      }
      return updateCount;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Invalid username (already exists)')
      } else {
        throw error;
      }
    }
  }

  @Get(':id/devices') // Should fail if the id doesn't exist
  public async findAllDevices(
    @Param('id', ParseIntPipe) userId: number
  ): Promise<DeviceDto[]> {
    const devices = await this.userService.findAllDevices(userId);
    return devices;
  }

  @Post(':id/devices') //should fail if the id doesn't exist or that id has been registerd with that user before (can a device be registered with multiple users?)
  public async registerDevice(
    @Param('id', ParseIntPipe) userId: number,
    @Body(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true})) registerDeviceDto: RegisterDeviceDto
  ): Promise<void> {
    await this.userService.registerDevice(userId, registerDeviceDto.device_eui);
  }

  @Delete(':id/devices/:eui') //should fail if the user or id doesn't exist
  public async unregisterDevice(
    @Param('id', ParseIntPipe) userId: number,
    @Param('eui') deviceEui: string,
  ): Promise<number> {
    const deleteCount = await this.userService.unregisterDevice(userId, deviceEui);
    if (deleteCount === 0) {
      throw new NotFoundException(`The user with the id: ${userId} is not registered to device: ${deviceEui}`);
    }
    return deleteCount;
  }
}