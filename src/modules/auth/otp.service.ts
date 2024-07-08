// src/modules/auth/otp.service.ts
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { getRandomSixDigitNumber } from '../../utils/generateRandomNumber';

@Injectable()
export class OtpService {
  constructor(@Inject(CACHE_MANAGER) private readonly redis: Cache) {}

  async generateOtp(email: string): Promise<string> {
    const otp = getRandomSixDigitNumber();
    await this.redis.set(`otp:${email}`, otp, 10 * 60 * 1000); // OTP valid for 10 minutes
    return otp;
  }

  async validateOtp(email: string, otp: string): Promise<boolean> {
    const storedOtp = await this.redis.get(`otp:${email}`);
    if (storedOtp && storedOtp === otp) {
      await this.redis.del(`otp:${email}`);
      return true;
    }
    return false;
  }
}
