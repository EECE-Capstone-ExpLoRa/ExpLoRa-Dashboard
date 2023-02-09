import { Module } from '@nestjs/common';
import { DeviceModule } from 'src/devices/device.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [DeviceModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
