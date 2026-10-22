import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import type { IPaginated } from '../../common/pagination/pagination.helper';
import { CreateProductDto } from './dto/create-product.dto';
import { AdminProductsQueryDto } from './dto/list-products-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import type { IAdminProduct } from './types/product.types';

/** Delete endpoint nahi — product deactivate (`isActive: false`) hota hai (FLOW-MD 03 §7) */
@Roles('ADMIN')
@Controller('admin/products')
export class AdminProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  list(
    @Query() query: AdminProductsQueryDto,
  ): Promise<IPaginated<IAdminProduct>> {
    return this.productsService.listAdmin(query);
  }

  /** Edit page (`/admin/products/[id]/edit`) ke liye — inactive product bhi */
  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string): Promise<IAdminProduct> {
    return this.productsService.getAdmin(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateProductDto): Promise<IAdminProduct> {
    return this.productsService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<IAdminProduct> {
    return this.productsService.update(id, dto);
  }
}
