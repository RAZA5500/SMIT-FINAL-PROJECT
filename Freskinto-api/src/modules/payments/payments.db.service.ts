import { Injectable } from '@nestjs/common';
import { OrderStatus, Payment, PaymentStatus, Prisma } from '@prisma/client';
import { DatabaseService } from '../../database/database.service';
import type { TransactionClient } from '../../database/database.types';
import { isUniqueViolation } from '../../database/prisma-errors';
import {
  PAYMENT_FAILED_REASON,
  paymentWithOrderInclude,
  PaymentWithOrder,
} from './types/payment.types';

/**
 * Har state change `WHERE status = expected` guarded `updateMany` hai — duplicate
 * webhook / retry same effect dobara nahi kar sakta (count 0 = pehle ho chuka).
 */
@Injectable()
export class PaymentsDbService {
  constructor(private readonly db: DatabaseService) {}

  transaction<T>(fn: (tx: TransactionClient) => Promise<T>): Promise<T> {
    return this.db.$transaction(fn);
  }

  findPendingOrderForUser(orderId: string, userId: string) {
    return this.db.order.findFirst({
      where: { id: orderId, userId, status: OrderStatus.PENDING },
      select: { id: true, total: true },
    });
  }

  findUnpaidPayment(orderId: string): Promise<Payment | null> {
    return this.db.payment.findFirst({
      where: { orderId, status: PaymentStatus.UNPAID },
      orderBy: { createdAt: 'desc' },
    });
  }

  countPayments(orderId: string): Promise<number> {
    return this.db.payment.count({ where: { orderId } });
  }

  /** Parallel initiate same gatewayRef banate hain — unique constraint ek row rakhta hai */
  async createOrGet(data: {
    orderId: string;
    gatewayRef: string;
    amount: Prisma.Decimal;
  }): Promise<Payment> {
    try {
      return await this.db.payment.create({
        data: { ...data, status: PaymentStatus.UNPAID },
      });
    } catch (error) {
      if (isUniqueViolation(error)) {
        return this.db.payment.findUniqueOrThrow({
          where: { gatewayRef: data.gatewayRef },
        });
      }
      throw error;
    }
  }

  findByGatewayRef(gatewayRef: string): Promise<PaymentWithOrder | null> {
    return this.db.payment.findUnique({
      where: { gatewayRef },
      include: paymentWithOrderInclude,
    });
  }

  findById(id: string): Promise<PaymentWithOrder | null> {
    return this.db.payment.findUnique({
      where: { id },
      include: paymentWithOrderInclude,
    });
  }

  /** Ownership: payment ka order isi customer ka */
  findOwned(id: string, userId: string): Promise<Payment | null> {
    return this.db.payment.findFirst({ where: { id, order: { userId } } });
  }

  // ---- Payment succeeded ----

  async markPaid(tx: TransactionClient, paymentId: string): Promise<number> {
    const { count } = await tx.payment.updateMany({
      where: {
        id: paymentId,
        status: { in: [PaymentStatus.UNPAID, PaymentStatus.FAILED] },
      },
      data: {
        status: PaymentStatus.PAID,
        paidAt: new Date(),
        failureReason: null,
      },
    });
    return count;
  }

  async confirmOrder(tx: TransactionClient, orderId: string): Promise<number> {
    const { count } = await tx.order.updateMany({
      where: { id: orderId, status: OrderStatus.PENDING },
      data: {
        status: OrderStatus.CONFIRMED,
        paymentStatus: PaymentStatus.PAID,
        confirmedAt: new Date(),
      },
    });
    return count;
  }

  async incrementUserStats(
    tx: TransactionClient,
    userId: string,
    total: Prisma.Decimal,
  ): Promise<void> {
    await tx.user.update({
      where: { id: userId },
      data: { totalOrders: { increment: 1 }, totalSpent: { increment: total } },
    });
  }

  /** Late payment: order pehle hi cancel — payment PAID dikhayein, refund baad mein */
  async markOrderPaymentPaid(
    tx: TransactionClient,
    orderId: string,
  ): Promise<void> {
    await tx.order.updateMany({
      where: { id: orderId, status: OrderStatus.CANCELLED },
      data: { paymentStatus: PaymentStatus.PAID },
    });
  }

  // ---- Payment failed ----

  async markFailed(tx: TransactionClient, paymentId: string): Promise<number> {
    const { count } = await tx.payment.updateMany({
      where: { id: paymentId, status: PaymentStatus.UNPAID },
      data: {
        status: PaymentStatus.FAILED,
        failureReason: PAYMENT_FAILED_REASON,
      },
    });
    return count;
  }

  /** Order PENDING hi rehta hai — customer dobara try kar sakta hai */
  async markOrderPaymentFailed(
    tx: TransactionClient,
    orderId: string,
  ): Promise<void> {
    await tx.order.updateMany({
      where: { id: orderId, status: OrderStatus.PENDING },
      data: { paymentStatus: PaymentStatus.FAILED },
    });
  }

  // ---- Refund ----

  findPaidPaymentIds(orderId: string): Promise<{ id: string }[]> {
    return this.db.payment.findMany({
      where: { orderId, status: PaymentStatus.PAID },
      select: { id: true },
    });
  }

  /** Refund retry cron: PAID payments jin ka order cancel / refund-pending hai */
  findPaidPaymentIdsNeedingRefund(limit: number): Promise<{ id: string }[]> {
    return this.db.payment.findMany({
      where: {
        status: PaymentStatus.PAID,
        order: {
          status: { in: [OrderStatus.REFUND_PENDING, OrderStatus.CANCELLED] },
        },
      },
      select: { id: true },
      orderBy: { updatedAt: 'asc' },
      take: limit,
    });
  }

  async markRefunded(
    tx: TransactionClient,
    paymentId: string,
  ): Promise<number> {
    const { count } = await tx.payment.updateMany({
      where: { id: paymentId, status: PaymentStatus.PAID },
      data: { status: PaymentStatus.REFUNDED, refundedAt: new Date() },
    });
    return count;
  }

  /** REFUND_PENDING → CANCELLED, paymentStatus REFUNDED */
  async completeRefundedOrder(
    tx: TransactionClient,
    orderId: string,
  ): Promise<number> {
    const { count } = await tx.order.updateMany({
      where: { id: orderId, status: OrderStatus.REFUND_PENDING },
      data: {
        status: OrderStatus.CANCELLED,
        paymentStatus: PaymentStatus.REFUNDED,
      },
    });
    return count;
  }

  async markCancelledOrderRefunded(
    tx: TransactionClient,
    orderId: string,
  ): Promise<void> {
    await tx.order.updateMany({
      where: { id: orderId, status: OrderStatus.CANCELLED },
      data: { paymentStatus: PaymentStatus.REFUNDED },
    });
  }

  async decrementUserSpent(
    tx: TransactionClient,
    userId: string,
    total: Prisma.Decimal,
  ): Promise<void> {
    await tx.user.update({
      where: { id: userId },
      data: { totalSpent: { decrement: total } },
    });
  }

  // ---- Unpaid order cancel ----

  /** Order cancel hone ke baad UNPAID payment → CANCELED (best-effort, commit ke baad) */
  async cancelUnpaidPayments(orderId: string): Promise<void> {
    await this.db.payment.updateMany({
      where: { orderId, status: PaymentStatus.UNPAID },
      data: { status: PaymentStatus.CANCELED },
    });
  }
}
