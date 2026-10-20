import { Inject, Injectable, Logger } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import {
  PAYMENT_GATEWAY,
  PaymentAlreadyRefundedError,
  type PaymentGateway,
} from '../../infrastructure/payment/payment-gateway';
import { MoneyService } from '../../shared/money/money.service';
import { PaymentsDbService } from './payments.db.service';

/**
 * Refund hamesha DB commit ke BAAD (transaction ke andar network call nahi).
 * Fail ho to order REFUND_PENDING rehta hai aur refund-retry cron dobara try karta
 * hai — is liye yeh methods kabhi throw nahi karte (FLOW-MD 01 §2.9).
 */
@Injectable()
export class RefundService {
  private readonly logger = new Logger(RefundService.name);

  constructor(
    private readonly paymentsDb: PaymentsDbService,
    @Inject(PAYMENT_GATEWAY) private readonly gateway: PaymentGateway,
    private readonly money: MoneyService,
  ) {}

  /** Order ki saari PAID payments refund */
  async refundOrder(orderId: string): Promise<boolean> {
    try {
      const payments = await this.paymentsDb.findPaidPaymentIds(orderId);
      let refundedAll = true;
      for (const { id } of payments) {
        refundedAll = (await this.refundPayment(id)) && refundedAll;
      }
      return refundedAll;
    } catch (error) {
      this.logger.error(
        `Refund lookup failed for order ${orderId}: ${(error as Error).message}`,
      );
      return false;
    }
  }

  async refundPayment(paymentId: string): Promise<boolean> {
    try {
      const payment = await this.paymentsDb.findById(paymentId);
      if (!payment || payment.status !== PaymentStatus.PAID) return false;

      try {
        await this.gateway.refund(
          payment.gatewayRef,
          this.money.toDecimalString(payment.amount),
        );
      } catch (error) {
        // "Already refunded" = kaam pehle ho chuka — success
        if (!(error instanceof PaymentAlreadyRefundedError)) throw error;
      }

      await this.paymentsDb.transaction(async (tx) => {
        // Guard: sirf PAID → REFUNDED; doosra process pehle kar chuka ho to kuch nahi
        if ((await this.paymentsDb.markRefunded(tx, payment.id)) === 0) return;

        const completed = await this.paymentsDb.completeRefundedOrder(
          tx,
          payment.orderId,
        );
        if (completed === 1) {
          await this.paymentsDb.decrementUserSpent(
            tx,
            payment.order.userId,
            payment.order.total,
          );
          return;
        }
        // Late payment wala cancelled order — stats kabhi badhe hi nahi the
        await this.paymentsDb.markCancelledOrderRefunded(tx, payment.orderId);
      });
      return true;
    } catch (error) {
      this.logger.error(
        `Refund failed for payment ${paymentId} — will retry: ${(error as Error).message}`,
      );
      return false;
    }
  }
}
