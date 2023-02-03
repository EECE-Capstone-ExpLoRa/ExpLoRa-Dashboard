import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KnexModule } from 'nestjs-knex';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DeviceModule } from './devices/device.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    KnexModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        config: {
          client: 'mysql2',
          version: '5.7',
          connection: {
            host: configService.get('MY_SQL_DB_HOST'),
            port: configService.get('MY_SQL_DB_PORT') as unknown as number,
            user : configService.get('MY_SQL_DB_USER'),
            password : configService.get('MY_SQL_DB_PASSWORD'),
            database : configService.get('MY_SQL_DB_DATABASE'),
          },
          pool: { min: 0, max: 7 }
        }
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
