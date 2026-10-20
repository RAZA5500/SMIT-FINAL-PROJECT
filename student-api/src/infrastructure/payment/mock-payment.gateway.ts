import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, createHmac, timingSafeEqual } from 'crypto';
import type { EnvironmentVariables } from '../../config/env.validation';
import type {
  ICreateIntentInput,
  IPaymentIntent,
  PaymentGateway,
} from './payment-gateway';

/**
 * Stripe ki jagah mock gateway (FLOW-MD README deviations). Concept same:
 * intent banta hai, nateeja signed webhook event ki tarah aata hai.
 */
@Injectable()
export class MockPaymentGateway implements PaymentGateway {
  private readonly webhookSecret: string;

  constructor(config: ConfigService<EnvironmentVariables, true>) {
    this.webhookSecret = config.get('PAYMENT_WEBHOOK_SECRET', { infer: true });
  }

  /** Deterministic ref: same idempotency key par hamesha same gatewayRef */
  createIntent({
    idempotencyKey,
  }: ICreateIntentInput): Promise<IPaymentIntent> {
    const hash = createHash('sha256').update(idempotencyKey).digest('hex');
    return Promise.resolve({ gatewayRef: `mock_pi_${hash.slice(0, 24)}` });
  }

  refund(): Promise<void> {
    return Promise.resolve();
  }

  signEvent(payload: Buffer | string): string {
    return createHmac('sha256', this.webhookSecret)
      .update(payload)
      .digest('hex');
  }

  /** Constant-time comparison — signature ka andaza timing se na lagaya ja sake */
  verifyEvent(
    payload: Buffer | string,
    signature: string | undefined,
  ): boolean {
    if (!signature) return false;
    const expected = Buffer.from(this.signEvent(payload), 'hex');
    const received = Buffer.from(signature, 'hex');
    return (
      received.length === expected.length && timingSafeEqual(received, expected)
    );
  }
}
