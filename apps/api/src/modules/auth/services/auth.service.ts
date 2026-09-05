import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UsersRepository } from '../../users/repositories/users.repository.js';
import { MailService } from '../../mail/mail.service.js';
import {
  AppConflictException,
  AppUnauthorizedException,
  AppBadRequestException,
  AppNotFoundException,
} from '../../../common/exceptions/app.exceptions.js';
import type { AuthenticatedUser } from '../../../common/decorators/current-user.decorator.js';

const BCRYPT_ROUNDS = 12;
const RESET_TOKEN_EXPIRY_MS = 1000 * 60 * 60; // 1 hour

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  // ─── Registration ─────────────────────────────────────────────────────────

  async register(dto: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }) {
    const existing = await this.usersRepository.findByEmail(dto.email.toLowerCase());
    if (existing) {
      throw new AppConflictException(
        'An account with this email address already exists',
        'EMAIL_ALREADY_EXISTS',
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    const user = await this.usersRepository.create({
      email: dto.email.toLowerCase(),
      firstName: dto.firstName,
      lastName: dto.lastName,
      passwordHash,
      emailVerified: false,
      emailVerificationToken,
    });

    // Send verification email (fire-and-forget — do not fail registration if mail fails)
    this.mailService
      .sendEmailVerification(user.email, user.firstName, emailVerificationToken)
      .catch((err: unknown) => {
        this.logger.error(`Failed to send verification email to ${user.email}`, err);
      });

    this.logger.log(`New user registered: ${user.email}`);
    return this.generateTokens(user.id, user.email);
  }

  // ─── Login ────────────────────────────────────────────────────────────────

  async login(dto: { email: string; password: string }) {
    const user = await this.usersRepository.findByEmail(dto.email.toLowerCase());

    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new AppUnauthorizedException(
        'Invalid email or password',
        'INVALID_CREDENTIALS',
      );
    }

    this.logger.log(`User logged in: ${user.email}`);
    return this.generateTokens(user.id, user.email);
  }

  // ─── Logout ───────────────────────────────────────────────────────────────

  async logout(userId: string): Promise<void> {
    const user = await this.usersRepository.findById(userId);
    if (user) {
      user.hashedRefreshToken = null;
      await this.usersRepository.save(user);
    }
  }

  // ─── Refresh Token ────────────────────────────────────────────────────────

  async refreshTokens(
    userId: string,
    refreshToken: string,
  ) {
    const user = await this.usersRepository.findById(userId);

    if (!user || !user.hashedRefreshToken) {
      throw new AppUnauthorizedException('Session expired. Please log in again.', 'SESSION_EXPIRED');
    }

    const isTokenValid = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    if (!isTokenValid) {
      throw new AppUnauthorizedException('Invalid refresh token', 'INVALID_REFRESH_TOKEN');
    }

    return this.generateTokens(user.id, user.email);
  }

  // ─── Email Verification ───────────────────────────────────────────────────

  async verifyEmail(token: string): Promise<void> {
    const user = await this.usersRepository.findByEmailVerificationToken(token);
    if (!user) {
      throw new AppBadRequestException(
        'Invalid or expired verification token',
        'INVALID_VERIFICATION_TOKEN',
      );
    }

    user.emailVerified = true;
    user.emailVerificationToken = null;
    await this.usersRepository.save(user);
    this.logger.log(`Email verified for user: ${user.email}`);
  }

  // ─── Password Reset ───────────────────────────────────────────────────────

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email.toLowerCase());

    // Always respond with success to prevent email enumeration
    if (!user) return;

    const token = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = token;
    user.passwordResetExpiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);
    await this.usersRepository.save(user);

    this.mailService
      .sendPasswordReset(user.email, user.firstName, token)
      .catch((err: unknown) => {
        this.logger.error(`Failed to send password reset email to ${user.email}`, err);
      });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.usersRepository.findByPasswordResetToken(token);

    if (
      !user ||
      !user.passwordResetExpiresAt ||
      user.passwordResetExpiresAt < new Date()
    ) {
      throw new AppBadRequestException(
        'Invalid or expired password reset token',
        'INVALID_RESET_TOKEN',
      );
    }

    user.passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    user.passwordResetToken = null;
    user.passwordResetExpiresAt = null;
    // Invalidate all existing sessions
    user.hashedRefreshToken = null;

    await this.usersRepository.save(user);
    this.logger.log(`Password reset completed for user: ${user.email}`);
  }

  // ─── Token Generation ─────────────────────────────────────────────────────

  private async generateTokens(userId: string, email: string) {
    const payload: AuthenticatedUser = { id: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.get<string>('jwt.secret'),
          expiresIn: (this.configService.get<string>('jwt.expiresIn') ?? '15m') as any,
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.get<string>('jwt.refreshSecret'),
          expiresIn: (this.configService.get<string>('jwt.refreshExpiresIn') ?? '7d') as any,
        },
      ),
    ]);

    // Store hashed refresh token
    const hashedRefreshToken = await bcrypt.hash(refreshToken, BCRYPT_ROUNDS);
    const user = await this.usersRepository.findById(userId);
    if (user) {
      user.hashedRefreshToken = hashedRefreshToken;
      await this.usersRepository.save(user);
    }

    return { accessToken, refreshToken, payload };
  }
}
