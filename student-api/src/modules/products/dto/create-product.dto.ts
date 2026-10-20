import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { trim } from '../../../common/dto/transformers';

/** `max >= min` jaisa cross-field rule service mein check hota hai (FLOW-MD 04 §2) */
export class CreateProductDto {
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsUUID()
  categoryId: string;

  /** Decimal(10,2) — 2 decimals, 0.01 se 99,999,999.99 tak */
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(99999999.99)
  price: number;

  @IsInt()
  @Min(1)
  minimumOrderQuantity: number;

  @IsInt()
  @Min(1)
  maximumOrderQuantity: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
