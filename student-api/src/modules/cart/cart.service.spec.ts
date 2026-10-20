import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CartItem, Prisma, StockStatus, UserRole } from '@prisma/client';
import { MoneyService } from '../../shared/money/money.service';
import type { IAuthUser } from '../auth/types/auth.types';
import { CartDbService } from './cart.db.service';
import { CartService } from './cart.service';
import type { CartProductRecord, CartRecord } from './types/cart.types';

const customer: IAuthUser = {
  id: 'u1',
  email: 'c@test.local',
  name: 'C',
  role: UserRole.CUSTOMER,
};
const now = new Date('2026-01-01T00:00:00Z');
const tx = {};
const emptyCart = {
  id: 'cart-1',
  userId: 'u1',
  createdAt: now,
  updatedAt: now,
  items: [],
} as CartRecord;

function product(
  overrides: Partial<CartProductRecord> = {},
  qty = 5,
): CartProductRecord {
  return {
    id: 'p1',
    name: 'Apples',
    slug: 'fruit-apples',
    sku: 'FRU-000001',
    categoryId: 'cat-1',
    price: new Prisma.Decimal('2.00'),
    minimumOrderQuantity: 2,
    maximumOrderQuantity: 10,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    inventory: {
      qtyOnHand: qty,
      stockStatus: qty > 0 ? StockStatus.IN_STOCK : StockStatus.OUT_OF_STOCK,
    },
    ...overrides,
  };
}

function cartItem(quantity: number): CartItem {
  return {
    id: 'item-1',
    cartId: 'cart-1',
    productId: 'p1',
    quantity,
    createdAt: now,
    updatedAt: now,
  };
}

describe('CartService', () => {
  let service: CartService;
  let db: jest.Mocked<
    Pick<
      CartDbService,
      | 'transaction'
      | 'getOrCreate'
      | 'findProduct'
      | 'findItem'
      | 'incrementItem'
      | 'findOwnedItem'
      | 'setItemQuantity'
      | 'deleteOwnedItem'
    >
  >;

  beforeEach(() => {
    db = {
      transaction: jest.fn((fn: (t: never) => unknown) =>
        fn(tx as never),
      ) as never,
      getOrCreate: jest.fn().mockResolvedValue(emptyCart),
      findProduct: jest.fn().mockResolvedValue(product()),
      findItem: jest.fn().mockResolvedValue(null),
      incrementItem: jest.fn().mockResolvedValue(cartItem(2)),
      findOwnedItem: jest.fn(),
      setItemQuantity: jest.fn().mockResolvedValue(undefined),
      deleteOwnedItem: jest.fn().mockResolvedValue(1),
    };
    service = new CartService(
      db as unknown as CartDbService,
      new MoneyService(),
    );
  });

  describe('addItem', () => {
    it('inactive or missing product → 404', async () => {
      db.findProduct.mockResolvedValueOnce(product({ isActive: false }));
      await expect(
        service.addItem(customer, { productId: 'p1', quantity: 2 }),
      ).rejects.toThrow(NotFoundException);
      db.findProduct.mockResolvedValueOnce(null);
      await expect(
        service.addItem(customer, { productId: 'p1', quantity: 2 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('out of stock → 400', async () => {
      db.findProduct.mockResolvedValue(product({}, 0));
      await expect(
        service.addItem(customer, { productId: 'p1', quantity: 2 }),
      ).rejects.toThrow(new BadRequestException('Product is out of stock'));
    });

    it('first add must be at least the minimum order quantity', async () => {
      await expect(
        service.addItem(customer, { productId: 'p1', quantity: 1 }),
      ).rejects.toThrow(
        new BadRequestException('Minimum order quantity for this product is 2'),
      );
      expect(db.incrementItem).not.toHaveBeenCalled();
    });

    it('the minimum only applies to the first add', async () => {
      db.findItem.mockResolvedValue(cartItem(2));
      db.incrementItem.mockResolvedValue(cartItem(3));
      await service.addItem(customer, { productId: 'p1', quantity: 1 });
      expect(db.incrementItem).toHaveBeenCalledWith(tx, 'cart-1', 'p1', 1);
    });

    it('stock 5, max 10 → total 6 is rejected with "Only 5 units available"', async () => {
      db.incrementItem.mockResolvedValue(cartItem(6));
      await expect(
        service.addItem(customer, { productId: 'p1', quantity: 6 }),
      ).rejects.toThrow(new BadRequestException('Only 5 units available'));
    });

    it('stock 20, max 10 → total 11 hits the maximum order quantity', async () => {
      db.findProduct.mockResolvedValue(product({}, 20));
      db.incrementItem.mockResolvedValue(cartItem(11));
      await expect(
        service.addItem(customer, { productId: 'p1', quantity: 11 }),
      ).rejects.toThrow(
        new BadRequestException(
          'Maximum order quantity for this product is 10',
        ),
      );
    });
  });

  describe('updateItem / removeItem', () => {
    it("another customer's item → 404", async () => {
      db.findOwnedItem.mockResolvedValue(null);
      await expect(
        service.updateItem(customer, 'item-1', { quantity: 3 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('sets an absolute quantity within the limits', async () => {
      db.findOwnedItem.mockResolvedValue({
        ...cartItem(2),
        product: product(),
      });
      await service.updateItem(customer, 'item-1', { quantity: 4 });
      expect(db.setItemQuantity).toHaveBeenCalledWith(tx, 'item-1', 4);
    });

    it('quantity 0 removes the item', async () => {
      await service.updateItem(customer, 'item-1', { quantity: 0 });
      expect(db.deleteOwnedItem).toHaveBeenCalledWith('item-1', 'u1');
    });

    it('removing an item that is not yours → 404', async () => {
      db.deleteOwnedItem.mockResolvedValue(0);
      await expect(service.removeItem(customer, 'item-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
