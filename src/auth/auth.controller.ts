import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import express from 'express';
import { CreateUserDto, LoginDto } from './dto/local-strategy.dto';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user';
import { GoogleGuard } from './Guards/google-guard';
import { GetCookie } from './decorators/cookie-decorator';
import { SetRefreshTokenInterceptor } from './interceptors/set-refresh-token.interceptor';
import { ClearRefreshTokenInterceptor } from './interceptors/clear-refresh-token.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  localSignup(@Body() createUserDto: CreateUserDto) {
    return this.authService.localSignup(createUserDto);
  }

  @HttpCode(200)
  @Post('/login')
  @Post('/login')
  @UseInterceptors(SetRefreshTokenInterceptor)
  async localLogin(@Body() loginDto: LoginDto) {
    return await this.authService.localLogin(loginDto);
  }

  @Post('/refresh')
  @UseInterceptors(SetRefreshTokenInterceptor)
  async refreshToken(@GetCookie('refresh_token') refreshToken: string) {
    return await this.authService.refreshToken(refreshToken);
  }

  @Post('/logout')
  @UseInterceptors(ClearRefreshTokenInterceptor)
  async logout(@GetCookie('refresh_token') refreshToken: string) {
    await this.authService.logout(refreshToken);
    return { message: 'Logged out successfully' };
  }

  @Get('google/login')
  @UseGuards(GoogleGuard)
  async googleAuth() {}

  @Get('google/redirect')
  @UseGuards(GoogleGuard)
  @UseInterceptors(SetRefreshTokenInterceptor)
  async googleAuthRedirect(@GetUser() user: any) {
    const {
      user: existingUser,
      accessToken,
      refreshToken,
    } = await this.authService.googleLogin(user);
    return { accessToken, refreshToken, user: existingUser };
  }
}
