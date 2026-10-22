import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import type { IPaginated } from '../../common/pagination/pagination.helper';
import type { IAuthUser } from '../auth/types/auth.types';
import { CustomerCancelOrderDto } from './dto/cancel-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { CustomerOrdersQueryDto } from './dto/list-orders-query.dto';
import { OrderCancellationService } from './order-cancellation.service';
import { OrderCreationService } from './order-creation.service';
import { OrderQueryService } from './order-query.service';
import type { IOrder, IOrderSummary } from './types/order.types';

/** Customer orders — "meri orders", user id token se */
@Roles('CUSTOMER')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly orderCreation: OrderCreationService,
    private readonly orderCancellation: OrderCancellationService,
    private readonly orderQuery: OrderQueryService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @CurrentUser() user: IAuthUser,
    @Body() dto: CreateOrderDto,
  ): Promise<IOrder> {
    return this.orderCreation.createOrder(user, dto);
  }

  @Get('me')
  list(
    @CurrentUser() user: IAuthUser,
    @Query() query: CustomerOrdersQueryDto,
  ): Promise<IPaginated<IOrderSummary>> {
    return this.orderQuery.listForCustomer(user, query);
  }

  @Get('me/:id')
  get(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<IOrder> {
    return this.orderQuery.getForCustomer(user, id);
  }

  @Patch('me/:id/cancel')
  cancel(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CustomerCancelOrderDto,
  ): Promise<IOrder> {
    return this.orderCancellation.cancelByCustomer(user, id, dto);
  }
}
