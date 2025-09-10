import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { EmailModule } from './email/email.module';
import { BullModule } from '@nestjs/bullmq';
import { GatewayModule } from './gateway/gateway.module';
import { UserModule } from './user/user.module';
import { LikeModule } from './like/like.module';
import KeyvRedis, { Keyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
      },
    }),
    CacheModule.registerAsync({
      useFactory: async () => {
        return {
          stores: [
            new Keyv({
              store: new KeyvRedis('redis://localhost:6380'),
              ttl: 60_000,
            }),
          ],
        };
      },
      isGlobal: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    PostModule,
    EmailModule,
    GatewayModule,
    UserModule,
    LikeModule,
  ],
})
export class AppModule {}
