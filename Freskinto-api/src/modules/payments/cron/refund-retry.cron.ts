import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PaymentsDbService } from '../payments.db.service';
import { RefundService } from '../refund.service';

const BATCH_SIZE = 50;

/** Har 5 minute: REFUND_PENDING (aur late-paid cancelled) orders ka refund dobara try */
@Injectable()
export class RefundRetryCron {
  private readonly logger = new Logger(RefundRetryCron.name);

  constructor(
    private readonly paymentsDb: PaymentsDbService,
    private readonly refundService: RefundService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES, { name: 'refund-retry' })
  async handle(): Promise<number> {
    const payments =
      await this.paymentsDb.findPaidPaymentIdsNeedingRefund(BATCH_SIZE);
    let refunded = 0;
    for (const { id } of payments) {
      if (await this.refundService.refundPayment(id)) refunded++;
    }
    if (payments.length > 0) {
      this.logger.log(`Refund retry: ${refunded}/${payments.length} refunded`);
    }
    return refunded;
  }
}
