import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KnexModule } from 'nestjs-knex';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TimestreamModule } from './timestream/timestream.module';
import { UserModule } from './user/user.module';
import { DeviceModule } from './devices/device.module';
import { config } from './config/config';
import { AuthModule } from './auth/auth.module';
import { DatabaseConfigService } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    }),
    KnexModule.forRootAsync({
      useClass: DatabaseConfigService
    }),
    UserModule,
    DeviceModule,
    TimestreamModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
