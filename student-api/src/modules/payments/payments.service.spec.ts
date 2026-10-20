import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Payment, PaymentStatus, Prisma, UserRole } from '@prisma/client';
import type { EnvironmentVariables } from '../../config/env.validation';
import { MockPaymentGateway } from '../../infrastructure/payment/mock-payment.gateway';
import { MoneyService } from '../../shared/money/money.service';
import type { IAuthUser } from '../auth/types/auth.types';
import { PaymentWebhookService } from './payment-webhook.service';
import { PaymentsDbService } from './payments.db.service';
import { PaymentsService } from './payments.service';

const customer: IAuthUser = {
  id: 'u1',
  email: 'c@test.local',
  name: 'C',
  role: UserRole.CUSTOMER,
};
const now = new Date('2026-01-01T00:00:00Z');

function paymentRow(status: PaymentStatus): Payment {
  return {
    id: 'pay-1',
    orderId: 'o1',
    gatewayRef: 'mock_pi_existing',
    amount: new Prisma.Decimal('24.90'),
    status,
    failureReason: null,
    paidAt: null,
    refundedAt: null,
    createdAt: now,
    updatedAt: now,
  };
}

describe('PaymentsService', () => {
  const gateway = new MockPaymentGateway({
    get: () => 'unit-test-webhook-secret',
  } as unknown as ConfigService<EnvironmentVariables, true>);
  let service: PaymentsService;
  let db: jest.Mocked<
    Pick<
      PaymentsDbService,
      | 'findPendingOrderForUser'
      | 'findUnpaidPayment'
      | 'countPayments'
      | 'createOrGet'
      | 'findOwned'
      | 'findById'
    >
  >;
  let webhook: jest.Mocked<Pick<PaymentWebhookService, 'handle'>>;

  beforeEach(() => {
    db = {
      findPendingOrderForUser: jest
        .fn()
        .mockResolvedValue({ id: 'o1', total: new Prisma.Decimal('24.90') }),
      findUnpaidPayment: jest.fn().mockResolvedValue(null),
      countPayments: jest.fn().mockResolvedValue(0),
      createOrGet: jest.fn((data: { gatewayRef: string }) =>
        Promise.resolve({
          ...paymentRow(PaymentStatus.UNPAID),
          gatewayRef: data.gatewayRef,
        }),
      ) as never,
      findOwned: jest.fn(),
      findById: jest.fn().mockResolvedValue({ status: PaymentStatus.PAID }),
    };
    webhook = { handle: jest.fn().mockResolvedValue(undefined) };
    service = new PaymentsService(
      db as unknown as PaymentsDbService,
      webhook as unknown as PaymentWebhookService,
      gateway,
      new MoneyService(),
    );
  });

  describe('initiate', () => {
    it("someone else's or non-PENDING order → 404", async () => {
      db.findPendingOrderForUser.mockResolvedValue(null);
      await expect(
        service.initiate(customer, { orderId: 'o1' }),
      ).rejects.toThrow(NotFoundException);
      expect(db.findPendingOrderForUser).toHaveBeenCalledWith('o1', 'u1');
    });

    it('zero total → 400', async () => {
      db.findPendingOrderForUser.mockResolvedValue({
        id: 'o1',
        total: new Prisma.Decimal(0),
      });
      await expect(
        service.initiate(customer, { orderId: 'o1' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('reuses an existing UNPAID payment instead of creating a new one', async () => {
      db.findUnpaidPayment.mockResolvedValue(paymentRow(PaymentStatus.UNPAID));
      const result = await service.initiate(customer, { orderId: 'o1' });
      expect(result).toEqual({
        paymentId: 'pay-1',
        gatewayRef: 'mock_pi_existing',
        amount: '24.90',
      });
      expect(db.createOrGet).not.toHaveBeenCalled();
    });

    it('creates a payment for the server-side order total with a per-attempt intent', async () => {
      const expected = await gateway.createIntent({
        amount: '24.90',
        idempotencyKey: 'o1:1',
      });
      const result = await service.initiate(customer, { orderId: 'o1' });
      expect(db.createOrGet).toHaveBeenCalledWith({
        orderId: 'o1',
        gatewayRef: expected.gatewayRef,
        amount: new Prisma.Decimal('24.90'),
      });
      expect(result.amount).toBe('24.90');
    });
  });

  describe('mockComplete', () => {
    it("someone else's payment → 404", async () => {
      db.findOwned.mockResolvedValue(null);
      await expect(
        service.mockComplete(customer, 'pay-1', { outcome: 'succeeded' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('already PAID → returns the status without emitting an event (retry safe)', async () => {
      db.findOwned.mockResolvedValue(paymentRow(PaymentStatus.PAID));
      await expect(
        service.mockComplete(customer, 'pay-1', { outcome: 'succeeded' }),
      ).resolves.toEqual({ status: PaymentStatus.PAID });
      expect(webhook.handle).not.toHaveBeenCalled();
    });

    it('emits a correctly signed payment.succeeded event through the webhook handler', async () => {
      db.findOwned.mockResolvedValue(paymentRow(PaymentStatus.UNPAID));
      const result = await service.mockComplete(customer, 'pay-1', {
        outcome: 'succeeded',
      });

      const [body, signature] = webhook.handle.mock.calls[0] as [
        Buffer,
        string,
      ];
      expect(gateway.verifyEvent(body, signature)).toBe(true);
      expect(JSON.parse(body.toString())).toMatchObject({
        type: 'payment.succeeded',
        gatewayRef: 'mock_pi_existing',
      });
      expect(result).toEqual({ status: PaymentStatus.PAID });
    });
  });
});
