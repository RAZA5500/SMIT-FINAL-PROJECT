import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { toBoolean, trim } from '../../../common/dto/transformers';
import { PaginationDto } from '../../../common/pagination/pagination.dto';

/** Public `GET /categories` — backend khud sirf active categories deta hai */
export class PublicCategoriesQueryDto extends PaginationDto {
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(100)
  search?: string;
}

/** Admin list mein inactive bhi, `isActive` filter ke saath */
export class AdminCategoriesQueryDto extends PublicCategoriesQueryDto {
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  isActive?: boolean;
}
