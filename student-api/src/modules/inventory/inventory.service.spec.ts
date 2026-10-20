import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import {
  AdjustmentReason,
  StockStatus,
  TransactionType,
  UserRole,
} from '@prisma/client';
import type { IAuthUser } from '../auth/types/auth.types';
import { InventoryDbService } from './inventory.db.service';
import { InventoryService } from './inventory.service';
import type {
  ICreateTransactionData,
  ILockedInventoryRow,
  InventoryRecord,
  InventoryTransactionRecord,
} from './types/inventory.types';

const admin: IAuthUser = {
  id: 'admin-1',
  email: 'a@test.local',
  name: 'Admin',
  role: UserRole.ADMIN,
};
const now = new Date('2026-01-01T00:00:00Z');
const tx = {};

const row: ILockedInventoryRow = {
  id: 'inv-1',
  productId: 'p1',
  qtyOnHand: 10,
  lowStockThreshold: 3,
};

function inventory(qtyOnHand: number): InventoryRecord {
  return {
    id: 'inv-1',
    productId: 'p1',
    qtyOnHand,
    lowStockThreshold: 3,
    stockStatus: StockStatus.IN_STOCK,
    createdAt: now,
    updatedAt: now,
    product: { id: 'p1', name: 'Apples', sku: 'FRU-000001', isActive: true },
  };
}

describe('InventoryService', () => {
  let service: InventoryService;
  let db: jest.Mocked<
    Pick<
      InventoryDbService,
      | 'transaction'
      | 'productExists'
      | 'existsForProduct'
      | 'create'
      | 'lockById'
      | 'setQuantity'
      | 'createTransaction'
    >
  >;

  beforeEach(() => {
    db = {
      transaction: jest.fn((fn: (t: never) => unknown) =>
        fn(tx as never),
      ) as never,
      productExists: jest.fn().mockResolvedValue(true),
      existsForProduct: jest.fn().mockResolvedValue(false),
      create: jest.fn().mockResolvedValue(inventory(5)),
      lockById: jest.fn().mockResolvedValue(row),
      setQuantity: jest.fn((_tx, _row, qty: number) =>
        Promise.resolve(inventory(qty)),
      ),
      createTransaction: jest
        .fn()
        .mockImplementation((_tx: unknown, data: ICreateTransactionData) =>
          Promise.resolve({
            id: 't1',
            createdAt: now,
            orderItem: null,
            reason: null,
            note: null,
            performedBy: null,
            orderItemId: null,
            ...data,
          } as InventoryTransactionRecord),
        ),
    };
    service = new InventoryService(db as unknown as InventoryDbService);
  });

  describe('adjust', () => {
    it.each([AdjustmentReason.DAMAGE, AdjustmentReason.RETURN_TO_SUPPLIER])(
      '%s with a positive quantity → 400',
      async (reason) => {
        await expect(
          service.adjust({ inventoryId: 'inv-1', quantity: 5, reason }, admin),
        ).rejects.toThrow(BadRequestException);
        expect(db.transaction).not.toHaveBeenCalled();
      },
    );

    it('never lets stock go negative (10 − 11 → 400)', async () => {
      await expect(
        service.adjust(
          {
            inventoryId: 'inv-1',
            quantity: -11,
            reason: AdjustmentReason.DAMAGE,
          },
          admin,
        ),
      ).rejects.toThrow(
        new BadRequestException('Stock cannot go negative. Available: 10.'),
      );
      expect(db.setQuantity).not.toHaveBeenCalled();
    });

    it('decreases under the row lock and writes an ADJUSTMENT_DECREASE ledger row', async () => {
      const result = await service.adjust(
        {
          inventoryId: 'inv-1',
          quantity: -3,
          reason: AdjustmentReason.DAMAGE,
          note: 'Broken',
        },
        admin,
      );
      expect(db.lockById).toHaveBeenCalledWith(tx, 'inv-1');
      expect(db.setQuantity).toHaveBeenCalledWith(tx, row, 7);
      expect(db.createTransaction).toHaveBeenCalledWith(tx, {
        inventoryId: 'inv-1',
        type: TransactionType.ADJUSTMENT_DECREASE,
        quantity: 3,
        reason: AdjustmentReason.DAMAGE,
        note: 'Broken',
        performedBy: 'admin-1',
      });
      expect(result.inventory.qtyOnHand).toBe(7);
    });

    it('increases with ADJUSTMENT_INCREASE', async () => {
      await service.adjust(
        { inventoryId: 'inv-1', quantity: 5, reason: AdjustmentReason.RESTOCK },
        admin,
      );
      expect(db.setQuantity).toHaveBeenCalledWith(tx, row, 15);
      expect(db.createTransaction).toHaveBeenCalledWith(
        tx,
        expect.objectContaining({
          type: TransactionType.ADJUSTMENT_INCREASE,
          quantity: 5,
        }),
      );
    });

    it('returns 404 for an unknown inventory row', async () => {
      db.lockById.mockResolvedValue(null);
      await expect(
        service.adjust(
          { inventoryId: 'x', quantity: 1, reason: AdjustmentReason.RECOUNT },
          admin,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('404 when the product does not exist, 409 when inventory already exists', async () => {
      db.productExists.mockResolvedValueOnce(false);
      await expect(
        service.create({ productId: 'p1', qtyOnHand: 5 }, admin),
      ).rejects.toThrow(NotFoundException);
      db.existsForProduct.mockResolvedValueOnce(true);
      await expect(
        service.create({ productId: 'p1', qtyOnHand: 5 }, admin),
      ).rejects.toThrow(ConflictException);
    });

    it('defaults lowStockThreshold to 10 and records the opening stock as RECEIVED', async () => {
      await service.create({ productId: 'p1', qtyOnHand: 5 }, admin);
      expect(db.create).toHaveBeenCalledWith(tx, {
        productId: 'p1',
        qtyOnHand: 5,
        lowStockThreshold: 10,
        stockStatus: StockStatus.LOW_STOCK,
      });
      expect(db.createTransaction).toHaveBeenCalledWith(
        tx,
        expect.objectContaining({
          type: TransactionType.RECEIVED,
          quantity: 5,
        }),
      );
    });

    it('does not write a ledger row for zero opening stock', async () => {
      await service.create({ productId: 'p1', qtyOnHand: 0 }, admin);
      expect(db.createTransaction).not.toHaveBeenCalled();
    });
  });
});
