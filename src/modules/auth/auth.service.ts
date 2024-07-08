import { MailerService } from '@nestjs-modules/mailer';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Cache } from 'cache-manager';
import * as crypto from 'crypto';
import { Request, Response } from 'express';
import { Repository } from 'typeorm';
import { CreateUserDto, SignInUser, VerifyResDto } from '../../dtoes/user.dto';
import { User } from '../../entities/user.entity';
import { renderTemplate } from '../../mailer/template';
import { IPayload } from '../../types';
import { ResetPasswordDto } from './../../dtoes/user.dto';
import { OtpService } from './otp.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwt: JwtService,
    private readonly mailer: MailerService,
    private readonly otpService: OtpService,
    @Inject(CACHE_MANAGER) private readonly redis: Cache,
  ) {}
  async register(dto: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (user) {
      throw new ConflictException('User with this email is already registered');
    }
    const u = await this.userRepository.findOne({
      where: { username: dto.username },
    });
    if (u) {
      throw new ConflictException('This username is already taken');
    }
    try {
      const { password, ...rest } = dto;

      if (!password || typeof password !== 'string') {
        throw new Error('Password is missing or invalid');
      }
      const hashedPassword = bcrypt.hashSync(password, 12);
      const user = await this.userRepository.save({
        ...rest,
        password: hashedPassword,
        profileImg: {
          type: 'default',
          fileId: '6645de4388c257da336f10ec',
          url: 'https://ik.imagekit.io/lhvoxkb7i/users/default-user_kHqfmeEDX',
        },
        bio: '',
      });
      const payload = { id: user.id };
      return payload;
    } catch (error) {
      throw new Error('Failed to register user: ' + error.message);
    }
  }
  async login(dto: SignInUser) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (!user) {
      throw new BadRequestException('Invalid user credentials');
    }
    if (bcrypt.compareSync(dto.password, user.password)) {
      return { id: user.id };
    } else {
      throw new BadRequestException('Invalid user credentials');
    }
  }

  async refreshUser(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies['refresh_token'];

      const payload: IPayload = this.jwt.verify(refreshToken);

      if (!payload) {
        return res.status(401).send({ message: 'Unauthenticated.' });
      }

      const expiration = Math.floor(Date.now() / 1000) + 2 * 60 * 60; // 2 hours
      payload.exp = expiration;

      const access_token = this.jwt.sign(payload);

      res.cookie('access_token', access_token, {
        secure: true,
        maxAge: 2 * 60 * 60 * 1000,
      });

      res.status(200).send({ message: 'refresh success.' });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  }

  async sendOtp(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const otp = await this.otpService.generateOtp(email);
    await this.mailer
      .sendMail({
        from: `anonymousmrx55@mail.ru`,
        to: email,
        subject: `Your reset-password code is [${otp}]`,
        html: renderTemplate(user.username, otp),
      })
      .catch((err) => {
        console.log(err);

        throw new InternalServerErrorException(err);
      });
    return {
      message: 'Code is sent to ' + email,
    };
  }

  async verifyOtp(dto: VerifyResDto) {
    const isValid = await this.otpService.validateOtp(dto.email, dto.code);
    if (!isValid) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const token = crypto.randomBytes(20).toString('hex');
    await this.redis.set(`reset:${dto.email}`, token, 10 * 60 * 1000);

    return { token };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const storedToken = await this.redis.get(`reset:${dto.email}`);
    if (!storedToken || storedToken !== dto.token) {
      throw new BadRequestException('Invalid or expired token');
    }
    const hashedPassword = bcrypt.hashSync(dto.newPassword, 12);
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    user.password = hashedPassword;
    await this.redis.del('reset:' + dto.email);
    await this.userRepository.save(user);
    return new HttpException('Password changed successfully', 202);
  }

  async logout(res: Response) {
    res.cookie('access_token', '', { maxAge: 0 });
    res.cookie('refresh_token', '', { maxAge: 0 });
    return res.status(200).json({ message: 'Logged out successfully.' });
  }
}
