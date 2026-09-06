import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'Email address', example: 'user@example.com' })
  @IsEmail({}, { message: 'email must be a valid email address' })
  @MaxLength(255)
  email: string;

  @ApiProperty({ description: 'First name', example: 'Jane' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Doe' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  lastName: string;

  @ApiProperty({
    description: 'Password — min 8 chars, must contain upper, lower, and digit',
    example: 'SecurePass123',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'password must contain at least one uppercase letter, one lowercase letter, and one digit',
  })
  password: string;
}

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'email must be a valid email address' })
  email: string;

  @ApiProperty({ example: 'SecurePass123' })
  @IsString()
  @MinLength(1)
  password: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'email must be a valid email address' })
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ description: 'Password reset token from email' })
  @IsString()
  @MinLength(1)
  token: string;

  @ApiProperty({ description: 'New password' })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'password must contain at least one uppercase letter, one lowercase letter, and one digit',
  })
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({ description: 'JWT refresh token' })
  @IsString()
  @MinLength(1)
  refreshToken: string;
}

export class VerifyEmailDto {
  @ApiProperty({ description: 'Email verification token from email' })
  @IsString()
  @MinLength(1)
  token: string;
}
