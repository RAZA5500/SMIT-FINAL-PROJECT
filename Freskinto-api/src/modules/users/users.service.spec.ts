import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { MoneyService } from '../../shared/money/money.service';
import type { IAuthUser } from '../auth/types/auth.types';
import type { UserRecord } from './types/user.types';
import { UsersDbService } from './users.db.service';
import { UsersService } from './users.service';

const admin: IAuthUser = {
  id: 'admin-1',
  email: 'admin@test.local',
  name: 'Admin',
  role: UserRole.ADMIN,
};

function record(overrides: Partial<UserRecord> = {}): UserRecord {
  const now = new Date('2026-01-01T00:00:00Z');
  return {
    id: 'customer-1',
    email: 'c@test.local',
    name: 'Customer',
    phone: null,
    role: UserRole.CUSTOMER,
    isActive: true,
    totalOrders: 2,
    totalSpent: new Prisma.Decimal('12.5'),
    lastLoginAt: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe('UsersService.updateCustomerStatus', () => {
  let service: UsersService;
  let usersDb: jest.Mocked<Pick<UsersDbService, 'findById' | 'updateStatus'>>;

  beforeEach(() => {
    usersDb = { findById: jest.fn(), updateStatus: jest.fn() };
    service = new UsersService(
      usersDb as unknown as UsersDbService,
      new MoneyService(),
    );
  });

  it('rejects changing your own status with 400', async () => {
    await expect(
      service.updateCustomerStatus(admin, admin.id, false),
    ).rejects.toThrow(BadRequestException);
    expect(usersDb.updateStatus).not.toHaveBeenCalled();
  });

  it('returns 404 when the user does not exist', async () => {
    usersDb.findById.mockResolvedValue(null);
    await expect(
      service.updateCustomerStatus(admin, 'missing', false),
    ).rejects.toThrow(NotFoundException);
  });

  it('returns 403 when the target is not a CUSTOMER', async () => {
    usersDb.findById.mockResolvedValue(record({ role: UserRole.ADMIN }));
    await expect(
      service.updateCustomerStatus(admin, 'customer-1', false),
    ).rejects.toThrow(ForbiddenException);
  });

  it('updates a customer and maps money to a string', async () => {
    usersDb.findById.mockResolvedValue(record());
    usersDb.updateStatus.mockResolvedValue(record({ isActive: false }));

    const result = await service.updateCustomerStatus(
      admin,
      'customer-1',
      false,
    );

    expect(usersDb.updateStatus).toHaveBeenCalledWith('customer-1', false);
    expect(result.isActive).toBe(false);
    expect(result.totalSpent).toBe('12.50');
  });
});
