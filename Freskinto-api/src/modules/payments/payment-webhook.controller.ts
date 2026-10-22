import {
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  type RawBodyRequest,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { Public } from '../../common/decorators/public.decorator';
import { PaymentWebhookService } from './payment-webhook.service';

/** Public, lekin `x-signature` (HMAC-SHA256) verified — signature hi authorization hai */
@Public()
@Controller('webhooks/payments')
export class PaymentWebhookController {
  constructor(private readonly webhookService: PaymentWebhookService) {}

  @Post('mock')
  @HttpCode(HttpStatus.OK)
  async receive(
    @Req() request: RawBodyRequest<Request>,
    @Headers('x-signature') signature?: string,
  ): Promise<{ received: true }> {
    await this.webhookService.handle(request.rawBody, signature);
    return { received: true };
  }
}
