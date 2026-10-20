import type { Address } from '@prisma/client';
import type { IAddress } from '../types/address.types';

export function toAddress(address: Address): IAddress {
  return {
    id: address.id,
    addressLine: address.addressLine,
    city: address.city,
    county: address.county,
    postcode: address.postcode,
    isDefault: address.isDefault,
    createdAt: address.createdAt,
    updatedAt: address.updatedAt,
  };
}
