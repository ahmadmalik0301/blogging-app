import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import express from 'express';
import { CreateUserDto, LoginDto } from './dto/local-strategy.dto';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user';
import { GoogleGuard } from './Guards/google-guard';
import { GetCookie } from './decorators/cookie-decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  localSignup(@Body() createUserDto: CreateUserDto) {
    return this.authService.localSignup(createUserDto);
  }

  @HttpCode(200)
  @Post('/login')
  async localLogin(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.localLogin(loginDto);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      signed: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { accessToken };
  }

  @Post('/refresh')
  async refreshToken(
    @GetCookie('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refreshToken(refreshToken);

    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      signed: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }

  @Post('/logout')
  async logout(
    @GetCookie('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    await this.authService.logout(refreshToken);

    res.clearCookie('refresh_token');

    return { message: 'Logged out successfully' };
  }

  @Get('google/login')
  @UseGuards(GoogleGuard)
  async googleAuth() {}

  @Get('google/redirect')
  @UseGuards(GoogleGuard)
  async googleAuthRedirect(
    @GetUser() user: any,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const {
      user: existingUser,
      accessToken,
      refreshToken,
    } = await this.authService.googleLogin(user);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      signed: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken, user: existingUser };
  }
}
