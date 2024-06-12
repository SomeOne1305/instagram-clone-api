import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

// user.dto.ts
export class CreateUserDto {
  @ApiProperty({ required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username must contain only letters, numbers, and underscores',
  })
  username: string;

  @ApiProperty({ required: true })
  @MinLength(8)
  password: string;
}

export class UpdateUserDto {
  @ApiProperty()
  fullName?: string;

  @ApiProperty()
  bio?: string;
}

export class ChangePassDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  prevPassword: string;
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}

export class UpdateUsernameDto {
  @ApiProperty()
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username must contain only letters, numbers, and underscores',
  })
  username?: string;
}

export class SignInUser {
  @ApiProperty({ required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  password: string;
}

export class FileDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsNotEmpty()
  file: any;
}

export class VerificationDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
export class VerifyResDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNumberString()
  code: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  token: string;
}

export class SearchUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Search query for username or full name' })
  query?: string;
}
