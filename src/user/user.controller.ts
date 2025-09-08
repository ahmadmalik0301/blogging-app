import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from 'src/auth/decorators/get-user';
import { JwtAuthGuard } from 'src/auth/Guards/jwt-guard';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  changePassword(
    @GetUser() user: any,
    @Body() changePassDto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(user, changePassDto);
  }
}
