import { Controller, Get, Post, UseGuards, Request, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { LoginDto, UserDto } from './user/user.dto';

@Controller()
@ApiTags('Home')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('auth/login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({summary: "Allows users to login"})
  @ApiBody({type: LoginDto})
  @ApiCreatedResponse({description: "A JWT for authorized users", type: String})
  @ApiUnauthorizedResponse({description: "Unauthorized"})
  async login(@Request() req) { 
    //! Do we want to add a reroute here if it fails?
    const token = await this.authService.login(req.user);
    return token;
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({summary: "Allows authorized users to view their user details"})
  @ApiCreatedResponse({description: "Current user's user information", type: UserDto})
  @ApiUnauthorizedResponse({description: "Unauthorized"})
  getProfile(@Request() req) { 
    const user: UserDto = req.user;
    return user;
  }

  @Get('auth/logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({summary: "Allows authorized users to log out of their account"})
  @ApiCreatedResponse({description: "Current user's user information", type: UserDto})
  @ApiUnauthorizedResponse({description: "Unauthorized"})
  async logout(@Res({ passthrough: true }) response: Response) {
    console.log('Hasnt been written yet');
  }
}