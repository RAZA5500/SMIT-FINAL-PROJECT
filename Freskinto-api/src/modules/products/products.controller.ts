import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import type { IPaginated } from '../../common/pagination/pagination.helper';
import { PublicProductsQueryDto } from './dto/list-products-query.dto';
import { ProductsService } from './products.service';
import type { IProduct } from './types/product.types';

/** Public catalog — sirf active products (inactive detail → 404) */
@Public()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  list(@Query() query: PublicProductsQueryDto): Promise<IPaginated<IProduct>> {
    return this.productsService.listPublic(query);
  }

  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string): Promise<IProduct> {
    return this.productsService.getPublic(id);
  }
}
