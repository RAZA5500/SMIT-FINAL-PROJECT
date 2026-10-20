import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';

/** `parentId: null` → top-level par le jao; field na bhejo → parent waisa hi rahe */
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
