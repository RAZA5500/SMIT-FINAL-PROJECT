import { Injectable, NotFoundException } from '@nestjs/common';
import { Address } from '@prisma/client';
import {
  buildMeta,
  IPaginated,
} from '../../common/pagination/pagination.helper';
import { PaginationDto } from '../../common/pagination/pagination.dto';
import type { TransactionClient } from '../../database/database.types';
import type { IAuthUser } from '../auth/types/auth.types';
import { AddressesDbService } from './addresses.db.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { toAddress } from './mappers/address.mapper';
import { IAddress } from './types/address.types';

export const ADDRESS_NOT_FOUND = 'Address not found';

@Injectable()
export class AddressesService {
  constructor(private readonly addressesDb: AddressesDbService) {}

  /** Default address pehle */
  async list(
    user: IAuthUser,
    query: PaginationDto,
  ): Promise<IPaginated<IAddress>> {
    const { addresses, total } = await this.addressesDb.list(
      user.id,
      query.page,
      query.limit,
    );
    return {
      data: addresses.map(toAddress),
      meta: buildMeta(total, query.page, query.limit),
    };
  }

  /** Naya address default ho to purana default isi transaction mein unset (Q3 fix) */
  async create(user: IAuthUser, dto: CreateAddressDto): Promise<IAddress> {
    const isDefault = dto.isDefault ?? false;
    const address = await this.addressesDb.transaction(async (tx) => {
      if (isDefault) {
        await this.addressesDb.unsetDefault(tx, user.id);
      }
      return this.addressesDb.create(tx, user.id, {
        addressLine: dto.addressLine,
        city: dto.city,
        county: dto.county,
        postcode: dto.postcode,
        isDefault,
      });
    });
    return toAddress(address);
  }

  async update(
    user: IAuthUser,
    id: string,
    dto: UpdateAddressDto,
  ): Promise<IAddress> {
    await this.findOwnedOrFail(id, user.id);
    return toAddress(await this.addressesDb.update(id, user.id, dto));
  }

  async setDefault(user: IAuthUser, id: string): Promise<IAddress> {
    const address = await this.addressesDb.transaction(async (tx) => {
      const existing = await this.findOwnedOrFail(id, user.id, tx);
      if (existing.isDefault) return existing;
      await this.addressesDb.unsetDefault(tx, user.id);
      return this.addressesDb.markDefault(tx, id, user.id);
    });
    return toAddress(address);
  }

  /** Default delete ho to sab se naya bacha hua address default ban jata hai */
  async delete(user: IAuthUser, id: string): Promise<void> {
    await this.addressesDb.transaction(async (tx) => {
      const existing = await this.findOwnedOrFail(id, user.id, tx);
      await this.addressesDb.delete(tx, id, user.id);
      if (existing.isDefault) {
        const newest = await this.addressesDb.findNewest(tx, user.id);
        if (newest) {
          await this.addressesDb.markDefault(tx, newest.id, user.id);
        }
      }
    });
  }

  /** Doosre user ka address → 404 (403 nahi, taa ke existence leak na ho) */
  private async findOwnedOrFail(
    id: string,
    userId: string,
    tx?: TransactionClient,
  ): Promise<Address> {
    const address = await this.addressesDb.findOwned(id, userId, tx);
    if (!address) {
      throw new NotFoundException(ADDRESS_NOT_FOUND);
    }
    return address;
  }
}
