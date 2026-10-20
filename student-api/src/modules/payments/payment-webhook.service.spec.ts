import { BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderStatus, PaymentStatus, Prisma } from '@prisma/client';
import type { EnvironmentVariables } from '../../config/env.validation';
import { MockPaymentGateway } from '../../infrastructure/payment/mock-payment.gateway';
import { PaymentWebhookService } from './payment-webhook.service';
import { PaymentsDbService } from './payments.db.service';
import { RefundService } from './refund.service';
import type { PaymentWithOrder } from './types/payment.types';

const tx = {};
const gateway = new MockPaymentGateway({
  get: () => 'unit-test-webhook-secret',
} as unknown as ConfigService<EnvironmentVariables, true>);

const payment = {
  id: 'pay-1',
  orderId: 'o1',
  gatewayRef: 'mock_pi_abc',
  status: PaymentStatus.UNPAID,
  order: {
    id: 'o1',
    status: OrderStatus.PENDING,
    userId: 'u1',
    total: new Prisma.Decimal('24.90'),
  },
} as PaymentWithOrder;

function signed(event: object) {
  const body = Buffer.from(JSON.stringify(event));
  return { body, signature: gateway.signEvent(body) };
}

describe('PaymentWebhookService', () => {
  let service: PaymentWebhookService;
  let db: jest.Mocked<
    Pick<
      PaymentsDbService,
      | 'transaction'
      | 'findByGatewayRef'
      | 'markPaid'
      | 'confirmOrder'
      | 'incrementUserStats'
      | 'markOrderPaymentPaid'
      | 'markFailed'
      | 'markOrderPaymentFailed'
    >
  >;
  let refundService: jest.Mocked<Pick<RefundService, 'refundPayment'>>;

  beforeEach(() => {
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
    db = {
      transaction: jest.fn((fn: (t: never) => unknown) =>
        fn(tx as never),
      ) as never,
      findByGatewayRef: jest.fn().mockResolvedValue(payment),
      markPaid: jest.fn().mockResolvedValue(1),
      confirmOrder: jest.fn().mockResolvedValue(1),
      incrementUserStats: jest.fn().mockResolvedValue(undefined),
      markOrderPaymentPaid: jest.fn().mockResolvedValue(undefined),
      markFailed: jest.fn().mockResolvedValue(1),
      markOrderPaymentFailed: jest.fn().mockResolvedValue(undefined),
    };
    refundService = { refundPayment: jest.fn().mockResolvedValue(true) };
    service = new PaymentWebhookService(
      db as unknown as PaymentsDbService,
      refundService as unknown as RefundService,
      gateway,
    );
  });

  const succeeded = {
    id: 'evt_1',
    type: 'payment.succeeded',
    gatewayRef: 'mock_pi_abc',
  };

  it('rejects an invalid or missing signature with 400 and touches nothing', async () => {
    const { body } = signed(succeeded);
    await expect(service.handle(body, 'deadbeef')).rejects.toThrow(
      new BadRequestException('Invalid webhook signature'),
    );
    await expect(service.handle(undefined, undefined)).rejects.toThrow(
      BadRequestException,
    );
    expect(db.findByGatewayRef).not.toHaveBeenCalled();
  });

  it('rejects a correctly signed but malformed payload', async () => {
    const { body, signature } = signed({
      id: 'evt_1',
      type: 'something.else',
      gatewayRef: 'x',
    });
    await expect(service.handle(body, signature)).rejects.toThrow(
      new BadRequestException('Invalid webhook payload'),
    );
  });

  it('ignores events for unknown payments', async () => {
    db.findByGatewayRef.mockResolvedValue(null);
    const { body, signature } = signed(succeeded);
    await expect(service.handle(body, signature)).resolves.toBeUndefined();
    expect(db.markPaid).not.toHaveBeenCalled();
  });

  it('succeeded: payment PAID, order CONFIRMED, user stats +1 with the order total', async () => {
    const { body, signature } = signed(succeeded);
    await service.handle(body, signature);
    expect(db.markPaid).toHaveBeenCalledWith(tx, 'pay-1');
    expect(db.confirmOrder).toHaveBeenCalledWith(tx, 'o1');
    expect(db.incrementUserStats).toHaveBeenCalledWith(
      tx,
      'u1',
      payment.order.total,
    );
    expect(refundService.refundPayment).not.toHaveBeenCalled();
  });

  it('the same succeeded event twice updates stats only once', async () => {
    db.markPaid.mockResolvedValueOnce(1).mockResolvedValueOnce(0);
    const { body, signature } = signed(succeeded);
    await service.handle(body, signature);
    await service.handle(body, signature);
    expect(db.incrementUserStats).toHaveBeenCalledTimes(1);
    expect(db.confirmOrder).toHaveBeenCalledTimes(1);
  });

  it('late success on a cancelled order: payment PAID, then refunded after commit', async () => {
    db.confirmOrder.mockResolvedValue(0);
    const { body, signature } = signed(succeeded);
    await service.handle(body, signature);
    expect(db.incrementUserStats).not.toHaveBeenCalled();
    expect(db.markOrderPaymentPaid).toHaveBeenCalledWith(tx, 'o1');
    expect(refundService.refundPayment).toHaveBeenCalledWith('pay-1');
  });

  it('failed: payment FAILED, order stays PENDING (only paymentStatus mirrored)', async () => {
    const { body, signature } = signed({
      ...succeeded,
      type: 'payment.failed',
    });
    await service.handle(body, signature);
    expect(db.markFailed).toHaveBeenCalledWith(tx, 'pay-1');
    expect(db.markOrderPaymentFailed).toHaveBeenCalledWith(tx, 'o1');
    expect(db.confirmOrder).not.toHaveBeenCalled();
  });
});
