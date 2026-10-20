import { ConflictException, Injectable } from '@nestjs/common';
import { Address } from '@prisma/client';
import { toSkipTake } from '../../common/pagination/pagination.helper';
import { DatabaseService } from '../../database/database.service';
import type { TransactionClient } from '../../database/database.types';
import { isUniqueViolation } from '../../database/prisma-errors';
import type { IAddressFields } from './types/address.types';

const DEFAULT_RACE_MESSAGE =
  'Default address was changed by another request. Please try again.';

/** Har query `(id, userId)` par — doosre user ka address kabhi match nahi hota */
@Injectable()
export class AddressesDbService {
  constructor(private readonly db: DatabaseService) {}

  transaction<T>(fn: (tx: TransactionClient) => Promise<T>): Promise<T> {
    return this.db.$transaction(fn);
  }

  async list(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{ addresses: Address[]; total: number }> {
    const [addresses, total] = await Promise.all([
      this.db.address.findMany({
        where: { userId },
        orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
        ...toSkipTake(page, limit),
      }),
      this.db.address.count({ where: { userId } }),
    ]);
    return { addresses, total };
  }

  findOwned(
    id: string,
    userId: string,
    tx: TransactionClient = this.db,
  ): Promise<Address | null> {
    return tx.address.findUnique({ where: { id_userId: { id, userId } } });
  }

  async unsetDefault(tx: TransactionClient, userId: string): Promise<void> {
    await tx.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  async create(
    tx: TransactionClient,
    userId: string,
    data: IAddressFields & { isDefault: boolean },
  ): Promise<Address> {
    try {
      return await tx.address.create({ data: { ...data, userId } });
    } catch (error) {
      // Partial unique index: ek user ke do default kabhi nahi
      if (isUniqueViolation(error)) {
        throw new ConflictException(DEFAULT_RACE_MESSAGE);
      }
      throw error;
    }
  }

  update(
    id: string,
    userId: string,
    data: Partial<IAddressFields>,
  ): Promise<Address> {
    return this.db.address.update({
      where: { id_userId: { id, userId } },
      data,
    });
  }

  async markDefault(
    tx: TransactionClient,
    id: string,
    userId: string,
  ): Promise<Address> {
    try {
      return await tx.address.update({
        where: { id_userId: { id, userId } },
        data: { isDefault: true },
      });
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException(DEFAULT_RACE_MESSAGE);
      }
      throw error;
    }
  }

  async delete(tx: TransactionClient, id: string, userId: string) {
    await tx.address.delete({ where: { id_userId: { id, userId } } });
  }

  findNewest(tx: TransactionClient, userId: string): Promise<Address | null> {
    return tx.address.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
