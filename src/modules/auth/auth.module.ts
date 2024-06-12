import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
// configs
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import redisConfig from 'src/configs/redis.config';
import { OtpService } from './otp.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, OtpService],
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({ global: true, secret: 'my_secret-382@_key.' }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'boboxonusanov@gmail.com',
          pass: 'bnhn xbkb zuzy lawe',
        },
      },
    }),
    CacheModule.register<RedisClientOptions>(redisConfig()),
  ],
})
export class AuthModule {}
//redis-sasl-pass = 6q4vW6YdOPW9UGCSm82TR43gVTrY7iWF
//redis-sasl-user = mc-QtskZ
