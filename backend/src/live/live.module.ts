import { HttpModule } from "@nestjs/axios";
import { Module } from '@nestjs/common';
import { LiveController } from './live.controller';
import { LiveService } from './live.service';

@Module({
  imports: [HttpModule],
  controllers: [LiveController],
  providers: [LiveService],
  exports: [LiveService],
})
export class LiveModule {}
