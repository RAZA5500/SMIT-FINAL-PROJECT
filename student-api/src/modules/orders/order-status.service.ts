import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeliveryType, OrderStatus, Prisma } from '@prisma/client';
import { ORDER_NOT_FOUND, OrderQueryService } from './order-query.service';
import { OrdersDbService } from './orders.db.service';
import {
  ADMIN_ALLOWED_TRANSITIONS,
  IOrder,
  ORDER_STATUS_LABELS,
  STATUS_CONFLICT_MESSAGE,
} from './types/order.types';

/** Admin fulfilment transitions (FLOW-MD 01 §19) */
@Injectable()
export class OrderStatusService {
  constructor(
    private readonly ordersDb: OrdersDbService,
    private readonly orderQuery: OrderQueryService,
  ) {}

  async updateStatus(orderId: string, next: OrderStatus): Promise<IOrder> {
    if (next === OrderStatus.CANCELLED) {
      throw new BadRequestException(
        'Use the cancel endpoint to cancel an order',
      );
    }

    const order = await this.ordersDb.findStatusInfo(orderId);
    if (!order) {
      throw new NotFoundException(ORDER_NOT_FOUND);
    }

    if (!ADMIN_ALLOWED_TRANSITIONS[order.status].includes(next)) {
      throw new BadRequestException(
        `Cannot change order status from ${ORDER_STATUS_LABELS[order.status]} to ${ORDER_STATUS_LABELS[next]}`,
      );
    }
    if (
      next === OrderStatus.READY_FOR_PICKUP &&
      order.deliveryType !== DeliveryType.PICKUP
    ) {
      throw new BadRequestException(
        'Only pickup orders can be marked Ready for Pickup',
      );
    }
    if (
      next === OrderStatus.READY_FOR_DELIVERY &&
      order.deliveryType !== DeliveryType.DELIVERY
    ) {
      throw new BadRequestException(
        'Only delivery orders can be marked Ready for Delivery',
      );
    }

    // Optimistic concurrency: expected current status WHERE mein
    const updated = await this.ordersDb.updateStatusGuarded(
      { id: order.id, status: order.status },
      { status: next, ...this.timestampFor(next) },
    );
    if (updated === 0) {
      throw new ConflictException(STATUS_CONFLICT_MESSAGE);
    }
    return this.orderQuery.getForAdmin(orderId);
  }

  private timestampFor(next: OrderStatus): Prisma.OrderUpdateManyMutationInput {
    const now = new Date();
    switch (next) {
      case OrderStatus.PROCESSING:
        return { processedAt: now };
      case OrderStatus.READY_FOR_PICKUP:
      case OrderStatus.READY_FOR_DELIVERY:
        return { readyAt: now };
      case OrderStatus.DELIVERED:
        return { deliveredAt: now };
      default:
        return {};
    }
  }
}
