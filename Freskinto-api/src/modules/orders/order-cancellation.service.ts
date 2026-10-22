import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CancellationReason,
  OrderStatus,
  PaymentStatus,
  TransactionType,
} from '@prisma/client';
import type { TransactionClient } from '../../database/database.types';
import type { IAuthUser } from '../auth/types/auth.types';
import { InventoryDbService } from '../inventory/inventory.db.service';
import { PaymentsDbService } from '../payments/payments.db.service';
import { RefundService } from '../payments/refund.service';
import {
  AdminCancelOrderDto,
  CustomerCancelOrderDto,
} from './dto/cancel-order.dto';
import { ORDER_NOT_FOUND, OrderQueryService } from './order-query.service';
import { OrdersDbService } from './orders.db.service';
import {
  ADMIN_CANCELLABLE_STATUSES,
  CUSTOMER_CANCELLABLE_STATUSES,
  IOrder,
  ORDER_STATUS_LABELS,
  OrderForCancel,
  STATUS_CONFLICT_MESSAGE,
} from './types/order.types';

interface ICancelParams {
  orderId: string;
  /** Customer cancel: sirf apna order */
  userId?: string;
  allowed: OrderStatus[];
  reason: CancellationReason;
  note: string | null;
  /** Customer: dobara cancel = success; admin: 400 */
  alreadyCancelledIsOk: boolean;
}

type CancelOutcome = 'already-cancelled' | 'cancelled' | 'refund-pending';

/**
 * Customer, admin aur system (payment timeout) — teeno ka EK shared cancel
 * function (FLOW-MD 01 §18, §20). Refund / payment cancel commit ke BAAD.
 */
@Injectable()
export class OrderCancellationService {
  private readonly logger = new Logger(OrderCancellationService.name);

  constructor(
    private readonly ordersDb: OrdersDbService,
    private readonly inventoryDb: InventoryDbService,
    private readonly paymentsDb: PaymentsDbService,
    private readonly refundService: RefundService,
    private readonly orderQuery: OrderQueryService,
  ) {}

  async cancelByCustomer(
    user: IAuthUser,
    orderId: string,
    dto: CustomerCancelOrderDto,
  ): Promise<IOrder> {
    await this.cancel({
      orderId,
      userId: user.id,
      allowed: CUSTOMER_CANCELLABLE_STATUSES,
      reason: dto.reason,
      note: dto.note || null,
      alreadyCancelledIsOk: true,
    });
    return this.orderQuery.getForCustomer(user, orderId);
  }

  async cancelByAdmin(
    orderId: string,
    dto: AdminCancelOrderDto,
  ): Promise<IOrder> {
    await this.cancel({
      orderId,
      allowed: ADMIN_CANCELLABLE_STATUSES,
      reason: dto.reason,
      note: dto.note || null,
      alreadyCancelledIsOk: false,
    });
    return this.orderQuery.getForAdmin(orderId);
  }

  /** Payment timeout cron — sirf PENDING source status se */
  async cancelExpired(orderId: string): Promise<boolean> {
    const outcome = await this.cancel({
      orderId,
      allowed: [OrderStatus.PENDING],
      reason: CancellationReason.PAYMENT_TIMEOUT,
      note: null,
      alreadyCancelledIsOk: true,
    });
    return outcome === 'cancelled';
  }

  private async cancel(params: ICancelParams): Promise<CancelOutcome> {
    if (params.reason === CancellationReason.OTHER && !params.note) {
      throw new BadRequestException(
        'A note is required when the reason is OTHER',
      );
    }

    const outcome = await this.ordersDb.transaction<CancelOutcome>(
      async (tx) => {
        const order = await this.ordersDb.findForCancel(
          tx,
          params.orderId,
          params.userId,
        );
        if (!order) {
          throw new NotFoundException(ORDER_NOT_FOUND);
        }
        if (order.status === OrderStatus.CANCELLED) {
          if (params.alreadyCancelledIsOk) return 'already-cancelled';
          throw new BadRequestException('Order is already cancelled');
        }
        if (!params.allowed.includes(order.status)) {
          throw new BadRequestException(
            `Order cannot be cancelled once it is in ${ORDER_STATUS_LABELS[order.status]} status. Please contact support.`,
          );
        }

        const paid = order.paymentStatus === PaymentStatus.PAID;
        // Guard: read kiya hua status hi abhi bhi ho — warna kisi ne pehle badal diya
        const updated = await this.ordersDb.updateStatusGuarded(
          { id: order.id, status: order.status, userId: params.userId },
          {
            status: paid ? OrderStatus.REFUND_PENDING : OrderStatus.CANCELLED,
            cancelledAt: new Date(),
            cancellationReason: params.reason,
            cancellationNote: params.note,
          },
          tx,
        );
        if (updated === 0) {
          throw new ConflictException(STATUS_CONFLICT_MESSAGE);
        }

        await this.restoreStock(tx, order);
        if (paid) {
          await this.ordersDb.decrementTotalOrders(tx, order.userId);
        }
        return paid ? 'refund-pending' : 'cancelled';
      },
    );

    // ---- Commit ke baad side effects (transaction ke andar network call nahi) ----
    if (outcome === 'refund-pending') {
      // Fail ho to order REFUND_PENDING rehta hai; refund-retry cron uthata hai
      await this.refundService.refundOrder(params.orderId);
    } else if (outcome === 'cancelled') {
      await this.cancelUnpaidPayments(params.orderId);
    }
    return outcome;
  }

  /** CONSUMED ledger se exact quantities wapas + RELEASED rows */
  private async restoreStock(
    tx: TransactionClient,
    order: OrderForCancel,
  ): Promise<void> {
    const consumed = await this.inventoryDb.findConsumedByOrderItems(
      tx,
      order.items.map((item) => item.id),
    );
    if (consumed.length === 0) return;

    const locked = await this.inventoryDb.lockByProductIds(tx, [
      ...new Set(consumed.map((row) => row.inventory.productId)),
    ]);
    for (const row of locked) {
      const restored = consumed
        .filter((entry) => entry.inventoryId === row.id)
        .reduce((sum, entry) => sum + entry.quantity, 0);
      await this.inventoryDb.setQuantity(tx, row, row.qtyOnHand + restored);
    }

    await this.inventoryDb.createTransactions(
      tx,
      consumed.map((entry) => ({
        inventoryId: entry.inventoryId,
        type: TransactionType.RELEASED,
        quantity: entry.quantity,
        orderItemId: entry.orderItemId,
      })),
    );
  }

  /** Best-effort — fail ho to bhi order cancel rehta hai */
  private async cancelUnpaidPayments(orderId: string): Promise<void> {
    try {
      await this.paymentsDb.cancelUnpaidPayments(orderId);
    } catch (error) {
      this.logger.warn(
        `Could not cancel unpaid payments for order ${orderId}: ${(error as Error).message}`,
      );
    }
  }
}
