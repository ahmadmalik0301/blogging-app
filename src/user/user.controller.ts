import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
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
  resetPassword(@Body() resetDto: ResetPasswordDto) {
    return this.userService.resetPassword(resetDto);
  }
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@GetUser() user: any) {
    return {
      status: 'success',
      message: 'User profile retrieved',
      data: {
        user,
      },
    };
  }
}
