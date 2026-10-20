import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  DeliveryType,
  Prisma,
  StockStatus,
  TransactionType,
  UserRole,
} from '@prisma/client';
import { MoneyService } from '../../shared/money/money.service';
import { AddressesDbService } from '../addresses/addresses.db.service';
import type { IAuthUser } from '../auth/types/auth.types';
import { CartDbService } from '../cart/cart.db.service';
import type { CartItemRecord } from '../cart/types/cart.types';
import { InventoryDbService } from '../inventory/inventory.db.service';
import type { ILockedInventoryRow } from '../inventory/types/inventory.types';
import { OrderCreationService } from './order-creation.service';
import { OrderQueryService } from './order-query.service';
import { OrdersDbService } from './orders.db.service';
import type { ICreateOrderData } from './types/order.types';

const customer: IAuthUser = {
  id: 'u1',
  email: 'c@test.local',
  name: 'C',
  role: UserRole.CUSTOMER,
};
const tx = {};
const now = new Date('2026-01-01T00:00:00Z');
const shippingAddress = {
  addressLine: '1 High St',
  city: 'London',
  county: 'Greater London',
  postcode: 'E1 1AA',
};

function cartItem(
  productId: string,
  quantity: number,
  price: string,
  isActive = true,
) {
  return {
    id: `ci-${productId}`,
    cartId: 'cart-1',
    productId,
    quantity,
    createdAt: now,
    updatedAt: now,
    product: {
      id: productId,
      name: productId,
      slug: productId,
      sku: productId,
      categoryId: 'cat',
      price: new Prisma.Decimal(price),
      minimumOrderQuantity: 1,
      maximumOrderQuantity: 50,
      isActive,
      createdAt: now,
      updatedAt: now,
      inventory: { qtyOnHand: 99, stockStatus: StockStatus.IN_STOCK },
    },
  } as CartItemRecord;
}

const lockedRow = (
  productId: string,
  qtyOnHand: number,
): ILockedInventoryRow => ({
  id: `inv-${productId}`,
  productId,
  qtyOnHand,
  lowStockThreshold: 2,
});

describe('OrderCreationService', () => {
  let service: OrderCreationService;
  let ordersDb: jest.Mocked<
    Pick<OrdersDbService, 'transaction' | 'nextOrderNumber' | 'createOrder'>
  >;
  let cartDb: jest.Mocked<
    Pick<CartDbService, 'lockCart' | 'findItemsForOrder' | 'clearItems'>
  >;
  let inventoryDb: jest.Mocked<
    Pick<
      InventoryDbService,
      'lockByProductIds' | 'setQuantity' | 'createTransactions'
    >
  >;
  let addressesDb: jest.Mocked<Pick<AddressesDbService, 'findOwned'>>;

  beforeEach(() => {
    ordersDb = {
      transaction: jest.fn((fn: (t: never) => unknown) =>
        fn(tx as never),
      ) as never,
      nextOrderNumber: jest.fn().mockResolvedValue(12),
      createOrder: jest.fn((_tx, data: ICreateOrderData) =>
        Promise.resolve({
          id: 'order-1',
          items: data.items.map((line, i) => ({
            id: `oi-${i}`,
            productId: line.productId,
            quantity: line.quantity,
          })),
        }),
      ) as never,
    };
    cartDb = {
      lockCart: jest.fn().mockResolvedValue({ id: 'cart-1' }),
      findItemsForOrder: jest
        .fn()
        .mockResolvedValue([
          cartItem('p-a', 2, '1.99'),
          cartItem('p-b', 1, '5.00'),
        ]),
      clearItems: jest.fn().mockResolvedValue(undefined),
    };
    inventoryDb = {
      lockByProductIds: jest
        .fn()
        .mockResolvedValue([lockedRow('p-a', 10), lockedRow('p-b', 1)]),
      setQuantity: jest.fn().mockResolvedValue(undefined) as never,
      createTransactions: jest.fn().mockResolvedValue(undefined),
    };
    addressesDb = { findOwned: jest.fn() };
    service = new OrderCreationService(
      ordersDb as unknown as OrdersDbService,
      cartDb as unknown as CartDbService,
      inventoryDb as unknown as InventoryDbService,
      addressesDb as unknown as AddressesDbService,
      {
        getForCustomer: jest.fn().mockResolvedValue({ id: 'order-1' }),
      } as unknown as OrderQueryService,
      new MoneyService(),
    );
  });

  describe('delivery / pickup validation', () => {
    it.each([
      [
        { deliveryType: DeliveryType.DELIVERY },
        'Delivery orders require an address',
      ],
      [
        {
          deliveryType: DeliveryType.DELIVERY,
          addressId: 'a1',
          shippingAddress,
        },
        'Provide either addressId or shippingAddress, not both',
      ],
      [
        {
          deliveryType: DeliveryType.DELIVERY,
          shippingAddress,
          pickupScheduledAt: '2099-01-01T10:00:00Z',
        },
        'Pickup time is only allowed for pickup orders',
      ],
      [
        { deliveryType: DeliveryType.PICKUP },
        'Pickup orders require pickupScheduledAt',
      ],
      [
        {
          deliveryType: DeliveryType.PICKUP,
          shippingAddress,
          pickupScheduledAt: '2099-01-01T10:00:00Z',
        },
        'Pickup orders cannot have a delivery address',
      ],
      [
        {
          deliveryType: DeliveryType.PICKUP,
          pickupScheduledAt: '2000-01-01T10:00:00Z',
        },
        'Pickup time must be in the future',
      ],
    ])('%o → 400 "%s"', async (dto, message) => {
      await expect(service.createOrder(customer, dto)).rejects.toThrow(
        new BadRequestException(message),
      );
      expect(ordersDb.transaction).not.toHaveBeenCalled();
    });

    it("someone else's saved address → 404", async () => {
      addressesDb.findOwned.mockResolvedValue(null);
      await expect(
        service.createOrder(customer, {
          deliveryType: DeliveryType.DELIVERY,
          addressId: 'a1',
        }),
      ).rejects.toThrow(NotFoundException);
      expect(addressesDb.findOwned).toHaveBeenCalledWith('a1', 'u1');
    });
  });

  describe('transaction', () => {
    const dto = { deliveryType: DeliveryType.DELIVERY, shippingAddress };

    it('empty cart → 400 "Cart is empty. Cannot create order."', async () => {
      cartDb.findItemsForOrder.mockResolvedValue([]);
      await expect(service.createOrder(customer, dto)).rejects.toThrow(
        new BadRequestException('Cart is empty. Cannot create order.'),
      );
    });

    it('inactive product → 400', async () => {
      cartDb.findItemsForOrder.mockResolvedValue([
        cartItem('p-a', 1, '1.00', false),
      ]);
      await expect(service.createOrder(customer, dto)).rejects.toThrow(
        new BadRequestException('Product is no longer available.'),
      );
    });

    it('not enough stock → 400 with requested/available and nothing deducted', async () => {
      cartDb.findItemsForOrder.mockResolvedValue([
        cartItem('p-a', 2, '1.99'),
        cartItem('p-b', 3, '5.00'),
      ]);
      await expect(service.createOrder(customer, dto)).rejects.toThrow(
        new BadRequestException(
          'Not enough stock. Requested: 3, Available: 1.',
        ),
      );
      expect(inventoryDb.setQuantity).not.toHaveBeenCalled();
    });

    it('locks inventory in productId order, deducts stock, uses server prices and clears the cart', async () => {
      await service.createOrder(customer, dto);

      expect(cartDb.lockCart).toHaveBeenCalledWith(tx, 'u1');
      expect(inventoryDb.lockByProductIds).toHaveBeenCalledWith(tx, [
        'p-a',
        'p-b',
      ]);
      expect(inventoryDb.setQuantity).toHaveBeenCalledWith(
        tx,
        lockedRow('p-a', 10),
        8,
      );
      expect(inventoryDb.setQuantity).toHaveBeenCalledWith(
        tx,
        lockedRow('p-b', 1),
        0,
      );

      const data = ordersDb.createOrder.mock.calls[0][1];
      expect(data.orderNumber).toBe(
        `ORD-${new Date().getUTCFullYear()}-000012`,
      );
      expect(data.subtotal.toFixed(2)).toBe('8.98');
      expect(data.total.toFixed(2)).toBe('8.98');
      expect(data.items[0].subtotal.toFixed(2)).toBe('3.98');
      expect(data.address).toEqual(shippingAddress);
      const minutesUntilExpiry =
        (data.paymentExpiresAt.getTime() - Date.now()) / 60_000;
      expect(minutesUntilExpiry).toBeGreaterThan(4.9);
      expect(minutesUntilExpiry).toBeLessThanOrEqual(5);

      expect(inventoryDb.createTransactions).toHaveBeenCalledWith(tx, [
        {
          inventoryId: 'inv-p-a',
          type: TransactionType.CONSUMED,
          quantity: 2,
          orderItemId: 'oi-0',
        },
        {
          inventoryId: 'inv-p-b',
          type: TransactionType.CONSUMED,
          quantity: 1,
          orderItemId: 'oi-1',
        },
      ]);
      expect(cartDb.clearItems).toHaveBeenCalledWith(tx, 'cart-1');
    });
  });
});
