import { Injectable } from '@nestjs/common';
import { CartItem } from '@prisma/client';
import { DatabaseService } from '../../database/database.service';
import type { TransactionClient } from '../../database/database.types';
import {
  cartInclude,
  CartItemRecord,
  cartProductInclude,
  CartProductRecord,
  CartRecord,
} from './types/cart.types';

@Injectable()
export class CartDbService {
  constructor(private readonly db: DatabaseService) {}

  transaction<T>(fn: (tx: TransactionClient) => Promise<T>): Promise<T> {
    return this.db.$transaction(fn);
  }

  /** Har user ki ek hi cart (`carts.userId` unique) — get-or-create */
  getOrCreate(
    userId: string,
    tx: TransactionClient = this.db,
  ): Promise<CartRecord> {
    return tx.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
      include: cartInclude,
    });
  }

  findProduct(
    tx: TransactionClient,
    productId: string,
  ): Promise<CartProductRecord | null> {
    return tx.product.findUnique({
      where: { id: productId },
      include: cartProductInclude,
    });
  }

  findItem(
    tx: TransactionClient,
    cartId: string,
    productId: string,
  ): Promise<CartItem | null> {
    return tx.cartItem.findUnique({
      where: { cartId_productId: { cartId, productId } },
    });
  }

  /** Same product dobara add → quantity increment (`@@unique([cartId, productId])`) */
  incrementItem(
    tx: TransactionClient,
    cartId: string,
    productId: string,
    quantity: number,
  ): Promise<CartItem> {
    return tx.cartItem.upsert({
      where: { cartId_productId: { cartId, productId } },
      create: { cartId, productId, quantity },
      update: { quantity: { increment: quantity } },
    });
  }

  /** Ownership: item ki cart isi user ki honi chahiye */
  findOwnedItem(
    tx: TransactionClient,
    itemId: string,
    userId: string,
  ): Promise<CartItemRecord | null> {
    return tx.cartItem.findFirst({
      where: { id: itemId, cart: { userId } },
      include: { product: { include: cartProductInclude } },
    });
  }

  async setItemQuantity(
    tx: TransactionClient,
    itemId: string,
    quantity: number,
  ): Promise<void> {
    await tx.cartItem.update({ where: { id: itemId }, data: { quantity } });
  }

  async deleteOwnedItem(itemId: string, userId: string): Promise<number> {
    const { count } = await this.db.cartItem.deleteMany({
      where: { id: itemId, cart: { userId } },
    });
    return count;
  }

  async clear(userId: string): Promise<void> {
    await this.db.cartItem.deleteMany({ where: { cart: { userId } } });
  }

  // ---- Order creation transaction ke liye ----

  /**
   * Cart row lock — same customer ke do parallel orders serialize ho jate hain;
   * doosre ko cart khali milti hai (FLOW-MD 12 §3.5).
   */
  async lockCart(
    tx: TransactionClient,
    userId: string,
  ): Promise<{ id: string } | null> {
    const rows = await tx.$queryRaw<{ id: string }[]>`
      SELECT "id" FROM "carts" WHERE "userId" = ${userId} FOR UPDATE`;
    return rows[0] ?? null;
  }

  findItemsForOrder(
    tx: TransactionClient,
    cartId: string,
  ): Promise<CartItemRecord[]> {
    return tx.cartItem.findMany({
      where: { cartId },
      include: { product: { include: cartProductInclude } },
      orderBy: { productId: 'asc' },
    });
  }

  async clearItems(tx: TransactionClient, cartId: string): Promise<void> {
    await tx.cartItem.deleteMany({ where: { cartId } });
  }
}
