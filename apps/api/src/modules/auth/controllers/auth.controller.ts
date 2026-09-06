import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service.js';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard.js';
import { JwtRefreshGuard } from '../../../common/guards/jwt-refresh.guard.js';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';
import { ApiMessage } from '../../../common/decorators/api-message.decorator.js';
import type { IAuthenticatedUser } from '../../../common/decorators/current-user.decorator.js';
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyEmailDto,
} from '../dto/auth.dto.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiMessage(
    'Registration successful. Please check your email to verify your account.',
  )
  async register(@Body() dto: RegisterDto) {
    const result = await this.authService.register(dto);
    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiMessage('Login successful')
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto);
    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiMessage('Logged out successfully')
  async logout(@CurrentUser() user: IAuthenticatedUser) {
    await this.authService.logout(user.id);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @ApiMessage('Tokens refreshed successfully')
  async refresh(
    @CurrentUser() user: IAuthenticatedUser & { refreshToken: string },
  ) {
    const tokens = await this.authService.refreshTokens(
      user.id,
      user.refreshToken,
    );
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiMessage('Email verified successfully')
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    await this.authService.verifyEmail(dto.token);
  }

  @Post('resend-verification')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiMessage('Verification email sent successfully')
  async resendVerification(@CurrentUser() user: IAuthenticatedUser) {
    await this.authService.resendVerificationEmail(user.id);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiMessage(
    'If an account with that email exists, a password reset link has been sent.',
  )
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.requestPasswordReset(dto.email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiMessage(
    'Password reset successfully. Please log in with your new password.',
  )
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.token, dto.password);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiMessage('Authenticated')
  async getMe(@CurrentUser() user: IAuthenticatedUser) {
    const safeUser = await this.authService.getMe(user.id);
    return safeUser;
  }
}
