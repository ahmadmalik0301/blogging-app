import { Body, Controller, Param, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from 'src/auth/decorators/get-user';
import { JwtAuthGuard } from 'src/auth/Guards/jwt-guard';
import { ChangePasswordDto, EmailDto, ResetPasswordDto } from './dto/change-password.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  changePassword(@GetUser() user: any, @Body() changePassDto: ChangePasswordDto) {
    return this.userService.changePassword(user, changePassDto);
  }
  @Post('request-reset-password')
  requestResetPassword(@Body() emailDto: EmailDto) {
    console.log(emailDto);
    return this.userService.requestResetPassword(emailDto.email);
  }
  @Post('reset-password')
  resetPassword(@Query('token') token: string, @Body() resetDto: ResetPasswordDto) {
    return this.userService.resetPassword(token, resetDto.newPassword);
  }
}
