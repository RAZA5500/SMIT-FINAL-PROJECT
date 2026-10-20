import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  PAYMENT_GATEWAY,
  type PaymentGateway,
} from '../../infrastructure/payment/payment-gateway';
import { PaymentsDbService } from './payments.db.service';
import { RefundService } from './refund.service';
import {
  IPaymentEvent,
  PAYMENT_EVENT_TYPES,
  PaymentWithOrder,
} from './types/payment.types';

type SucceededOutcome = 'duplicate' | 'confirmed' | 'late';

/**
 * Payment ka asal nateeja webhook batata hai — browser ki "success" par bharosa
 * nahi. Signature pehle verify, phir guarded updates (FLOW-MD 01 §16).
 */
@Injectable()
export class PaymentWebhookService {
  private readonly logger = new Logger(PaymentWebhookService.name);

  constructor(
    private readonly paymentsDb: PaymentsDbService,
    private readonly refundService: RefundService,
    @Inject(PAYMENT_GATEWAY) private readonly gateway: PaymentGateway,
  ) {}

  async handle(
    rawBody: Buffer | undefined,
    signature: string | undefined,
  ): Promise<void> {
    if (!rawBody || !this.gateway.verifyEvent(rawBody, signature)) {
      throw new BadRequestException('Invalid webhook signature');
    }
    const event = this.parseEvent(rawBody);

    const payment = await this.paymentsDb.findByGatewayRef(event.gatewayRef);
    if (!payment) {
      this.logger.warn(
        `Ignoring ${event.type} for unknown payment ${event.gatewayRef}`,
      );
      return;
    }

    if (event.type === 'payment.succeeded') {
      await this.handleSucceeded(payment);
    } else {
      await this.handleFailed(payment);
    }
  }

  private async handleSucceeded(payment: PaymentWithOrder): Promise<void> {
    const outcome = await this.paymentsDb.transaction<SucceededOutcome>(
      async (tx) => {
        // UNPAID/FAILED → PAID; pehle se PAID ho to dobara process nahi (duplicate event)
        if ((await this.paymentsDb.markPaid(tx, payment.id)) === 0) {
          return 'duplicate';
        }
        if ((await this.paymentsDb.confirmOrder(tx, payment.orderId)) === 1) {
          await this.paymentsDb.incrementUserStats(
            tx,
            payment.order.userId,
            payment.order.total,
          );
          return 'confirmed';
        }
        // Order PENDING nahi raha (timeout/cancel) — paisa wapas karna hai
        await this.paymentsDb.markOrderPaymentPaid(tx, payment.orderId);
        return 'late';
      },
    );

    if (outcome === 'late') {
      this.logger.warn(
        `Late payment ${payment.id} for order ${payment.orderId} — refunding`,
      );
      await this.refundService.refundPayment(payment.id);
    }
  }

  private async handleFailed(payment: PaymentWithOrder): Promise<void> {
    await this.paymentsDb.transaction(async (tx) => {
      if ((await this.paymentsDb.markFailed(tx, payment.id)) === 1) {
        await this.paymentsDb.markOrderPaymentFailed(tx, payment.orderId);
      }
    });
  }

  private parseEvent(rawBody: Buffer): IPaymentEvent {
    let parsed: unknown;
    try {
      parsed = JSON.parse(rawBody.toString('utf8'));
    } catch {
      throw new BadRequestException('Invalid webhook payload');
    }
    const event = parsed as Partial<IPaymentEvent> | null;
    if (
      !event ||
      typeof event.id !== 'string' ||
      typeof event.gatewayRef !== 'string' ||
      !PAYMENT_EVENT_TYPES.includes(event.type as IPaymentEvent['type'])
    ) {
      throw new BadRequestException('Invalid webhook payload');
    }
    return event as IPaymentEvent;
  }
}
