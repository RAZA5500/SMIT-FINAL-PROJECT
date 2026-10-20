import type { MoneyService } from '../../../shared/money/money.service';
import type { IUser, UserRecord } from '../types/user.types';

/** Explicit fields — koi naya internal column khud-ba-khud response mein nahi jata */
export function toUser(user: UserRecord, money: MoneyService): IUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    role: user.role,
    isActive: user.isActive,
    totalOrders: user.totalOrders,
    totalSpent: money.toDecimalString(user.totalSpent),
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
