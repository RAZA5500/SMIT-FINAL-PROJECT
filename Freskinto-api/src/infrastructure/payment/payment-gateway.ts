/** Injection token — business code sirf interface jaanta hai; baad mein real gateway swap ho sakta hai */
export const PAYMENT_GATEWAY = Symbol('PAYMENT_GATEWAY');

export interface ICreateIntentInput {
  /** Server ka order total, e.g. "24.90" — client kabhi amount nahi bhejta */
  amount: string;
  /** Same key → same intent (Stripe idempotency key jaisa) */
  idempotencyKey: string;
}

export interface IPaymentIntent {
  gatewayRef: string;
}

export interface PaymentGateway {
  createIntent(input: ICreateIntentInput): Promise<IPaymentIntent>;
  refund(gatewayRef: string, amount: string): Promise<void>;
  /** Webhook payload ka HMAC-SHA256 signature (hex) */
  signEvent(payload: Buffer | string): string;
  verifyEvent(payload: Buffer | string, signature: string | undefined): boolean;
}

/** Gateway kahe "pehle hi refund ho chuka" — retry safe, success maana jata hai */
export class PaymentAlreadyRefundedError extends Error {
  constructor(gatewayRef: string) {
    super(`Payment ${gatewayRef} is already refunded`);
  }
}
