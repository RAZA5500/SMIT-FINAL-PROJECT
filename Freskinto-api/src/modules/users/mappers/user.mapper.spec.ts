import { Prisma, UserRole } from '@prisma/client';
import { MoneyService } from '../../../shared/money/money.service';
import type { UserRecord } from '../types/user.types';
import { toUser } from './user.mapper';

describe('toUser mapper', () => {
  it('never returns passwordHash and formats money as "10.00"', () => {
    const now = new Date('2026-01-01T00:00:00Z');
    // Galti se hash wala object bhi aa jaye to mapper explicit fields hi bhejta hai
    const withHash = {
      id: 'u1',
      email: 'a@b.c',
      name: 'A',
      phone: null,
      role: UserRole.CUSTOMER,
      isActive: true,
      totalOrders: 1,
      totalSpent: new Prisma.Decimal(10),
      lastLoginAt: null,
      createdAt: now,
      updatedAt: now,
      passwordHash: '$2b$12$secret',
    } as UserRecord;

    const result = toUser(withHash, new MoneyService());

    expect(result).not.toHaveProperty('passwordHash');
    expect(result.totalSpent).toBe('10.00');
  });
});
