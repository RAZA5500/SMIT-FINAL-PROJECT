import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrderCancellationService } from '../order-cancellation.service';
import { OrdersDbService } from '../orders.db.service';

const BATCH_SIZE = 50;

/**
 * Har minute: PENDING orders jin ka `paymentExpiresAt` guzar chuka — PAYMENT_TIMEOUT
 * se cancel, stock wapas (FLOW-MD 01 §17). Payment beech mein confirm ho jaye to
 * status guard cancel rok deta hai aur order skip hota hai.
 */
@Injectable()
export class PaymentTimeoutCron {
  private readonly logger = new Logger(PaymentTimeoutCron.name);

  constructor(
    private readonly ordersDb: OrdersDbService,
    private readonly orderCancellation: OrderCancellationService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE, { name: 'payment-timeout' })
  async handle(): Promise<number> {
    const expired = await this.ordersDb.findExpiredPendingOrderIds(
      new Date(),
      BATCH_SIZE,
    );
    let cancelled = 0;
    for (const { id } of expired) {
      try {
        if (await this.orderCancellation.cancelExpired(id)) cancelled++;
      } catch (error) {
        // Status badal gaya (paid / kisi aur ne cancel kiya) — skip
        if (
          error instanceof ConflictException ||
          error instanceof BadRequestException
        ) {
          continue;
        }
        this.logger.error(
          `Payment timeout cancel failed for order ${id}: ${(error as Error).message}`,
        );
      }
    }
    if (expired.length > 0) {
      this.logger.log(
        `Payment timeout: ${cancelled}/${expired.length} cancelled`,
      );
    }
    return cancelled;
  }
}
