import { Injectable } from '@nestjs/common';
import { OrderStatus, Prisma } from '@prisma/client';
import { toSkipTake } from '../../common/pagination/pagination.helper';
import { DatabaseService } from '../../database/database.service';
import type { TransactionClient } from '../../database/database.types';
import {
  IAdminOrdersFilter,
  ICreateOrderData,
  OrderDetailRecord,
  orderDetailInclude,
  OrderForCancel,
  orderForCancelSelect,
  orderSummaryInclude,
  OrderSummaryRecord,
} from './types/order.types';

/** Order + cancel transactions mein row locks ka intezar ho sakta hai — default 5s se zyada */
const ORDER_TX_OPTIONS = { maxWait: 10_000, timeout: 20_000 };

@Injectable()
export class OrdersDbService {
  constructor(private readonly db: DatabaseService) {}

  transaction<T>(fn: (tx: TransactionClient) => Promise<T>): Promise<T> {
    return this.db.$transaction(fn, ORDER_TX_OPTIONS);
  }

  /** Race-safe order number — MAX()+1 nahi, DB sequence */
  async nextOrderNumber(): Promise<number> {
    const [row] = await this.db.$queryRaw<{ value: bigint }[]>`
      SELECT nextval('order_number_seq') AS value`;
    return Number(row.value);
  }

  createOrder(tx: TransactionClient, data: ICreateOrderData) {
    return tx.order.create({
      data: {
        orderNumber: data.orderNumber,
        userId: data.userId,
        deliveryType: data.deliveryType,
        subtotal: data.subtotal,
        shippingCost: data.shippingCost,
        total: data.total,
        customerNotes: data.customerNotes,
        pickupScheduledAt: data.pickupScheduledAt,
        paymentExpiresAt: data.paymentExpiresAt,
        items: { create: data.items },
        ...(data.address && { address: { create: data.address } }),
      },
      select: {
        id: true,
        items: { select: { id: true, productId: true, quantity: true } },
      },
    });
  }

  /** userId do to sirf usi customer ka order (ownership) */
  findDetail(id: string, userId?: string): Promise<OrderDetailRecord | null> {
    return this.db.order.findFirst({
      where: { id, ...(userId && { userId }) },
      include: orderDetailInclude,
    });
  }

  async listForUser(
    userId: string,
    page: number,
    limit: number,
    status?: OrderStatus,
  ): Promise<{ orders: OrderSummaryRecord[]; total: number }> {
    const where: Prisma.OrderWhereInput = {
      userId,
      ...(status && { status }),
    };
    return this.list(where, page, limit);
  }

  listAdmin(
    filter: IAdminOrdersFilter,
  ): Promise<{ orders: OrderSummaryRecord[]; total: number }> {
    const where: Prisma.OrderWhereInput = {
      ...(filter.status && { status: filter.status }),
      ...(filter.paymentStatus && { paymentStatus: filter.paymentStatus }),
      ...(filter.search && {
        OR: [
          { orderNumber: { contains: filter.search, mode: 'insensitive' } },
          { user: { name: { contains: filter.search, mode: 'insensitive' } } },
          { user: { email: { contains: filter.search, mode: 'insensitive' } } },
        ],
      }),
      ...((filter.dateFrom || filter.dateTo) && {
        createdAt: {
          ...(filter.dateFrom && { gte: new Date(filter.dateFrom) }),
          ...(filter.dateTo && { lte: new Date(filter.dateTo) }),
        },
      }),
    };
    return this.list(where, filter.page, filter.limit);
  }

  findForCancel(
    tx: TransactionClient,
    id: string,
    userId?: string,
  ): Promise<OrderForCancel | null> {
    return tx.order.findFirst({
      where: { id, ...(userId && { userId }) },
      select: orderForCancelSelect,
    });
  }

  findStatusInfo(id: string) {
    return this.db.order.findUnique({
      where: { id },
      select: { id: true, status: true, deliveryType: true },
    });
  }

  /**
   * Optimistic concurrency: sirf tab update jab status abhi bhi `expected` ho.
   * `0` return = kisi aur ne pehle badal diya → caller 409 deta hai.
   */
  async updateStatusGuarded(
    where: { id: string; status: OrderStatus; userId?: string },
    data: Prisma.OrderUpdateManyMutationInput,
    tx: TransactionClient = this.db,
  ): Promise<number> {
    const { count } = await tx.order.updateMany({
      where: {
        id: where.id,
        status: where.status,
        ...(where.userId && { userId: where.userId }),
      },
      data,
    });
    return count;
  }

  async decrementTotalOrders(
    tx: TransactionClient,
    userId: string,
  ): Promise<void> {
    await tx.user.update({
      where: { id: userId },
      data: { totalOrders: { decrement: 1 } },
    });
  }

  /** Payment timeout backstop — PENDING aur expiry guzar chuki */
  findExpiredPendingOrderIds(now: Date, limit: number) {
    return this.db.order.findMany({
      where: { status: OrderStatus.PENDING, paymentExpiresAt: { lt: now } },
      select: { id: true },
      orderBy: { paymentExpiresAt: 'asc' },
      take: limit,
    });
  }

  private async list(
    where: Prisma.OrderWhereInput,
    page: number,
    limit: number,
  ): Promise<{ orders: OrderSummaryRecord[]; total: number }> {
    const [orders, total] = await Promise.all([
      this.db.order.findMany({
        where,
        include: orderSummaryInclude,
        orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
        ...toSkipTake(page, limit),
      }),
      this.db.order.count({ where }),
    ]);
    return { orders, total };
  }
}
