import { IsUUID } from 'class-validator';

/** Amount client nahi bhejta — hamesha server ka order.total */
export class InitiatePaymentDto {
  @IsUUID()
  orderId: string;
}
