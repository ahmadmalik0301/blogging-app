import {
  ConflictException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, LoginDto, RefreshDto } from './dto/local-strategy.dto';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { newUserHtml } from 'src/email/utils/email-template';
import { NotificationGateway } from 'src/gateway/notification-gateway';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
    @InjectQueue('email') private readonly emailQueue: Queue,
    private notiService: NotificationGateway,
  ) {}

  async localSignup(createUserDto: CreateUserDto) {
    const hash = await argon.hash(createUserDto.password);
    const dob = new Date(createUserDto.dateOfBirth);

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hash,
        dateOfBirth: dob,
        provider: 'LOCAL',
      },
    });
    const { password, ...safeUser } = user;
    const name = user.firstName + ' ' + user.lastName;
    // await this.emailQueue.add('sendEmail', {
    //   to: this.config.get<string>('ADMIN_EMAIL'),
    //   subject: 'New User joined!',
    //   html: newUserHtml(name, user.email),
    // });
    console.log('Signup email job added to the queue');
    this.notiService.sendUserSignupNotification(name, user.email);
    return { user: safeUser };
  }
  async localLogin(loginDto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: loginDto.email,
        provider: 'LOCAL',
      },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid Credential');
    }
    const isMatch = await argon.verify(user.password!, loginDto.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid Credential');
    }
    const accessToken = await this.signAccessToken(
      user.id,
      user.email,
      user.role,
      user.provider,
    );
    const refreshToken = await this.signRefreshToken(
      user.id,
      user.email,
      user.role,
      user.provider,
    );
    const hashrefreshToken = await argon.hash(refreshToken);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return { accessToken, refreshToken };
  }
  async signAccessToken(
    userId: string,
    email: string,
    role: string,
    provider: string,
  ) {
    const payload = { sub: userId, email, role, provider };
    const secret = this.config.get<string>('JWT_SECRET');
    return await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });
  }
  async signRefreshToken(
    userId: string,
    email: string,
    role: string,
    provider: string,
  ) {
    const payload = { sub: userId, email, role, provider };
    const secret = this.config.get<string>('JWT_SECRET');
    return await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret,
    });
  }
  async refreshToken(refreshDto: RefreshDto) {
    const { refreshToken } = refreshDto;

    try {
      const payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.get<string>('JWT_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh request');
      }
      const isMatch = user.refreshToken === refreshToken;
      if (!isMatch) {
        throw new UnauthorizedException('Refresh token mismatch');
      }

      const newAccessToken = await this.signAccessToken(
        user.id,
        user.email,
        user.role,
        user.provider,
      );
      const newRefreshToken = await this.signRefreshToken(
        user.id,
        user.email,
        user.role,
        user.provider,
      );

      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: newRefreshToken },
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
  async logout(refreshDto: RefreshDto) {
    const { refreshToken } = refreshDto;

    try {
      const payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.get<string>('JWT_SECRET'),
      });

      await this.prisma.user.update({
        where: { id: payload.sub },
        data: { refreshToken: null },
      });
      return { message: 'Logged out successfully' };
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
  async googleLogin(user: any) {
    if (!user) {
      throw new UnauthorizedException('Google authentication failed');
    }

    let existingUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!existingUser) {
      existingUser = await this.prisma.user.create({
        data: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          provider: 'GOOGLE',
          googleID: user.googleID,
        },
      });
    } else {
      if (existingUser.provider === 'LOCAL') {
        throw new ConflictException(
          'A user with this email already exist. kindly use Email and password method',
        );
      }
    }
    const accessToken = await this.signAccessToken(
      existingUser.id,
      existingUser.email,
      existingUser.role,
      existingUser.provider,
    );
    const refreshToken = await this.signRefreshToken(
      existingUser.id,
      existingUser.email,
      existingUser.role,
      existingUser.provider,
    );
    await this.prisma.user.update({
      where: { id: existingUser.id },
      data: { refreshToken },
    });

    return { user: existingUser, accessToken, refreshToken };
  }
}
