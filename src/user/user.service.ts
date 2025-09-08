import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async changePassword(user: any, changePassDto: ChangePasswordDto) {
    const { oldPassword, newPassword, confirmPassword } = changePassDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!existingUser) {
      throw new UnauthorizedException('User not found');
    }

    if (existingUser.provider === 'GOOGLE') {
      throw new BadRequestException(
        'You signed up with Google. Please change your password in your Google account.',
      );
    }

    const validOldPassword = await argon.verify(
      existingUser.password!,
      oldPassword,
    );
    if (!validOldPassword) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    const isSameAsOld = await argon.verify(existingUser.password!, newPassword);
    if (isSameAsOld) {
      throw new BadRequestException(
        'New password cannot be the same as the old password',
      );
    }

    if (newPassword !== confirmPassword) {
      throw new BadRequestException(
        'New password and confirm password do not match',
      );
    }

    const hashedPassword = await argon.hash(newPassword);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, refreshToken: null },
    });

    return { message: 'Password changed successfully' };
  }
}
