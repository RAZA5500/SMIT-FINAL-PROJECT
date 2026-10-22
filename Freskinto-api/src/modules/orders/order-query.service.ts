import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  buildMeta,
  IPaginated,
} from '../../common/pagination/pagination.helper';
import { MoneyService } from '../../shared/money/money.service';
import type { IAuthUser } from '../auth/types/auth.types';
import {
  AdminOrdersQueryDto,
  CustomerOrdersQueryDto,
} from './dto/list-orders-query.dto';
import { toOrder, toOrderSummary } from './mappers/order.mapper';
import { OrdersDbService } from './orders.db.service';
import { IOrder, IOrderSummary } from './types/order.types';

export const ORDER_NOT_FOUND = 'Order not found';

@Injectable()
export class OrderQueryService {
  constructor(
    private readonly ordersDb: OrdersDbService,
    private readonly money: MoneyService,
  ) {}

  async listForCustomer(
    user: IAuthUser,
    query: CustomerOrdersQueryDto,
  ): Promise<IPaginated<IOrderSummary>> {
    const { orders, total } = await this.ordersDb.listForUser(
      user.id,
      query.page,
      query.limit,
      query.status,
    );
    return {
      data: orders.map((order) => toOrderSummary(order, this.money)),
      meta: buildMeta(total, query.page, query.limit),
    };
  }

  /** Doosre customer ka order → 404 (IDOR) */
  async getForCustomer(user: IAuthUser, orderId: string): Promise<IOrder> {
    const order = await this.ordersDb.findDetail(orderId, user.id);
    if (!order) {
      throw new NotFoundException(ORDER_NOT_FOUND);
    }
    return toOrder(order, this.money);
  }

  async listForAdmin(
    query: AdminOrdersQueryDto,
  ): Promise<IPaginated<IOrderSummary>> {
    if (
      query.dateFrom &&
      query.dateTo &&
      new Date(query.dateFrom) > new Date(query.dateTo)
    ) {
      throw new BadRequestException('dateFrom cannot be after dateTo');
    }
    const { orders, total } = await this.ordersDb.listAdmin(query);
    return {
      data: orders.map((order) => toOrderSummary(order, this.money)),
      meta: buildMeta(total, query.page, query.limit),
    };
  }

  async getForAdmin(orderId: string): Promise<IOrder> {
    const order = await this.ordersDb.findDetail(orderId);
    if (!order) {
      throw new NotFoundException(ORDER_NOT_FOUND);
    }
    return toOrder(order, this.money);
  }
}
