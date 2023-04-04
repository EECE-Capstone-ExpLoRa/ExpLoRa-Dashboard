import { 
  Body, 
  Controller,
  Post,
  UsePipes, 
  ValidationPipe 
} from '@nestjs/common';

import { LiveDto } from './live.dto';
import { LiveService } from './live.service';

@Controller('live')
export class LiveController {
  constructor(private readonly liveService: LiveService) {}

  @Post()
  //@UsePipes(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true}))
  public async addData(@Body() liveDto: LiveDto) {
    console.log("From live");
    console.log(liveDto);
  }
}