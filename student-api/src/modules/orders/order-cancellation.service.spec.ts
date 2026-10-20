import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import {
  CancellationReason,
  OrderStatus,
  PaymentStatus,
  TransactionType,
  UserRole,
} from '@prisma/client';
import type { IAuthUser } from '../auth/types/auth.types';
import { InventoryDbService } from '../inventory/inventory.db.service';
import { PaymentsDbService } from '../payments/payments.db.service';
import { RefundService } from '../payments/refund.service';
import { OrderCancellationService } from './order-cancellation.service';
import { OrderQueryService } from './order-query.service';
import { OrdersDbService } from './orders.db.service';
import type { OrderForCancel } from './types/order.types';

const customer: IAuthUser = {
  id: 'u1',
  email: 'c@test.local',
  name: 'C',
  role: UserRole.CUSTOMER,
};
const tx = {};

function order(
  status: OrderStatus,
  paymentStatus: PaymentStatus = PaymentStatus.UNPAID,
): OrderForCancel {
  return {
    id: 'o1',
    userId: 'u1',
    status,
    paymentStatus,
    items: [{ id: 'oi-1' }],
  };
}

describe('OrderCancellationService', () => {
  let service: OrderCancellationService;
  let committed: boolean;
  let ordersDb: jest.Mocked<
    Pick<
      OrdersDbService,
      | 'transaction'
      | 'findForCancel'
      | 'updateStatusGuarded'
      | 'decrementTotalOrders'
    >
  >;
  let inventoryDb: jest.Mocked<
    Pick<
      InventoryDbService,
      | 'findConsumedByOrderItems'
      | 'lockByProductIds'
      | 'setQuantity'
      | 'createTransactions'
    >
  >;
  let paymentsDb: jest.Mocked<Pick<PaymentsDbService, 'cancelUnpaidPayments'>>;
  let refundService: jest.Mocked<Pick<RefundService, 'refundOrder'>>;

  beforeEach(() => {
    committed = false;
    ordersDb = {
      transaction: jest.fn(async (fn: (t: unknown) => Promise<unknown>) => {
        const result = await fn(tx);
        committed = true;
        return result;
      }) as never,
      findForCancel: jest.fn(),
      updateStatusGuarded: jest.fn().mockResolvedValue(1),
      decrementTotalOrders: jest.fn().mockResolvedValue(undefined),
    };
    inventoryDb = {
      findConsumedByOrderItems: jest.fn().mockResolvedValue([
        {
          inventoryId: 'inv-1',
          orderItemId: 'oi-1',
          quantity: 3,
          inventory: { productId: 'p1' },
        },
      ]),
      lockByProductIds: jest
        .fn()
        .mockResolvedValue([
          { id: 'inv-1', productId: 'p1', qtyOnHand: 2, lowStockThreshold: 5 },
        ]),
      setQuantity: jest.fn().mockResolvedValue(undefined) as never,
      createTransactions: jest.fn().mockResolvedValue(undefined),
    };
    paymentsDb = {
      cancelUnpaidPayments: jest.fn<Promise<void>, [string]>(() => {
        expect(committed).toBe(true);
        return Promise.resolve();
      }),
    };
    refundService = {
      refundOrder: jest.fn<Promise<boolean>, [string]>(() => {
        expect(committed).toBe(true); // refund sirf commit ke BAAD
        return Promise.resolve(true);
      }),
    };
    service = new OrderCancellationService(
      ordersDb as unknown as OrdersDbService,
      inventoryDb as unknown as InventoryDbService,
      paymentsDb as unknown as PaymentsDbService,
      refundService as unknown as RefundService,
      {
        getForCustomer: jest.fn().mockResolvedValue({ id: 'o1' }),
        getForAdmin: jest.fn().mockResolvedValue({ id: 'o1' }),
      } as unknown as OrderQueryService,
    );
  });

  describe('customer', () => {
    it('cannot cancel a PROCESSING order (400)', async () => {
      ordersDb.findForCancel.mockResolvedValue(
        order(OrderStatus.PROCESSING, PaymentStatus.PAID),
      );
      await expect(
        service.cancelByCustomer(customer, 'o1', {
          reason: CancellationReason.CHANGED_MIND,
        }),
      ).rejects.toThrow(
        new BadRequestException(
          'Order cannot be cancelled once it is in Processing status. Please contact support.',
        ),
      );
    });

    it('OTHER without a note → 400 before touching the database', async () => {
      await expect(
        service.cancelByCustomer(customer, 'o1', {
          reason: CancellationReason.OTHER,
        }),
      ).rejects.toThrow(
        new BadRequestException('A note is required when the reason is OTHER'),
      );
      expect(ordersDb.transaction).not.toHaveBeenCalled();
    });

    it('unpaid PENDING → CANCELLED, stock restored from CONSUMED rows, unpaid payment cancelled after commit', async () => {
      ordersDb.findForCancel.mockResolvedValue(order(OrderStatus.PENDING));
      await service.cancelByCustomer(customer, 'o1', {
        reason: CancellationReason.CHANGED_MIND,
      });

      expect(ordersDb.findForCancel).toHaveBeenCalledWith(tx, 'o1', 'u1');
      expect(ordersDb.updateStatusGuarded).toHaveBeenCalledWith(
        { id: 'o1', status: OrderStatus.PENDING, userId: 'u1' },
        expect.objectContaining({
          status: OrderStatus.CANCELLED,
          cancellationReason: CancellationReason.CHANGED_MIND,
        }),
        tx,
      );
      expect(inventoryDb.setQuantity).toHaveBeenCalledWith(
        tx,
        { id: 'inv-1', productId: 'p1', qtyOnHand: 2, lowStockThreshold: 5 },
        5,
      );
      expect(inventoryDb.createTransactions).toHaveBeenCalledWith(tx, [
        {
          inventoryId: 'inv-1',
          type: TransactionType.RELEASED,
          quantity: 3,
          orderItemId: 'oi-1',
        },
      ]);
      expect(paymentsDb.cancelUnpaidPayments).toHaveBeenCalledWith('o1');
      expect(refundService.refundOrder).not.toHaveBeenCalled();
      expect(ordersDb.decrementTotalOrders).not.toHaveBeenCalled();
    });

    it('paid CONFIRMED → REFUND_PENDING, totalOrders −1, refund after commit', async () => {
      ordersDb.findForCancel.mockResolvedValue(
        order(OrderStatus.CONFIRMED, PaymentStatus.PAID),
      );
      await service.cancelByCustomer(customer, 'o1', {
        reason: CancellationReason.OTHER,
        note: 'Not needed anymore',
      });
      expect(ordersDb.updateStatusGuarded).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          status: OrderStatus.REFUND_PENDING,
          cancellationNote: 'Not needed anymore',
        }),
        tx,
      );
      expect(ordersDb.decrementTotalOrders).toHaveBeenCalledWith(tx, 'u1');
      expect(refundService.refundOrder).toHaveBeenCalledWith('o1');
    });

    it('already cancelled → success without doing anything again', async () => {
      ordersDb.findForCancel.mockResolvedValue(order(OrderStatus.CANCELLED));
      await expect(
        service.cancelByCustomer(customer, 'o1', {
          reason: CancellationReason.CHANGED_MIND,
        }),
      ).resolves.toEqual({ id: 'o1' });
      expect(ordersDb.updateStatusGuarded).not.toHaveBeenCalled();
      expect(inventoryDb.createTransactions).not.toHaveBeenCalled();
    });

    it("someone else's order → 404", async () => {
      ordersDb.findForCancel.mockResolvedValue(null);
      await expect(
        service.cancelByCustomer(customer, 'o1', {
          reason: CancellationReason.CHANGED_MIND,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('status changed concurrently (guard count 0) → 409 and no stock restore', async () => {
      ordersDb.findForCancel.mockResolvedValue(order(OrderStatus.PENDING));
      ordersDb.updateStatusGuarded.mockResolvedValue(0);
      await expect(
        service.cancelByCustomer(customer, 'o1', {
          reason: CancellationReason.CHANGED_MIND,
        }),
      ).rejects.toThrow(ConflictException);
      expect(inventoryDb.setQuantity).not.toHaveBeenCalled();
    });
  });

  describe('admin', () => {
    it('can cancel a paid READY_FOR_DELIVERY order (→ REFUND_PENDING)', async () => {
      ordersDb.findForCancel.mockResolvedValue(
        order(OrderStatus.READY_FOR_DELIVERY, PaymentStatus.PAID),
      );
      await service.cancelByAdmin('o1', {
        reason: CancellationReason.OUT_OF_STOCK,
      });
      expect(ordersDb.findForCancel).toHaveBeenCalledWith(tx, 'o1', undefined);
      expect(refundService.refundOrder).toHaveBeenCalledWith('o1');
    });

    it('DELIVERED or already CANCELLED → 400', async () => {
      ordersDb.findForCancel.mockResolvedValue(
        order(OrderStatus.DELIVERED, PaymentStatus.PAID),
      );
      await expect(
        service.cancelByAdmin('o1', {
          reason: CancellationReason.CUSTOMER_REQUEST,
        }),
      ).rejects.toThrow(BadRequestException);

      ordersDb.findForCancel.mockResolvedValue(order(OrderStatus.CANCELLED));
      await expect(
        service.cancelByAdmin('o1', {
          reason: CancellationReason.CUSTOMER_REQUEST,
        }),
      ).rejects.toThrow(new BadRequestException('Order is already cancelled'));
    });
  });

  describe('payment timeout', () => {
    it('cancels only from PENDING with reason PAYMENT_TIMEOUT', async () => {
      ordersDb.findForCancel.mockResolvedValue(order(OrderStatus.PENDING));
      await expect(service.cancelExpired('o1')).resolves.toBe(true);
      expect(ordersDb.updateStatusGuarded).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          cancellationReason: CancellationReason.PAYMENT_TIMEOUT,
        }),
        tx,
      );
    });

    it('a CONFIRMED (paid in the meantime) order is not cancelled', async () => {
      ordersDb.findForCancel.mockResolvedValue(
        order(OrderStatus.CONFIRMED, PaymentStatus.PAID),
      );
      await expect(service.cancelExpired('o1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
