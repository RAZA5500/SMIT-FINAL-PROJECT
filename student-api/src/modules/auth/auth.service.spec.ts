import {
  ConflictException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole, Prisma } from '@prisma/client';
import { MoneyService } from '../../shared/money/money.service';
import type { UserRecord } from '../users/types/user.types';
import { AuthDbService } from './auth.db.service';
import { AuthService } from './auth.service';
import { PasswordService } from './password.service';

const now = new Date('2026-01-01T00:00:00Z');

function userRow(overrides: Partial<User> = {}): User {
  return {
    id: 'user-1',
    email: 'ali@example.com',
    passwordHash: '$2b$12$hash',
    name: 'Ali',
    phone: null,
    role: UserRole.CUSTOMER,
    isActive: true,
    totalOrders: 0,
    totalSpent: new Prisma.Decimal(0),
    lastLoginAt: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

/** Db service users bina passwordHash ke deta hai */
function withoutPassword(user: User): UserRecord {
  const record: Partial<User> = { ...user };
  delete record.passwordHash;
  return record as UserRecord;
}

describe('AuthService', () => {
  let service: AuthService;
  let authDb: jest.Mocked<
    Pick<
      AuthDbService,
      | 'existsByEmail'
      | 'existsByPhone'
      | 'createCustomer'
      | 'findByEmailWithPassword'
      | 'touchLastLogin'
      | 'findById'
    >
  >;
  let passwordService: jest.Mocked<Pick<PasswordService, 'hash' | 'verify'>>;
  let jwtService: jest.Mocked<Pick<JwtService, 'signAsync'>>;

  beforeEach(() => {
    authDb = {
      existsByEmail: jest.fn().mockResolvedValue(false),
      existsByPhone: jest.fn().mockResolvedValue(false),
      createCustomer: jest.fn(),
      findByEmailWithPassword: jest.fn(),
      touchLastLogin: jest.fn(),
      findById: jest.fn(),
    };
    passwordService = {
      hash: jest.fn().mockResolvedValue('$2b$12$hash'),
      verify: jest.fn(),
    };
    jwtService = { signAsync: jest.fn().mockResolvedValue('signed.jwt') };
    service = new AuthService(
      authDb as unknown as AuthDbService,
      passwordService,
      jwtService as unknown as JwtService,
      new MoneyService(),
    );
  });

  describe('register', () => {
    it('hashes the password and creates a CUSTOMER (role never comes from the client)', async () => {
      authDb.createCustomer.mockResolvedValue(withoutPassword(userRow()));

      const result = await service.register({
        name: 'Ali',
        email: 'ali@example.com',
        password: 'secret123',
      });

      expect(passwordService.hash).toHaveBeenCalledWith('secret123');
      expect(authDb.createCustomer).toHaveBeenCalledWith({
        name: 'Ali',
        email: 'ali@example.com',
        phone: null,
        passwordHash: '$2b$12$hash',
      });
      expect(result.role).toBe(UserRole.CUSTOMER);
      expect(result).not.toHaveProperty('passwordHash');
      expect(result.totalSpent).toBe('0.00');
    });

    it('rejects a duplicate email with 409', async () => {
      authDb.existsByEmail.mockResolvedValue(true);
      await expect(
        service.register({
          name: 'Ali',
          email: 'ali@example.com',
          password: 'secret123',
        }),
      ).rejects.toThrow(
        new ConflictException(
          'This email is already associated with another account.',
        ),
      );
      expect(authDb.createCustomer).not.toHaveBeenCalled();
    });

    it('rejects a duplicate phone with 409', async () => {
      authDb.existsByPhone.mockResolvedValue(true);
      await expect(
        service.register({
          name: 'Ali',
          email: 'ali@example.com',
          password: 'secret123',
          phone: '07123456789',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('returns the same 401 for an unknown email and a wrong password', async () => {
      authDb.findByEmailWithPassword.mockResolvedValue(null);
      passwordService.verify.mockResolvedValue(false);
      const unknownEmail = service.login({
        email: 'x@y.z',
        password: 'pw123456',
      });
      await expect(unknownEmail).rejects.toThrow(
        new UnauthorizedException('Invalid email or password'),
      );

      authDb.findByEmailWithPassword.mockResolvedValue(userRow());
      passwordService.verify.mockResolvedValue(false);
      const wrongPassword = service.login({
        email: 'ali@example.com',
        password: 'nope1234',
      });
      await expect(wrongPassword).rejects.toThrow(
        new UnauthorizedException('Invalid email or password'),
      );
    });

    it('still runs the password check when the user does not exist (timing)', async () => {
      authDb.findByEmailWithPassword.mockResolvedValue(null);
      passwordService.verify.mockResolvedValue(false);
      await expect(
        service.login({ email: 'x@y.z', password: 'pw123456' }),
      ).rejects.toThrow(UnauthorizedException);
      expect(passwordService.verify).toHaveBeenCalledWith(
        'pw123456',
        undefined,
      );
    });

    it('returns 403 for a deactivated account with the right password', async () => {
      authDb.findByEmailWithPassword.mockResolvedValue(
        userRow({ isActive: false }),
      );
      passwordService.verify.mockResolvedValue(true);
      await expect(
        service.login({ email: 'ali@example.com', password: 'secret123' }),
      ).rejects.toThrow(
        new ForbiddenException(
          'User account is deactivated. Please contact support.',
        ),
      );
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('signs a JWT with { sub, role } and updates lastLoginAt', async () => {
      const row = userRow({ role: UserRole.ADMIN });
      authDb.findByEmailWithPassword.mockResolvedValue(row);
      passwordService.verify.mockResolvedValue(true);
      authDb.touchLastLogin.mockResolvedValue(
        withoutPassword({ ...row, lastLoginAt: now }),
      );

      const result = await service.login({
        email: row.email,
        password: 'secret123',
      });

      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: 'user-1',
        role: 'ADMIN',
      });
      expect(authDb.touchLastLogin).toHaveBeenCalledWith('user-1');
      expect(result.accessToken).toBe('signed.jwt');
      expect(result.user.lastLoginAt).toEqual(now);
      expect(result.user).not.toHaveProperty('passwordHash');
    });
  });
});
