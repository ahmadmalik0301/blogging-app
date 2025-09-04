import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateUserDto, LoginDto, RefreshDto } from './dto/local-strategy.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authSerive: AuthService) {}

  @Post('/signup')
  localSignup(@Body() createUserDto: CreateUserDto) {
    return this.authSerive.localSignup(createUserDto);
  }
  @HttpCode(200)
  @Post('/login')
  localLogin(@Body() loginDto: LoginDto) {
    return this.authSerive.localLogin(loginDto);
  }
  @Post('/refresh')
  refreshToken(@Body() refreshDto: RefreshDto) {
    return this.authSerive.refreshToken(refreshDto);
  }
  @Post('/logout')
  logout(@Body() refreshDto: RefreshDto) {
    return this.authSerive.logout(refreshDto);
  }
}
