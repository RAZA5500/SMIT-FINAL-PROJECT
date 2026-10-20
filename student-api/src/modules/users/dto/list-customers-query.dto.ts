import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { toBoolean, trim } from '../../../common/dto/transformers';
import { PaginationDto } from '../../../common/pagination/pagination.dto';

export class ListCustomersQueryDto extends PaginationDto {
  /** name / email / phone par case-insensitive search */
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  isActive?: boolean;
}
