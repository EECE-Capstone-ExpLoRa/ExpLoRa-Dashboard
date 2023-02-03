import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TimestreamModule } from './timestream/timestream.module';

@Module({
  imports: [TimestreamModule, ConfigModule.forRoot({isGlobal: true})],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
