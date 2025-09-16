import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChangePasswordDto, ResetPasswordDto } from './dto/change-password.dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
    @InjectQueue('email') private readonly emailQueue: Queue,
  ) {}

  async changePassword(user: any, changePassDto: ChangePasswordDto) {
    const { oldPassword, newPassword, confirmPassword } = changePassDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { id: user.id },
    });

    if (existingUser?.provider === 'GOOGLE') {
      throw new BadRequestException(
        'You signed up with Google. Please change your password in your Google account.',
      );
    }

    const validOldPassword = await argon.verify(existingUser?.password!, oldPassword);
    if (!validOldPassword) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    const isSameAsOld = await argon.verify(existingUser?.password!, newPassword);
    if (isSameAsOld) {
      throw new BadRequestException('New password cannot be the same as the old password');
    }

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('New password and confirm password do not match');
    }

    const hashedPassword = await argon.hash(newPassword);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, refreshToken: null },
    });

    return { status: 'success', message: 'Password changed successfully' };
  }
  async requestResetPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new BadRequestException('No such user exists');
    }
    if (user.provider === 'GOOGLE') {
      throw new BadRequestException('You signed up with Google. Please use Google login.');
    }
    const resetToken = await this.jwtService.signAsync(
      { sub: user?.id },
      { expiresIn: '10m', secret: this.config.get('JWT_SECRET') },
    );
    // await this.emailQueue.add('sendEmail', {
    //   to: user.email,
    //   subject: 'Password Reset',
    //   html: `<p>Your password reset token is: ${this.config.get('FRONTEND_URL')}/user/reset-password?token=${resetToken}</p>`,
    // });
    console.log(`${this.config.get('FRONTEND_URL')}/user/reset-password?token=${resetToken}`);
    return { message: 'Password reset email sent' };
  }
  async resetPassword(resetDto: ResetPasswordDto) {
    try {
      if (resetDto.newPassword !== resetDto.confirmPassword) {
        throw new BadRequestException('Passwords do not match');
      }

      const payload = await this.jwtService.verifyAsync(resetDto.token, {
        secret: this.config.get('JWT_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      const hashedPassword = await argon.hash(resetDto.newPassword);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword, refreshToken: null },
      });

      return { message: 'Password reset successfully' };
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }
  }
}
