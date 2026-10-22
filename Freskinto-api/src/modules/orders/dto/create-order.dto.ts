import { DeliveryType } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { trim } from '../../../common/dto/transformers';

export class OrderAddressDto {
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  addressLine: string;

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  city: string;

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  county: string;

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  postcode: string;
}

/**
 * DELIVERY: addressId ya shippingAddress (exactly ek); PICKUP: pickupScheduledAt.
 * Yeh cross-field rules service mein check hote hain (FLOW-MD 04 §2).
 * Price/total kabhi client se nahi aate.
 */
export class CreateOrderDto {
  @IsEnum(DeliveryType)
  deliveryType: DeliveryType;

  @IsOptional()
  @IsUUID()
  addressId?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => OrderAddressDto)
  shippingAddress?: OrderAddressDto;

  @IsOptional()
  @IsDateString()
  pickupScheduledAt?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(500)
  customerNotes?: string;
}
