import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { PaginationDto } from '../../common/pagination/pagination.dto';
import type { IPaginated } from '../../common/pagination/pagination.helper';
import type { IAuthUser } from '../auth/types/auth.types';
import { CreateAdjustmentDto } from './dto/create-adjustment.dto';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { ListInventoryQueryDto } from './dto/list-inventory-query.dto';
import { InventoryService } from './inventory.service';
import type {
  IAdjustmentResult,
  IInventory,
  IInventoryTransaction,
} from './types/inventory.types';

@Roles('ADMIN')
@Controller('admin/inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  list(@Query() query: ListInventoryQueryDto): Promise<IPaginated<IInventory>> {
    return this.inventoryService.list(query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateInventoryDto,
    @CurrentUser() actor: IAuthUser,
  ): Promise<IInventory> {
    return this.inventoryService.create(dto, actor);
  }

  @Post('adjustments')
  @HttpCode(HttpStatus.CREATED)
  adjust(
    @Body() dto: CreateAdjustmentDto,
    @CurrentUser() actor: IAuthUser,
  ): Promise<IAdjustmentResult> {
    return this.inventoryService.adjust(dto, actor);
  }

  @Get(':id/transactions')
  listTransactions(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: PaginationDto,
  ): Promise<IPaginated<IInventoryTransaction>> {
    return this.inventoryService.listTransactions(id, query);
  }
}
