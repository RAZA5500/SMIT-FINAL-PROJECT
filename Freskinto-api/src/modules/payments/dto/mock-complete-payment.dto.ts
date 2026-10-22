import { IsIn } from 'class-validator';
import {
  MOCK_PAYMENT_OUTCOMES,
  type MockPaymentOutcome,
} from '../types/payment.types';

export class MockCompletePaymentDto {
  @IsIn(MOCK_PAYMENT_OUTCOMES)
  outcome: MockPaymentOutcome;
}
