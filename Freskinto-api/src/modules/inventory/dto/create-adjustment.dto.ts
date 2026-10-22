import { AdjustmentReason } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  NotEquals,
} from 'class-validator';
import { trim } from '../../../common/dto/transformers';

export class CreateAdjustmentDto {
  @IsUUID()
  inventoryId: string;

  /** Negative = stock kam, positive = stock zyada; 0 allowed nahi */
  @IsInt()
  @NotEquals(0)
  quantity: number;

  @IsEnum(AdjustmentReason)
  reason: AdjustmentReason;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(500)
  note?: string;
}
