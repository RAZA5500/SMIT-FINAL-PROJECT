import { StockStatus } from '@prisma/client';
import type { MoneyService } from '../../../shared/money/money.service';
import type {
  IAdminProduct,
  IProduct,
  ProductRecord,
} from '../types/product.types';

export function toProduct(
  product: ProductRecord,
  money: MoneyService,
): IProduct {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    price: money.toDecimalString(product.price),
    minimumOrderQuantity: product.minimumOrderQuantity,
    maximumOrderQuantity: product.maximumOrderQuantity,
    isActive: product.isActive,
    category: product.category,
    stockStatus: product.inventory?.stockStatus ?? StockStatus.OUT_OF_STOCK,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

export function toAdminProduct(
  product: ProductRecord,
  money: MoneyService,
): IAdminProduct {
  return {
    ...toProduct(product, money),
    inventoryId: product.inventory?.id ?? null,
    qtyOnHand: product.inventory?.qtyOnHand ?? null,
  };
}
