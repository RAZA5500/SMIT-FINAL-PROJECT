import { Module } from '@nestjs/common';
import { PaymentGatewayModule } from '../../infrastructure/payment/payment-gateway.module';
import { RefundRetryCron } from './cron/refund-retry.cron';
import { PaymentWebhookController } from './payment-webhook.controller';
import { PaymentWebhookService } from './payment-webhook.service';
import { PaymentsController } from './payments.controller';
import { PaymentsDbService } from './payments.db.service';
import { PaymentsService } from './payments.service';
import { RefundService } from './refund.service';

@Module({
  imports: [PaymentGatewayModule],
  controllers: [PaymentsController, PaymentWebhookController],
  providers: [
    PaymentsService,
    PaymentWebhookService,
    RefundService,
    PaymentsDbService,
    RefundRetryCron,
  ],
  exports: [RefundService, PaymentsDbService],
})
export class PaymentsModule {}
