import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt-strategy';
import { BullModule } from '@nestjs/bullmq';
import { GatewayModule } from 'src/gateway/gateway.module';
import { GoogleStrategy } from './strategies/google-strategy';

@Module({
  imports: [
    JwtModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    BullModule.registerQueue({ name: 'email' }),
    GatewayModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy],
})
export class AuthModule {}
