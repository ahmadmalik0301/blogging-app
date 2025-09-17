import { Body, Controller, Get, HttpCode, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto, LoginDto } from './dto/local-strategy.dto';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user';
import { GoogleGuard } from './Guards/google-guard';
import { GetCookie } from './decorators/cookie-decorator';
import { SetRefreshTokenInterceptor } from './interceptors/set-refresh-token.interceptor';
import { ClearRefreshTokenInterceptor } from './interceptors/clear-refresh-token.interceptor';
import { ConfigService } from '@nestjs/config';
import { SetRefreshTokenAndRedirectInterceptor } from './interceptors/set-refresh-and-redirect.interceptor';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private config: ConfigService,
  ) {}

  @Post('/signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  localSignup(@Body() createUserDto: CreateUserDto) {
    return this.authService.localSignup(createUserDto);
  }

  @HttpCode(200)
  @Post('/login')
  @UseInterceptors(SetRefreshTokenInterceptor)
  @ApiOperation({ summary: 'Login user and set refresh token cookie' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns access token',
  })
  async localLogin(@Body() loginDto: LoginDto) {
    return await this.authService.localLogin(loginDto);
  }

  @Post('/refresh')
  @UseInterceptors(SetRefreshTokenInterceptor)
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({ status: 200, description: 'New access token issued' })
  async refreshToken(@GetCookie('refresh_token') refreshToken: string) {
    return await this.authService.refreshToken(refreshToken);
  }

  @Post('/logout')
  @UseInterceptors(ClearRefreshTokenInterceptor)
  @ApiOperation({ summary: 'Logout user and clear refresh token cookie' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(@GetCookie('refresh_token') refreshToken: string) {
    await this.authService.logout(refreshToken);
    return { message: 'Logged out successfully' };
  }

  @Get('google/login')
  @UseGuards(GoogleGuard)
  @ApiOperation({ summary: 'Google OAuth login' })
  async googleAuth() {}

  @Get('google/redirect')
  @UseGuards(GoogleGuard)
  @UseInterceptors(SetRefreshTokenAndRedirectInterceptor)
  @ApiOperation({ summary: 'Google OAuth redirect callback' })
  @ApiResponse({ status: 200, description: 'User authenticated with Google' })
  async googleAuthRedirect(@GetUser() user: any) {
    const frontendUrl = this.config.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    try {
      const response = await this.authService.googleLogin(user);
      return {
        refreshToken: response.data.refreshToken,
        redirectUrl: `${frontendUrl}/auth/success`,
      };
    } catch (err: any) {
      const errorMessage = encodeURIComponent(err.message || 'Google login failed');
      return {
        redirectUrl: `${frontendUrl}/auth/failure?error=${errorMessage}`,
      };
    }
  }
}
