import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import {
  CreateUserDto,
  ResetPasswordDto,
  SignInUser,
  VerificationDto,
  VerifyResDto,
} from 'src/dtoes/user.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwt: JwtService,
  ) {}
  @Post('register')
  @HttpCode(201)
  @UsePipes(new ValidationPipe())
  @ApiBody({ required: true, type: CreateUserDto })
  async register(@Body() body: CreateUserDto, @Res() res: Response) {
    const payload = await this.authService.register(body);
    const access_token = this.jwt.sign(payload, { expiresIn: '2h' });
    const refresh_token = this.jwt.sign(payload, { expiresIn: '3d' });
    res.cookie('access_token', access_token, {
      secure: true,
      maxAge: 2 * 60 * 60 * 1000,
    });
    res.cookie('refresh_token', refresh_token, {
      secure: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    res.json({
      message: 'Registered successfully.',
      access_token,
      refresh_token,
    });
  }

  @Post('login')
  @HttpCode(201)
  @UsePipes(new ValidationPipe())
  @ApiBody({ required: true, type: SignInUser })
  async login(@Body() body: SignInUser, @Res() res: Response) {
    const payload = await this.authService.login(body);
    const access_token = this.jwt.sign(payload, { expiresIn: '2h' });
    const refresh_token = this.jwt.sign(payload, { expiresIn: '3d' });
    res.cookie('access_token', access_token, {
      secure: true,
      maxAge: 2 * 60 * 60 * 1000,
    });
    res.cookie('refresh_token', refresh_token, {
      secure: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    res.json({
      message: 'Logged in successfully.',
      access_token,
      refresh_token,
    });
  }

  @Post('refresh')
  @HttpCode(200)
  refreshUserToken(@Req() req: Request, @Res() res: Response) {
    return this.authService.refreshUser(req, res);
  }

  @Post('send-otp')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @ApiBody({ description: 'Email', type: VerificationDto })
  sendOtp(@Body() dto: VerificationDto) {
    return this.authService.sendOtp(dto.email);
  }

  @Post('verify-otp')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @ApiBody({
    description: 'OTP verification to reset pass',
    type: VerifyResDto,
  })
  async verifiyOtp(@Body() dto: VerifyResDto) {
    return this.authService.verifyOtp(dto);
  }

  @Post('reset-password')
  @HttpCode(202)
  @UsePipes(new ValidationPipe())
  @ApiBody({
    description: 'Reset pass',
    type: ResetPasswordDto,
  })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res() res: Response) {
    return this.authService.logout(res);
  }
}
