import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Payment, PaymentStatus } from '@prisma/client';
import { randomUUID } from 'crypto';
import {
  PAYMENT_GATEWAY,
  type PaymentGateway,
} from '../../infrastructure/payment/payment-gateway';
import { MoneyService } from '../../shared/money/money.service';
import type { IAuthUser } from '../auth/types/auth.types';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { MockCompletePaymentDto } from './dto/mock-complete-payment.dto';
import { PaymentWebhookService } from './payment-webhook.service';
import { PaymentsDbService } from './payments.db.service';
import {
  IMockCompleteResult,
  IPaymentEvent,
  IPaymentInitiation,
} from './types/payment.types';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymentsDb: PaymentsDbService,
    private readonly webhookService: PaymentWebhookService,
    @Inject(PAYMENT_GATEWAY) private readonly gateway: PaymentGateway,
    private readonly money: MoneyService,
  ) {}

  /**
   * FLOW-MD 01 §15: apna PENDING order, total > 0, existing UNPAID payment reuse,
   * amount hamesha server ka `order.total`.
   */
  async initiate(
    user: IAuthUser,
    dto: InitiatePaymentDto,
  ): Promise<IPaymentInitiation> {
    const order = await this.paymentsDb.findPendingOrderForUser(
      dto.orderId,
      user.id,
    );
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (this.money.toPence(order.total) <= 0) {
      throw new BadRequestException('Order total must be greater than zero');
    }

    const existing = await this.paymentsDb.findUnpaidPayment(order.id);
    if (existing) return this.toInitiation(existing);

    // Har attempt ki apni idempotency key — parallel initiate ek hi intent paate hain
    const attempt = (await this.paymentsDb.countPayments(order.id)) + 1;
    const intent = await this.gateway.createIntent({
      amount: this.money.toDecimalString(order.total),
      idempotencyKey: `${order.id}:${attempt}`,
    });
    const payment = await this.paymentsDb.createOrGet({
      orderId: order.id,
      gatewayRef: intent.gatewayRef,
      amount: order.total,
    });
    return this.toInitiation(payment);
  }

  /**
   * Student mock: card form ki jagah outcome choose hota hai. Mock gateway signed
   * event banata hai jo wahi webhook handler process karta hai.
   */
  async mockComplete(
    user: IAuthUser,
    paymentId: string,
    dto: MockCompletePaymentDto,
  ): Promise<IMockCompleteResult> {
    const payment = await this.paymentsDb.findOwned(paymentId, user.id);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    // PAID / CANCELED / REFUNDED — kuch karne ko nahi (retry safe)
    if (
      payment.status !== PaymentStatus.UNPAID &&
      payment.status !== PaymentStatus.FAILED
    ) {
      return { status: payment.status };
    }

    const event: IPaymentEvent = {
      id: `evt_${randomUUID()}`,
      type:
        dto.outcome === 'succeeded' ? 'payment.succeeded' : 'payment.failed',
      gatewayRef: payment.gatewayRef,
    };
    const payload = Buffer.from(JSON.stringify(event));
    await this.webhookService.handle(payload, this.gateway.signEvent(payload));

    const updated = await this.paymentsDb.findById(paymentId);
    return { status: updated?.status ?? payment.status };
  }

  private toInitiation(payment: Payment): IPaymentInitiation {
    return {
      paymentId: payment.id,
      gatewayRef: payment.gatewayRef,
      amount: this.money.toDecimalString(payment.amount),
    };
  }
}
