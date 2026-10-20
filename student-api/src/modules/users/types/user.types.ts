import type { User, UserRole } from '@prisma/client';

/** DB user bina passwordHash ke — db services isi shape mein user dete hain */
export type UserRecord = Omit<User, 'passwordHash'>;

/** API response — money string, passwordHash kabhi nahi */
export interface IUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: UserRole;
  isActive: boolean;
  totalOrders: number;
  totalSpent: string;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IListCustomersFilter {
  page: number;
  limit: number;
  search?: string;
  isActive?: boolean;
}
