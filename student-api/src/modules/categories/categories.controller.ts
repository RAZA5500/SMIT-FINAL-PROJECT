import { Controller, Get, Query } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import type { IPaginated } from '../../common/pagination/pagination.helper';
import { CategoriesService } from './categories.service';
import { PublicCategoriesQueryDto } from './dto/list-categories-query.dto';
import type { ICategory } from './types/category.types';

/** Public catalog — sirf active categories */
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get()
  list(
    @Query() query: PublicCategoriesQueryDto,
  ): Promise<IPaginated<ICategory>> {
    return this.categoriesService.listPublic(query);
  }
}
