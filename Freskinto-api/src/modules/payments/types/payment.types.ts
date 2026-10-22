import type { PaymentStatus, Prisma } from '@prisma/client';

export const PAYMENT_EVENT_TYPES = [
  'payment.succeeded',
  'payment.failed',
] as const;
export type PaymentEventType = (typeof PAYMENT_EVENT_TYPES)[number];

/** Webhook body: `{ id, type, gatewayRef }` (api-reference Part 2) */
export interface IPaymentEvent {
  id: string;
  type: PaymentEventType;
  gatewayRef: string;
}

export const MOCK_PAYMENT_OUTCOMES = ['succeeded', 'failed'] as const;
export type MockPaymentOutcome = (typeof MOCK_PAYMENT_OUTCOMES)[number];

export const paymentWithOrderInclude = {
  order: { select: { id: true, status: true, userId: true, total: true } },
} satisfies Prisma.PaymentInclude;

export type PaymentWithOrder = Prisma.PaymentGetPayload<{
  include: typeof paymentWithOrderInclude;
}>;

export interface IPaymentInitiation {
  paymentId: string;
  gatewayRef: string;
  amount: string;
}

export interface IMockCompleteResult {
  status: PaymentStatus;
}

export const PAYMENT_FAILED_REASON = 'Payment was declined by the gateway';
