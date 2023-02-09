import { Inject, Injectable } from '@nestjs/common';
import { InjectKnex } from 'nestjs-knex/dist/knex.decorators';
import { Knex } from 'nestjs-knex/dist/knex.interfaces';
import { UserDto, UserDeviceDto, UpdateUserDto, CreateUserDto, CountAndUser, FullUser } from './user.dto';
import { DeviceAndCount, DeviceDto } from 'src/devices/device.dto';
import { hashPassword } from 'src/utils/bcrypt';
import { DeviceService } from 'src/devices/device.service';

@Injectable()
export class UserService {
  constructor(@InjectKnex() private readonly knex: Knex, @Inject(DeviceService) private readonly deviceService: DeviceService) {}

  public async findUserById(userId: number): Promise<UserDto> {
    const user = await this.knex<UserDto>('user')
      .select('user_id', 'username', 'email')
      .where('user_id', userId)
      .first();
    return user;
  }

  public async findUserByUsername(username: string): Promise<UserDto> {
    const user = await this.knex<UserDto>('user')
      .select('user_id', 'username', 'email')
      .where('username', username)
      .first();
    return user;
  }

  public async findAllUsers(): Promise<UserDto[]> {
    const users = await this.knex<UserDto>('user')
      .select('user_id', 'username', 'email');
    return users;
  }

  public async createUser(createUserDto: CreateUserDto): Promise<number> {
    const password = await hashPassword(createUserDto.password);
    const hashedUser = { ...createUserDto, password};
    const userId = await this.knex<UserDto>('user')
      .insert(hashedUser);
    return userId[0];
  }

  public async updateUser(user: UserDto, updateInfo: UpdateUserDto): Promise<CountAndUser>{
    if (updateInfo.newPassword) {
      const hashedPassword = await hashPassword(updateInfo.newPassword);
      updateInfo = {
        ...updateInfo,
        newPassword: hashedPassword
      }
    }
    
    const fullUser: CreateUserDto = await this.knex<CreateUserDto>('user')
    .where('user_id', user.userId)
    .first();

    const updatedUser: CreateUserDto = {
      username: updateInfo.newUsername? updateInfo.newUsername : user.username,
      password: updateInfo.newPassword? updateInfo.newPassword : fullUser.password,
      email: updateInfo.newEmail? updateInfo.newEmail : fullUser.email
    }

    const updateCount = await this.knex<CreateUserDto>('user').where('user_id', user.userId).update(updatedUser);
    const newUser: UserDto = await this.findUserById(user.userId);
    return {
      user: newUser,
      count: updateCount

    }
  }

  public async deleteUser(userId: number): Promise<CountAndUser> {
    const user = await this.findUserById(userId);
    const count = await this.knex<UserDto>('user')
      .where('user_id', userId)
      .del();
    return {user, count};
  }

  public async findAllDevices(userId: number): Promise<DeviceDto[]> {
    const devices = await this.knex<DeviceDto>('user_device')
      .join('device', 'user_device.device_eui', '=', 'device.device_eui')
      .select('device.device_eui', 'device.type', 'device.nickname')
      .where('user_device.user_id', userId);
    return devices;
  } 

  public async registerDevice(userId: number, deviceEui: string): Promise<void> {
    // find device (if not found, create a new entry)
    const device = await this.knex<DeviceDto>('device')
      .where('device_eui', deviceEui)
      .first();
    if (!device) {
      await this.knex<DeviceDto>('device')
        .insert(new DeviceDto(deviceEui));
    }

    // register the user with the device
    await this.knex<UserDeviceDto>('user_device')
      .insert(new UserDeviceDto(userId, deviceEui));
  }

  public async unregisterDevice(userId: number, deviceEui: string) {
    const device: DeviceDto = await this.deviceService.findOne(deviceEui);
    const deleteCount = await this.knex<UserDeviceDto>('user_device')
      .where('user_id', userId)
      .andWhere('device_eui', deviceEui)
      .del();
    const deviceObj: DeviceAndCount = {
      device: device,
      count: deleteCount
    }
    return deviceObj;
  }

  public async findFullUser(username: string) {
    const user = await this.knex('user')
    .where('username', username)
    .first();
    const fullUser: FullUser = {
      userId: user.user_id,
      email: user.email,
      username: user.username,
      password: user.password
    }
    return fullUser;
  }
}