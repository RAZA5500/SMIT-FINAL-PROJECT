import { Logger } from '@nestjs/common';
import { OrderStatus, PaymentStatus, Prisma } from '@prisma/client';
import {
  PaymentAlreadyRefundedError,
  type PaymentGateway,
} from '../../infrastructure/payment/payment-gateway';
import { MoneyService } from '../../shared/money/money.service';
import { PaymentsDbService } from './payments.db.service';
import { RefundService } from './refund.service';
import type { PaymentWithOrder } from './types/payment.types';

const tx = {};
const paidPayment = {
  id: 'pay-1',
  orderId: 'o1',
  gatewayRef: 'mock_pi_abc',
  amount: new Prisma.Decimal('24.90'),
  status: PaymentStatus.PAID,
  order: {
    id: 'o1',
    status: OrderStatus.REFUND_PENDING,
    userId: 'u1',
    total: new Prisma.Decimal('24.90'),
  },
} as PaymentWithOrder;

describe('RefundService', () => {
  let service: RefundService;
  let gateway: jest.Mocked<Pick<PaymentGateway, 'refund'>>;
  let db: jest.Mocked<
    Pick<
      PaymentsDbService,
      | 'findPaidPaymentIds'
      | 'findById'
      | 'transaction'
      | 'markRefunded'
      | 'completeRefundedOrder'
      | 'decrementUserSpent'
      | 'markCancelledOrderRefunded'
    >
  >;

  beforeEach(() => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    gateway = { refund: jest.fn().mockResolvedValue(undefined) };
    db = {
      findPaidPaymentIds: jest.fn().mockResolvedValue([{ id: 'pay-1' }]),
      findById: jest.fn().mockResolvedValue(paidPayment),
      transaction: jest.fn((fn: (t: never) => unknown) =>
        fn(tx as never),
      ) as never,
      markRefunded: jest.fn().mockResolvedValue(1),
      completeRefundedOrder: jest.fn().mockResolvedValue(1),
      decrementUserSpent: jest.fn().mockResolvedValue(undefined),
      markCancelledOrderRefunded: jest.fn().mockResolvedValue(undefined),
    };
    service = new RefundService(
      db as unknown as PaymentsDbService,
      gateway as unknown as PaymentGateway,
      new MoneyService(),
    );
  });

  it('refunds at the gateway, then PAID→REFUNDED, REFUND_PENDING→CANCELLED and totalSpent back', async () => {
    await expect(service.refundOrder('o1')).resolves.toBe(true);
    expect(gateway.refund).toHaveBeenCalledWith('mock_pi_abc', '24.90');
    expect(db.markRefunded).toHaveBeenCalledWith(tx, 'pay-1');
    expect(db.completeRefundedOrder).toHaveBeenCalledWith(tx, 'o1');
    expect(db.decrementUserSpent).toHaveBeenCalledWith(
      tx,
      'u1',
      paidPayment.order.total,
    );
  });

  it('gateway failure → false, nothing written (order stays REFUND_PENDING for the cron)', async () => {
    gateway.refund.mockRejectedValue(new Error('gateway down'));
    await expect(service.refundPayment('pay-1')).resolves.toBe(false);
    expect(db.markRefunded).not.toHaveBeenCalled();
  });

  it('"already refunded" from the gateway counts as success', async () => {
    gateway.refund.mockRejectedValue(
      new PaymentAlreadyRefundedError('mock_pi_abc'),
    );
    await expect(service.refundPayment('pay-1')).resolves.toBe(true);
    expect(db.markRefunded).toHaveBeenCalled();
  });

  it('late payment on a CANCELLED order: refunded without touching totalSpent', async () => {
    db.completeRefundedOrder.mockResolvedValue(0);
    await service.refundPayment('pay-1');
    expect(db.decrementUserSpent).not.toHaveBeenCalled();
    expect(db.markCancelledOrderRefunded).toHaveBeenCalledWith(tx, 'o1');
  });

  it('a concurrent refund already flipped the payment → no double effects', async () => {
    db.markRefunded.mockResolvedValue(0);
    await service.refundPayment('pay-1');
    expect(db.completeRefundedOrder).not.toHaveBeenCalled();
    expect(db.decrementUserSpent).not.toHaveBeenCalled();
  });

  it('a payment that is not PAID is skipped without calling the gateway', async () => {
    db.findById.mockResolvedValue({
      ...paidPayment,
      status: PaymentStatus.REFUNDED,
    });
    await expect(service.refundPayment('pay-1')).resolves.toBe(false);
    expect(gateway.refund).not.toHaveBeenCalled();
  });
});
