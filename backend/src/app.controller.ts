import { Controller, Get, Post, UseGuards, Req, Inject, CACHE_MANAGER } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Cache } from 'cache-manager';
import { Request } from 'express';
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
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

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
  async login(@Req() req) { 
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
  getProfile(@Req() req) { 
    const user: UserDto = req.user;
    return user;
  }

  @Get('auth/logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({summary: "Allows authorized users to log out of their account"})
  @ApiCreatedResponse({description: "Current user's user information", type: UserDto})
  @ApiUnauthorizedResponse({description: "Unauthorized"})
  async logout(@Req() req: Request) {
    const bearer = req.headers.authorization;
    const jwt = bearer.replace('Bearer ', '');
    const decodedJwt: any = this.jwtService.decode(jwt);
    const expiresSeconds = new Date(decodedJwt.exp * 1000);
    await this.cacheManager.set(jwt, jwt, expiresSeconds.getMilliseconds());
    console.log(await this.cacheManager.store.keys());
  }
}