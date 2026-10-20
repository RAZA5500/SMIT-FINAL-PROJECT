import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StockStatus } from '@prisma/client';
import { MoneyService } from '../../shared/money/money.service';
import type { IAuthUser } from '../auth/types/auth.types';
import { CartDbService } from './cart.db.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { toCart } from './mappers/cart.mapper';
import { CartProductRecord, ICart } from './types/cart.types';

export const CART_ITEM_NOT_FOUND = 'Cart item not found';

@Injectable()
export class CartService {
  constructor(
    private readonly cartDb: CartDbService,
    private readonly money: MoneyService,
  ) {}

  async getCart(user: IAuthUser): Promise<ICart> {
    return toCart(await this.cartDb.getOrCreate(user.id), this.money);
  }

  /**
   * FLOW-MD 01 §13: active product, out of stock → 400, pehli dafa ≥ min,
   * total ≤ min(stock, max) — check upsert ke BAAD transaction ke andar.
   */
  async addItem(user: IAuthUser, dto: AddCartItemDto): Promise<ICart> {
    await this.cartDb.transaction(async (tx) => {
      const cart = await this.cartDb.getOrCreate(user.id, tx);
      const product = await this.cartDb.findProduct(tx, dto.productId);
      this.assertPurchasable(product);

      const existing = await this.cartDb.findItem(tx, cart.id, product.id);
      if (!existing) {
        this.assertMinimum(dto.quantity, product.minimumOrderQuantity);
      }

      const item = await this.cartDb.incrementItem(
        tx,
        cart.id,
        product.id,
        dto.quantity,
      );
      // Limit cross ho to throw → poora transaction rollback
      this.assertWithinLimits(item.quantity, product);
    });
    return this.getCart(user);
  }

  async updateItem(
    user: IAuthUser,
    itemId: string,
    dto: UpdateCartItemDto,
  ): Promise<ICart> {
    if (dto.quantity === 0) {
      await this.removeItem(user, itemId);
      return this.getCart(user);
    }

    await this.cartDb.transaction(async (tx) => {
      const item = await this.cartDb.findOwnedItem(tx, itemId, user.id);
      if (!item) {
        throw new NotFoundException(CART_ITEM_NOT_FOUND);
      }
      this.assertPurchasable(item.product);
      this.assertMinimum(dto.quantity, item.product.minimumOrderQuantity);
      this.assertWithinLimits(dto.quantity, item.product);
      await this.cartDb.setItemQuantity(tx, item.id, dto.quantity);
    });
    return this.getCart(user);
  }

  async removeItem(user: IAuthUser, itemId: string): Promise<void> {
    const deleted = await this.cartDb.deleteOwnedItem(itemId, user.id);
    if (deleted === 0) {
      throw new NotFoundException(CART_ITEM_NOT_FOUND);
    }
  }

  async clear(user: IAuthUser): Promise<void> {
    await this.cartDb.clear(user.id);
  }

  private assertPurchasable(
    product: CartProductRecord | null,
  ): asserts product is CartProductRecord {
    if (!product || !product.isActive) {
      throw new NotFoundException('Product not found');
    }
    const available = product.inventory?.qtyOnHand ?? 0;
    if (
      available <= 0 ||
      product.inventory?.stockStatus === StockStatus.OUT_OF_STOCK
    ) {
      throw new BadRequestException('Product is out of stock');
    }
  }

  private assertMinimum(quantity: number, minimum: number): void {
    if (quantity < minimum) {
      throw new BadRequestException(
        `Minimum order quantity for this product is ${minimum}`,
      );
    }
  }

  private assertWithinLimits(
    quantity: number,
    product: CartProductRecord,
  ): void {
    const available = product.inventory?.qtyOnHand ?? 0;
    if (quantity > available) {
      throw new BadRequestException(`Only ${available} units available`);
    }
    if (quantity > product.maximumOrderQuantity) {
      throw new BadRequestException(
        `Maximum order quantity for this product is ${product.maximumOrderQuantity}`,
      );
    }
  }
}
