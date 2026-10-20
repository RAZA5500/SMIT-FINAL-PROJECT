import { ConflictException, Injectable } from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import { DatabaseService } from '../../database/database.service';
import { isUniqueViolation } from '../../database/prisma-errors';
import type { UserRecord } from '../users/types/user.types';

export const EMAIL_TAKEN_MESSAGE =
  'This email is already associated with another account.';
export const PHONE_TAKEN_MESSAGE =
  'This mobile number is already associated with another account.';

interface ICreateCustomerData {
  name: string;
  email: string;
  phone: string | null;
  passwordHash: string;
}

@Injectable()
export class AuthDbService {
  constructor(private readonly db: DatabaseService) {}

  /** Guard ke liye — har request par role aur isActive DB se */
  findAuthUserById(id: string) {
    return this.db.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true, isActive: true },
    });
  }

  findById(id: string): Promise<UserRecord | null> {
    return this.db.user.findUnique({
      where: { id },
      omit: { passwordHash: true },
    });
  }

  /** Sirf login ke liye — passwordHash isi ek jagah db layer se bahar jata hai */
  findByEmailWithPassword(email: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { email } });
  }

  async existsByEmail(email: string): Promise<boolean> {
    return (await this.db.user.count({ where: { email } })) > 0;
  }

  async existsByPhone(phone: string): Promise<boolean> {
    return (await this.db.user.count({ where: { phone } })) > 0;
  }

  /** Role hamesha CUSTOMER — client ki taraf se role kabhi nahi aata */
  async createCustomer(data: ICreateCustomerData): Promise<UserRecord> {
    try {
      return await this.db.user.create({
        data: { ...data, role: UserRole.CUSTOMER },
        omit: { passwordHash: true },
      });
    } catch (error) {
      // Parallel same-email/phone registration: unique constraint jeet-ta hai
      if (isUniqueViolation(error)) {
        throw new ConflictException(
          (await this.existsByEmail(data.email))
            ? EMAIL_TAKEN_MESSAGE
            : PHONE_TAKEN_MESSAGE,
        );
      }
      throw error;
    }
  }

  touchLastLogin(id: string): Promise<UserRecord> {
    return this.db.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
      omit: { passwordHash: true },
    });
  }
}
