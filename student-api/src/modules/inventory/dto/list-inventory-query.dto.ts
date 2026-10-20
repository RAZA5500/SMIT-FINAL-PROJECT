import { StockStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { trim } from '../../../common/dto/transformers';
import { PaginationDto } from '../../../common/pagination/pagination.dto';

export class ListInventoryQueryDto extends PaginationDto {
  /** Product name ya SKU */
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @IsEnum(StockStatus)
  stockStatus?: StockStatus;
}
