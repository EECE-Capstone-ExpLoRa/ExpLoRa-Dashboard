import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KnexModule } from 'nestjs-knex';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DeviceModule } from './devices/device.module';
import { config } from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    }),
    KnexModule.forRootAsync({
      useFactory: 
      async (configService: ConfigService) => ({
        config: configService.get('database'),
        pool: { min: 0, max: 7 }
      }),
      inject: [ConfigService]
    }),
    UserModule,
    DeviceModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
