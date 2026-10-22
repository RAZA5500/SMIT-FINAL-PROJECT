import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import type { IAuthUser } from '../auth/types/auth.types';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { MockCompletePaymentDto } from './dto/mock-complete-payment.dto';
import { PaymentsService } from './payments.service';
import type {
  IMockCompleteResult,
  IPaymentInitiation,
} from './types/payment.types';

@Roles('CUSTOMER')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initiate')
  @HttpCode(HttpStatus.OK)
  initiate(
    @CurrentUser() user: IAuthUser,
    @Body() dto: InitiatePaymentDto,
  ): Promise<IPaymentInitiation> {
    return this.paymentsService.initiate(user, dto);
  }

  @Post(':id/mock-complete')
  @HttpCode(HttpStatus.OK)
  mockComplete(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: MockCompletePaymentDto,
  ): Promise<IMockCompleteResult> {
    return this.paymentsService.mockComplete(user, id, dto);
  }
}
