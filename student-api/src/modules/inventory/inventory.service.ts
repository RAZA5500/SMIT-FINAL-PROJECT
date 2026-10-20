import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import {
  buildMeta,
  IPaginated,
} from '../../common/pagination/pagination.helper';
import { PaginationDto } from '../../common/pagination/pagination.dto';
import type { IAuthUser } from '../auth/types/auth.types';
import { CreateAdjustmentDto } from './dto/create-adjustment.dto';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { ListInventoryQueryDto } from './dto/list-inventory-query.dto';
import { INVENTORY_EXISTS, InventoryDbService } from './inventory.db.service';
import {
  toInventory,
  toInventoryTransaction,
} from './mappers/inventory.mapper';
import { computeStockStatus } from './stock-status';
import {
  DEFAULT_LOW_STOCK_THRESHOLD,
  IAdjustmentResult,
  IInventory,
  IInventoryTransaction,
  NEGATIVE_ONLY_REASONS,
} from './types/inventory.types';

@Injectable()
export class InventoryService {
  constructor(private readonly inventoryDb: InventoryDbService) {}

  async list(query: ListInventoryQueryDto): Promise<IPaginated<IInventory>> {
    const { inventories, total } = await this.inventoryDb.list(query);
    return {
      data: inventories.map(toInventory),
      meta: buildMeta(total, query.page, query.limit),
    };
  }

  /** Har product ki sirf ek inventory row; shuru ka stock RECEIVED ledger entry */
  async create(dto: CreateInventoryDto, actor: IAuthUser): Promise<IInventory> {
    if (!(await this.inventoryDb.productExists(dto.productId))) {
      throw new NotFoundException('Product not found');
    }
    if (await this.inventoryDb.existsForProduct(dto.productId)) {
      throw new ConflictException(INVENTORY_EXISTS);
    }

    const lowStockThreshold =
      dto.lowStockThreshold ?? DEFAULT_LOW_STOCK_THRESHOLD;
    const created = await this.inventoryDb.transaction(async (tx) => {
      const inventory = await this.inventoryDb.create(tx, {
        productId: dto.productId,
        qtyOnHand: dto.qtyOnHand,
        lowStockThreshold,
        stockStatus: computeStockStatus(dto.qtyOnHand, lowStockThreshold),
      });
      if (dto.qtyOnHand > 0) {
        await this.inventoryDb.createTransaction(tx, {
          inventoryId: inventory.id,
          type: TransactionType.RECEIVED,
          quantity: dto.qtyOnHand,
          performedBy: actor.id,
        });
      }
      return inventory;
    });
    return toInventory(created);
  }

  /**
   * Stock adjustment (FLOW-MD 01 §11): DAMAGE/RETURN_TO_SUPPLIER sirf negative,
   * row lock ke baad check, stock kabhi negative nahi, har movement ledger mein.
   */
  async adjust(
    dto: CreateAdjustmentDto,
    actor: IAuthUser,
  ): Promise<IAdjustmentResult> {
    if (NEGATIVE_ONLY_REASONS.includes(dto.reason) && dto.quantity > 0) {
      throw new BadRequestException(
        'DAMAGE and RETURN_TO_SUPPLIER adjustments must have a negative quantity',
      );
    }

    return this.inventoryDb.transaction(async (tx) => {
      const row = await this.inventoryDb.lockById(tx, dto.inventoryId);
      if (!row) {
        throw new NotFoundException('Inventory not found');
      }

      const newQuantity = row.qtyOnHand + dto.quantity;
      if (newQuantity < 0) {
        throw new BadRequestException(
          `Stock cannot go negative. Available: ${row.qtyOnHand}.`,
        );
      }

      const inventory = await this.inventoryDb.setQuantity(
        tx,
        row,
        newQuantity,
      );
      const transaction = await this.inventoryDb.createTransaction(tx, {
        inventoryId: row.id,
        type:
          dto.quantity > 0
            ? TransactionType.ADJUSTMENT_INCREASE
            : TransactionType.ADJUSTMENT_DECREASE,
        quantity: Math.abs(dto.quantity),
        reason: dto.reason,
        note: dto.note ?? null,
        performedBy: actor.id,
      });

      return {
        inventory: toInventory(inventory),
        transaction: toInventoryTransaction(transaction),
      };
    });
  }

  async listTransactions(
    inventoryId: string,
    query: PaginationDto,
  ): Promise<IPaginated<IInventoryTransaction>> {
    if (!(await this.inventoryDb.findById(inventoryId))) {
      throw new NotFoundException('Inventory not found');
    }
    const { transactions, total } = await this.inventoryDb.listTransactions(
      inventoryId,
      query.page,
      query.limit,
    );
    return {
      data: transactions.map(toInventoryTransaction),
      meta: buildMeta(total, query.page, query.limit),
    };
  }
}
