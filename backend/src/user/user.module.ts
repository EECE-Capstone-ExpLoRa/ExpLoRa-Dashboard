import { Module } from '@nestjs/common';
import { DeviceModule } from 'src/devices/device.module';
import { DevUserController } from './dev.user.controller';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [DeviceModule],
  controllers: [UserController, DevUserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
