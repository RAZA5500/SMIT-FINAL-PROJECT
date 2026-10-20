import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { trim } from '../../../common/dto/transformers';
import {
  ADMIN_CANCEL_REASONS,
  CUSTOMER_CANCEL_REASONS,
} from '../types/order.types';

/** `OTHER` par note zaroori — service check karti hai */
export class CustomerCancelOrderDto {
  @IsIn(CUSTOMER_CANCEL_REASONS)
  reason: (typeof CUSTOMER_CANCEL_REASONS)[number];

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(500)
  note?: string;
}

export class AdminCancelOrderDto {
  @IsIn(ADMIN_CANCEL_REASONS)
  reason: (typeof ADMIN_CANCEL_REASONS)[number];

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(500)
  note?: string;
}
