import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import type { IPaginated } from '../../common/pagination/pagination.helper';
import { AdminCancelOrderDto } from './dto/cancel-order.dto';
import { AdminOrdersQueryDto } from './dto/list-orders-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderCancellationService } from './order-cancellation.service';
import { OrderQueryService } from './order-query.service';
import { OrderStatusService } from './order-status.service';
import type { IOrder, IOrderSummary } from './types/order.types';

@Roles('ADMIN')
@Controller('admin/orders')
export class AdminOrdersController {
  constructor(
    private readonly orderQuery: OrderQueryService,
    private readonly orderStatus: OrderStatusService,
    private readonly orderCancellation: OrderCancellationService,
  ) {}

  @Get()
  list(
    @Query() query: AdminOrdersQueryDto,
  ): Promise<IPaginated<IOrderSummary>> {
    return this.orderQuery.listForAdmin(query);
  }

  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string): Promise<IOrder> {
    return this.orderQuery.getForAdmin(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrderStatusDto,
  ): Promise<IOrder> {
    return this.orderStatus.updateStatus(id, dto.status);
  }

  @Patch(':id/cancel')
  cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AdminCancelOrderDto,
  ): Promise<IOrder> {
    return this.orderCancellation.cancelByAdmin(id, dto);
  }
}
