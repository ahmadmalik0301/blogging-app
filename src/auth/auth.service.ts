import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, LoginDto } from './dto/local-strategy.dto';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { newUserHtml } from 'src/email/utils/email-template';
import { NotificationGateway } from 'src/gateway/notification-gateway';
import { Provider } from './enums/provider.enum';

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
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (existingUser?.provider === Provider.GOOGLE) {
      throw new ConflictException(
        'User with this Email already exists. Kindly use Google signup method',
      );
    }

    const hash = await argon.hash(createUserDto.password);
    const dob = createUserDto.dateOfBirth ? new Date(createUserDto.dateOfBirth) : null;

    const user = await this.prisma.user.create({
      data: { ...createUserDto, password: hash, dateOfBirth: dob, provider: Provider.LOCAL },
    });

    const { password, ...safeUser } = user;
    const fullName = `${user.firstName} ${user.lastName}`;

    //await this.emailQueue.add('sendEmail', {
    // to: this.config.get<string>('ADMIN_EMAIL'),
    //subject: 'New User joined!',
    // html: newUserHtml(fullName, user.email),
    //});
    this.notiService.sendUserSignupNotification(fullName, user.email);

    return {
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          provider: user.provider,
        },
      },
    };
  }

  async localLogin(loginDto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: loginDto.email, provider: Provider.LOCAL },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await argon.verify(user.password!, loginDto.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const accessToken = await this.signAccessToken(user);
    const refreshToken = await this.signRefreshToken(user);

    await this.prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

    return {
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          provider: user.provider,
        },
        accessToken,
        refreshToken,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException('No refresh token provided');

    try {
      const payload: any = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.get<string>('JWT_SECRET'),
      });
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Refresh token mismatch');
      }

      const newAccessToken = await this.signAccessToken(user);
      const newRefreshToken = await this.signRefreshToken(user);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: newRefreshToken },
      });

      return {
        status: 'success',
        message: 'Token refreshed successfully',
        data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException('No refresh token provided');
    try {
      const payload: any = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.get<string>('JWT_SECRET'),
      });
      await this.prisma.user.update({ where: { id: payload.sub }, data: { refreshToken: null } });

      return { status: 'success', message: 'Logged out successfully' };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async googleLogin(user: any) {
    if (!user) throw new UnauthorizedException('Google authentication failed');

    let existingUser = await this.prisma.user.findUnique({ where: { email: user.email } });
    const [firstName, lastName] = user.name.split(' ');

    if (!existingUser) {
      existingUser = await this.prisma.user.create({
        data: {
          email: user.email,
          firstName,
          lastName,
          provider: Provider.GOOGLE,
          googleID: user.googleID,
        },
      });
      await this.emailQueue.add('sendEmail', {
        to: this.config.get<string>('ADMIN_EMAIL'),
        subject: 'New User joined!',
        html: newUserHtml(user.name, user.email),
      });
    } else if (existingUser.provider === Provider.LOCAL) {
      throw new ConflictException('User exists. Please use Email & Password method');
    }
    const refreshToken = await this.signRefreshToken(existingUser);

    await this.prisma.user.update({ where: { id: existingUser.id }, data: { refreshToken } });

    return {
      status: 'success',
      message: 'Google login successful',
      data: {
        refreshToken,
      },
    };
  }

  // --- helper methods ---
  private async signAccessToken(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role, provider: user.provider };
    return this.jwt.signAsync(payload, {
      secret: this.config.get<string>('JWT_SECRET'),
      expiresIn: '15m',
    });
  }

  private async signRefreshToken(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role, provider: user.provider };
    return this.jwt.signAsync(payload, {
      secret: this.config.get<string>('JWT_SECRET'),
      expiresIn: '7d',
    });
  }
}
