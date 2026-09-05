import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from './auth.service.js';
import { UsersRepository } from '../../users/repositories/users.repository.js';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../../mail/mail.service.js';
import { AppConflictException, AppUnauthorizedException } from '../../../common/exceptions/app.exceptions.js';
import * as bcrypt from 'bcrypt';

// ─── Mock Factories ─────────────────────────────────────────────────────────

function createMockUsersRepository(): Partial<UsersRepository> {
  return {
    findByEmail: vi.fn(),
    findById: vi.fn(),
    findByEmailVerificationToken: vi.fn(),
    findByPasswordResetToken: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
  };
}

function createMockJwtService(): Partial<JwtService> {
  return {
    signAsync: vi.fn().mockResolvedValue('mock-token'),
  };
}

function createMockConfigService(): Partial<ConfigService> {
  return {
    get: vi.fn().mockImplementation((key: string) => {
      const config: Record<string, string> = {
        'jwt.secret': 'test-secret',
        'jwt.expiresIn': '15m',
        'jwt.refreshSecret': 'test-refresh-secret',
        'jwt.refreshExpiresIn': '7d',
      };
      return config[key];
    }),
  };
}

function createMockMailService(): Partial<MailService> {
  return {
    sendEmailVerification: vi.fn().mockResolvedValue(undefined),
    sendPasswordReset: vi.fn().mockResolvedValue(undefined),
  };
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('AuthService', () => {
  let authService: AuthService;
  let usersRepository: ReturnType<typeof createMockUsersRepository>;
  let jwtService: ReturnType<typeof createMockJwtService>;
  let configService: ReturnType<typeof createMockConfigService>;
  let mailService: ReturnType<typeof createMockMailService>;

  beforeEach(() => {
    usersRepository = createMockUsersRepository();
    jwtService = createMockJwtService();
    configService = createMockConfigService();
    mailService = createMockMailService();

    authService = new AuthService(
      usersRepository as UsersRepository,
      jwtService as JwtService,
      configService as ConfigService,
      mailService as MailService,
    );
  });

  describe('register', () => {
    it('throws ConflictException when email already exists', async () => {
      vi.mocked(usersRepository.findByEmail).mockResolvedValueOnce({
        id: 'existing-id',
        email: 'test@example.com',
      } as never);

      await expect(
        authService.register({
          email: 'test@example.com',
          firstName: 'Jane',
          lastName: 'Doe',
          password: 'SecurePass123',
        }),
      ).rejects.toThrow(AppConflictException);
    });

    it('creates user and returns tokens when email is new', async () => {
      vi.mocked(usersRepository.findByEmail).mockResolvedValueOnce(null);
      vi.mocked(usersRepository.create).mockResolvedValueOnce({
        id: 'new-user-id',
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
        emailVerified: false,
      } as never);
      vi.mocked(usersRepository.findById).mockResolvedValueOnce({
        id: 'new-user-id',
        hashedRefreshToken: null,
      } as never);
      vi.mocked(usersRepository.save).mockResolvedValue({} as never);

      const result = await authService.register({
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
        password: 'SecurePass123',
      });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(usersRepository.create).toHaveBeenCalledOnce();
    });

    it('normalizes email to lowercase on registration', async () => {
      vi.mocked(usersRepository.findByEmail).mockResolvedValueOnce(null);
      vi.mocked(usersRepository.create).mockResolvedValueOnce({
        id: 'new-user-id',
        email: 'jane@example.com',
      } as never);
      vi.mocked(usersRepository.findById).mockResolvedValueOnce({ id: 'new-user-id' } as never);
      vi.mocked(usersRepository.save).mockResolvedValue({} as never);

      await authService.register({
        email: 'JANE@EXAMPLE.COM',
        firstName: 'Jane',
        lastName: 'Doe',
        password: 'SecurePass123',
      });

      expect(usersRepository.findByEmail).toHaveBeenCalledWith('jane@example.com');
    });
  });

  describe('login', () => {
    it('throws UnauthorizedException when user not found', async () => {
      vi.mocked(usersRepository.findByEmail).mockResolvedValueOnce(null);

      await expect(
        authService.login({ email: 'nobody@example.com', password: 'any' }),
      ).rejects.toThrow(AppUnauthorizedException);
    });

    it('throws UnauthorizedException when password is incorrect', async () => {
      const hash = await bcrypt.hash('correct-password', 12);
      vi.mocked(usersRepository.findByEmail).mockResolvedValueOnce({
        id: 'user-id',
        email: 'user@example.com',
        passwordHash: hash,
      } as never);

      await expect(
        authService.login({ email: 'user@example.com', password: 'wrong-password' }),
      ).rejects.toThrow(AppUnauthorizedException);
    });

    it('returns tokens on successful login', async () => {
      const hash = await bcrypt.hash('SecurePass123', 12);
      vi.mocked(usersRepository.findByEmail).mockResolvedValueOnce({
        id: 'user-id',
        email: 'user@example.com',
        passwordHash: hash,
      } as never);
      vi.mocked(usersRepository.findById).mockResolvedValueOnce({ id: 'user-id' } as never);
      vi.mocked(usersRepository.save).mockResolvedValue({} as never);

      const result = await authService.login({
        email: 'user@example.com',
        password: 'SecurePass123',
      });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('logout', () => {
    it('clears hashedRefreshToken on logout', async () => {
      const user = { id: 'user-id', hashedRefreshToken: 'some-hash' } as never;
      vi.mocked(usersRepository.findById).mockResolvedValueOnce(user);
      vi.mocked(usersRepository.save).mockResolvedValue({} as never);

      await authService.logout('user-id');

      expect(usersRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ hashedRefreshToken: null }),
      );
    });

    it('does not throw if user not found on logout', async () => {
      vi.mocked(usersRepository.findById).mockResolvedValueOnce(null);
      await expect(authService.logout('non-existent-id')).resolves.toBeUndefined();
    });
  });

  describe('requestPasswordReset', () => {
    it('does not reveal whether email exists (anti-enumeration)', async () => {
      vi.mocked(usersRepository.findByEmail).mockResolvedValueOnce(null);
      // Should not throw
      await expect(
        authService.requestPasswordReset('nonexistent@example.com'),
      ).resolves.toBeUndefined();
    });
  });
});
