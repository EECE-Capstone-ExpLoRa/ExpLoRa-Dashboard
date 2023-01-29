import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TimestreamModule } from './timestream/timestream.module';

@Module({
  imports: [TimestreamModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
