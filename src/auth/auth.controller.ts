import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto, LoginDto, RefreshDto } from './dto/local-strategy.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user';
import { GoogleGuard } from './Guards/google-guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  localSignup(@Body() createUserDto: CreateUserDto) {
    return this.authService.localSignup(createUserDto);
  }
  @HttpCode(200)
  @Post('/login')
  localLogin(@Body() loginDto: LoginDto) {
    return this.authService.localLogin(loginDto);
  }
  @Post('/refresh')
  refreshToken(@Body() refreshDto: RefreshDto) {
    return this.authService.refreshToken(refreshDto);
  }
  @Post('/logout')
  logout(@Body() refreshDto: RefreshDto) {
    return this.authService.logout(refreshDto);
  }
  @Get('google/login')
  @UseGuards(GoogleGuard)
  async googleAuth() {}

  @Get('google/redirect')
  @UseGuards(GoogleGuard)
  async googleAuthRedirect(@GetUser() user: any) {
    return this.authService.googleLogin(user);
  }
}
