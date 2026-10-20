import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma, StockStatus, TransactionType } from '@prisma/client';
import { toSkipTake } from '../../common/pagination/pagination.helper';
import { DatabaseService } from '../../database/database.service';
import type { TransactionClient } from '../../database/database.types';
import { isUniqueViolation } from '../../database/prisma-errors';
import { computeStockStatus } from './stock-status';
import {
  ICreateTransactionData,
  IListInventoryFilter,
  ILockedInventoryRow,
  inventoryInclude,
  InventoryRecord,
  inventoryTransactionInclude,
  InventoryTransactionRecord,
} from './types/inventory.types';

export const INVENTORY_EXISTS = 'Inventory already exists for this product';

/**
 * Inventory ki saari queries. `tx` wale methods order aur inventory dono
 * modules ke transactions mein reuse hote hain (FLOW-MD 04 §5).
 */
@Injectable()
export class InventoryDbService {
  constructor(private readonly db: DatabaseService) {}

  transaction<T>(fn: (tx: TransactionClient) => Promise<T>): Promise<T> {
    return this.db.$transaction(fn);
  }

  async list(
    filter: IListInventoryFilter,
  ): Promise<{ inventories: InventoryRecord[]; total: number }> {
    const where: Prisma.InventoryWhereInput = {
      ...(filter.stockStatus && { stockStatus: filter.stockStatus }),
      ...(filter.search && {
        product: {
          OR: [
            { name: { contains: filter.search, mode: 'insensitive' } },
            { sku: { contains: filter.search, mode: 'insensitive' } },
          ],
        },
      }),
    };

    const [inventories, total] = await Promise.all([
      this.db.inventory.findMany({
        where,
        include: inventoryInclude,
        orderBy: [{ updatedAt: 'desc' }, { id: 'asc' }],
        ...toSkipTake(filter.page, filter.limit),
      }),
      this.db.inventory.count({ where }),
    ]);
    return { inventories, total };
  }

  findById(id: string): Promise<InventoryRecord | null> {
    return this.db.inventory.findUnique({
      where: { id },
      include: inventoryInclude,
    });
  }

  async productExists(productId: string): Promise<boolean> {
    return (await this.db.product.count({ where: { id: productId } })) > 0;
  }

  async existsForProduct(productId: string): Promise<boolean> {
    return (await this.db.inventory.count({ where: { productId } })) > 0;
  }

  async create(
    tx: TransactionClient,
    data: {
      productId: string;
      qtyOnHand: number;
      lowStockThreshold: number;
      stockStatus: StockStatus;
    },
  ): Promise<InventoryRecord> {
    try {
      return await tx.inventory.create({ data, include: inventoryInclude });
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException(INVENTORY_EXISTS);
      }
      throw error;
    }
  }

  /** Row lock — doosra transaction commit tak intezar karega */
  async lockById(
    tx: TransactionClient,
    id: string,
  ): Promise<ILockedInventoryRow | null> {
    const rows = await tx.$queryRaw<ILockedInventoryRow[]>`
      SELECT "id", "productId", "qtyOnHand", "lowStockThreshold"
      FROM "inventory"
      WHERE "id" = ${id}
      FOR UPDATE`;
    return rows[0] ?? null;
  }

  /**
   * Kai products ki inventory ek saath lock — hamesha `productId` order mein,
   * taa ke do transactions ulte order mein lock le kar deadlock na karein.
   */
  async lockByProductIds(
    tx: TransactionClient,
    productIds: string[],
  ): Promise<ILockedInventoryRow[]> {
    if (productIds.length === 0) return [];
    return tx.$queryRaw<ILockedInventoryRow[]>`
      SELECT "id", "productId", "qtyOnHand", "lowStockThreshold"
      FROM "inventory"
      WHERE "productId" IN (${Prisma.join(productIds)})
      ORDER BY "productId"
      FOR UPDATE`;
  }

  /** Nayi quantity + stock status refresh */
  setQuantity(
    tx: TransactionClient,
    row: ILockedInventoryRow,
    qtyOnHand: number,
  ): Promise<InventoryRecord> {
    return tx.inventory.update({
      where: { id: row.id },
      data: {
        qtyOnHand,
        stockStatus: computeStockStatus(qtyOnHand, row.lowStockThreshold),
      },
      include: inventoryInclude,
    });
  }

  createTransaction(
    tx: TransactionClient,
    data: ICreateTransactionData,
  ): Promise<InventoryTransactionRecord> {
    return tx.inventoryTransaction.create({
      data,
      include: inventoryTransactionInclude,
    });
  }

  async createTransactions(
    tx: TransactionClient,
    data: ICreateTransactionData[],
  ): Promise<void> {
    if (data.length === 0) return;
    await tx.inventoryTransaction.createMany({ data });
  }

  /**
   * Order ke CONSUMED ledger rows — cancel par exact quantities wapas karne ke liye.
   * Saare items ek hi query mein (loop mein query nahi — N+1 se bachao).
   */
  findConsumedByOrderItems(tx: TransactionClient, orderItemIds: string[]) {
    return tx.inventoryTransaction.findMany({
      where: {
        orderItemId: { in: orderItemIds },
        type: TransactionType.CONSUMED,
      },
      select: {
        inventoryId: true,
        orderItemId: true,
        quantity: true,
        inventory: { select: { productId: true } },
      },
    });
  }

  async listTransactions(
    inventoryId: string,
    page: number,
    limit: number,
  ): Promise<{ transactions: InventoryTransactionRecord[]; total: number }> {
    const where: Prisma.InventoryTransactionWhereInput = { inventoryId };
    const [transactions, total] = await Promise.all([
      this.db.inventoryTransaction.findMany({
        where,
        include: inventoryTransactionInclude,
        orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
        ...toSkipTake(page, limit),
      }),
      this.db.inventoryTransaction.count({ where }),
    ]);
    return { transactions, total };
  }
}
