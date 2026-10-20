import { NotFoundException } from '@nestjs/common';
import { Address, UserRole } from '@prisma/client';
import type { IAuthUser } from '../auth/types/auth.types';
import { AddressesDbService } from './addresses.db.service';
import { AddressesService } from './addresses.service';

const customer: IAuthUser = {
  id: 'u1',
  email: 'c@test.local',
  name: 'C',
  role: UserRole.CUSTOMER,
};
const tx = {};
const now = new Date('2026-01-01T00:00:00Z');

function address(overrides: Partial<Address> = {}): Address {
  return {
    id: 'a1',
    userId: 'u1',
    addressLine: '1 High St',
    city: 'London',
    county: 'Greater London',
    postcode: 'E1 1AA',
    isDefault: false,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

const fields = {
  addressLine: '1 High St',
  city: 'London',
  county: 'Greater London',
  postcode: 'E1 1AA',
};

describe('AddressesService', () => {
  let service: AddressesService;
  let db: jest.Mocked<
    Pick<
      AddressesDbService,
      | 'transaction'
      | 'findOwned'
      | 'unsetDefault'
      | 'create'
      | 'update'
      | 'markDefault'
      | 'delete'
      | 'findNewest'
    >
  >;

  beforeEach(() => {
    db = {
      transaction: jest.fn((fn: (t: never) => unknown) =>
        fn(tx as never),
      ) as never,
      findOwned: jest.fn(),
      unsetDefault: jest.fn().mockResolvedValue(undefined),
      create: jest.fn().mockResolvedValue(address()),
      update: jest.fn().mockResolvedValue(address()),
      markDefault: jest.fn().mockResolvedValue(address({ isDefault: true })),
      delete: jest.fn().mockResolvedValue(undefined),
      findNewest: jest.fn(),
    };
    service = new AddressesService(db as unknown as AddressesDbService);
  });

  it("another user's address → 404 (ownership query by id + userId)", async () => {
    db.findOwned.mockResolvedValue(null);
    await expect(
      service.update(customer, 'a1', { city: 'Leeds' }),
    ).rejects.toThrow(NotFoundException);
    expect(db.findOwned).toHaveBeenCalledWith('a1', 'u1', undefined);
  });

  it('a new default address unsets the old default in the same transaction', async () => {
    await service.create(customer, { ...fields, isDefault: true });
    expect(db.unsetDefault).toHaveBeenCalledWith(tx, 'u1');
    expect(db.create).toHaveBeenCalledWith(tx, 'u1', {
      ...fields,
      isDefault: true,
    });
    expect(db.unsetDefault.mock.invocationCallOrder[0]).toBeLessThan(
      db.create.mock.invocationCallOrder[0],
    );
  });

  it('a non-default address does not touch the existing default', async () => {
    await service.create(customer, fields);
    expect(db.unsetDefault).not.toHaveBeenCalled();
  });

  it('setting an already-default address is a no-op', async () => {
    db.findOwned.mockResolvedValue(address({ isDefault: true }));
    await service.setDefault(customer, 'a1');
    expect(db.unsetDefault).not.toHaveBeenCalled();
    expect(db.markDefault).not.toHaveBeenCalled();
  });

  it('deleting the default promotes the newest remaining address', async () => {
    db.findOwned.mockResolvedValue(address({ isDefault: true }));
    db.findNewest.mockResolvedValue(address({ id: 'a2' }));
    await service.delete(customer, 'a1');
    expect(db.delete).toHaveBeenCalledWith(tx, 'a1', 'u1');
    expect(db.markDefault).toHaveBeenCalledWith(tx, 'a2', 'u1');
  });

  it('deleting a non-default address does not promote anything', async () => {
    db.findOwned.mockResolvedValue(address());
    await service.delete(customer, 'a1');
    expect(db.findNewest).not.toHaveBeenCalled();
  });
});
