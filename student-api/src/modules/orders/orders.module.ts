import { Module } from '@nestjs/common';
import { AddressesModule } from '../addresses/addresses.module';
import { CartModule } from '../cart/cart.module';
import { InventoryModule } from '../inventory/inventory.module';
import { PaymentsModule } from '../payments/payments.module';
import { AdminOrdersController } from './admin-orders.controller';
import { PaymentTimeoutCron } from './cron/payment-timeout.cron';
import { OrderCancellationService } from './order-cancellation.service';
import { OrderCreationService } from './order-creation.service';
import { OrderQueryService } from './order-query.service';
import { OrderStatusService } from './order-status.service';
import { OrdersController } from './orders.controller';
import { OrdersDbService } from './orders.db.service';

@Module({
  imports: [CartModule, InventoryModule, AddressesModule, PaymentsModule],
  controllers: [OrdersController, AdminOrdersController],
  providers: [
    OrderCreationService,
    OrderCancellationService,
    OrderStatusService,
    OrderQueryService,
    OrdersDbService,
    PaymentTimeoutCron,
  ],
})
export class OrdersModule {}
