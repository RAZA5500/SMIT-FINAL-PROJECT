import type { Prisma, StockStatus } from '@prisma/client';

export const PRODUCT_SORTS = [
  'newest',
  'price_asc',
  'price_desc',
  'name_asc',
] as const;
export type ProductSort = (typeof PRODUCT_SORTS)[number];

export const productInclude = {
  category: { select: { id: true, name: true, slug: true } },
  inventory: { select: { id: true, qtyOnHand: true, stockStatus: true } },
} satisfies Prisma.ProductInclude;

export type ProductRecord = Prisma.ProductGetPayload<{
  include: typeof productInclude;
}>;

export interface IProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: string;
  minimumOrderQuantity: number;
  maximumOrderQuantity: number;
  isActive: boolean;
  category: { id: string; name: string; slug: string };
  /** Inventory row na ho to OUT_OF_STOCK */
  stockStatus: StockStatus;
  createdAt: Date;
  updatedAt: Date;
}

/** Admin ko inventory ka pata bhi chahiye (inventory banani hai ya nahi) */
export interface IAdminProduct extends IProduct {
  inventoryId: string | null;
  qtyOnHand: number | null;
}

export interface IListProductsFilter {
  page: number;
  limit: number;
  q?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: ProductSort;
  isActive?: boolean;
}

export interface IProductWriteData {
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  price: Prisma.Decimal | number;
  minimumOrderQuantity: number;
  maximumOrderQuantity: number;
  isActive: boolean;
}
