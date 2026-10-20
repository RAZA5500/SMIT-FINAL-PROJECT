import { Injectable } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { toSkipTake } from '../../common/pagination/pagination.helper';
import { DatabaseService } from '../../database/database.service';
import type { IListCustomersFilter, UserRecord } from './types/user.types';

@Injectable()
export class UsersDbService {
  constructor(private readonly db: DatabaseService) {}

  async listCustomers(
    filter: IListCustomersFilter,
  ): Promise<{ users: UserRecord[]; total: number }> {
    const where: Prisma.UserWhereInput = {
      role: UserRole.CUSTOMER,
      ...(filter.isActive !== undefined && { isActive: filter.isActive }),
      ...(filter.search && {
        OR: [
          { name: { contains: filter.search, mode: 'insensitive' } },
          { email: { contains: filter.search, mode: 'insensitive' } },
          { phone: { contains: filter.search, mode: 'insensitive' } },
        ],
      }),
    };

    const [users, total] = await Promise.all([
      this.db.user.findMany({
        where,
        omit: { passwordHash: true },
        orderBy: { createdAt: 'desc' },
        ...toSkipTake(filter.page, filter.limit),
      }),
      this.db.user.count({ where }),
    ]);
    return { users, total };
  }

  findById(id: string): Promise<UserRecord | null> {
    return this.db.user.findUnique({
      where: { id },
      omit: { passwordHash: true },
    });
  }

  updateStatus(id: string, isActive: boolean): Promise<UserRecord> {
    return this.db.user.update({
      where: { id },
      data: { isActive },
      omit: { passwordHash: true },
    });
  }
}
