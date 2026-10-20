import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { toBoolean, trim } from '../../../common/dto/transformers';
import { PaginationDto } from '../../../common/pagination/pagination.dto';
import { PRODUCT_SORTS, type ProductSort } from '../types/product.types';

/** Public `GET /products` — backend khud sirf active products deta hai */
export class PublicProductsQueryDto extends PaginationDto {
  /** name ya SKU par case-insensitive search */
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(100)
  q?: string;

  /** Top-level category do to us ke saare children ke products bhi aate hain */
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  maxPrice?: number;

  /** Sort field whitelist — raw column name kabhi nahi (FLOW-MD 05 §5) */
  @IsOptional()
  @IsIn(PRODUCT_SORTS)
  sortBy?: ProductSort;
}

/** Admin list mein inactive products bhi */
export class AdminProductsQueryDto extends PublicProductsQueryDto {
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  isActive?: boolean;
}
