import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service.js';
import { UsersRepository } from '../../users/repositories/users.repository.js';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../../mail/mail.service.js';
import { AppConflictException, AppUnauthorizedException } from '../../../common/exceptions/app.exceptions.js';
import * as bcrypt from 'bcrypt';
import { User } from '../../users/entities/user.entity.js';

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('AuthService', () => {
  let authService: AuthService;
  let usersRepository: Mocked<UsersRepository>;
  let jwtService: Mocked<JwtService>;
  let configService: Mocked<ConfigService>;
  let mailService: Mocked<MailService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersRepository,
          useValue: mock<UsersRepository>(),
        },
        {
          provide: JwtService,
          useValue: mock<JwtService>(),
        },
        {
          provide: ConfigService,
          useValue: mock<ConfigService>(),
        },
        {
          provide: MailService,
          useValue: mock<MailService>(),
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersRepository = module.get(UsersRepository);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
    mailService = module.get(MailService);

    configService.get.mockImplementation((key: string) => {
      const config: Record<string, string> = {
        'jwt.secret': 'test-secret',
        'jwt.expiresIn': '15m',
        'jwt.refreshSecret': 'test-refresh-secret',
        'jwt.refreshExpiresIn': '7d',
      };
      return config[key];
    });

    jwtService.signAsync.mockResolvedValue('mock-token');
    mailService.sendEmailVerification.mockResolvedValue(undefined);
    mailService.sendPasswordReset.mockResolvedValue(undefined);
  });

  describe('register', () => {
    it('throws ConflictException when email already exists', async () => {
      usersRepository.findByEmail.mockResolvedValueOnce({
        id: 'existing-id',
        email: 'test@example.com',
      } as User);

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
      usersRepository.findByEmail.mockResolvedValueOnce(null);
      usersRepository.create.mockResolvedValueOnce({
        id: 'new-user-id',
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
        emailVerified: false,
      } as User);
      usersRepository.findById.mockResolvedValueOnce({
        id: 'new-user-id',
        hashedRefreshToken: null,
      } as User);
      usersRepository.save.mockResolvedValue({} as User);

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
      usersRepository.findByEmail.mockResolvedValueOnce(null);
      usersRepository.create.mockResolvedValueOnce({
        id: 'new-user-id',
        email: 'jane@example.com',
      } as User);
      usersRepository.findById.mockResolvedValueOnce({ id: 'new-user-id' } as User);
      usersRepository.save.mockResolvedValue({} as User);

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
      usersRepository.findByEmail.mockResolvedValueOnce(null);

      await expect(
        authService.login({ email: 'nobody@example.com', password: 'any' }),
      ).rejects.toThrow(AppUnauthorizedException);
    });

    it('throws UnauthorizedException when password is incorrect', async () => {
      const hash = await bcrypt.hash('correct-password', 12);
      usersRepository.findByEmail.mockResolvedValueOnce({
        id: 'user-id',
        email: 'user@example.com',
        passwordHash: hash,
      } as User);

      await expect(
        authService.login({ email: 'user@example.com', password: 'wrong-password' }),
      ).rejects.toThrow(AppUnauthorizedException);
    });

    it('returns tokens on successful login', async () => {
      const hash = await bcrypt.hash('SecurePass123', 12);
      usersRepository.findByEmail.mockResolvedValueOnce({
        id: 'user-id',
        email: 'user@example.com',
        passwordHash: hash,
      } as User);
      usersRepository.findById.mockResolvedValueOnce({ id: 'user-id' } as User);
      usersRepository.save.mockResolvedValue({} as User);

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
      const user = { id: 'user-id', hashedRefreshToken: 'some-hash' } as User;
      usersRepository.findById.mockResolvedValueOnce(user);
      usersRepository.save.mockResolvedValue({} as User);

      await authService.logout('user-id');

      expect(usersRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ hashedRefreshToken: null }),
      );
    });

    it('does not throw if user not found on logout', async () => {
      usersRepository.findById.mockResolvedValueOnce(null);
      await expect(authService.logout('non-existent-id')).resolves.toBeUndefined();
    });
  });

  describe('requestPasswordReset', () => {
    it('does not reveal whether email exists (anti-enumeration)', async () => {
      usersRepository.findByEmail.mockResolvedValueOnce(null);
      // Should not throw
      await expect(
        authService.requestPasswordReset('nonexistent@example.com'),
      ).resolves.toBeUndefined();
    });
  });
});
