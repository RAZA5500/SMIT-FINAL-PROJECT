import type { StockStatus } from "@/constants/enums";
import type { IPaginationPayload } from "@/services/types";

/** Backend sort whitelist (FLOW-MD api-reference Part 2) */
export const PRODUCT_SORTS = ["newest", "price_asc", "price_desc", "name_asc"] as const;
export type ProductSort = (typeof PRODUCT_SORTS)[number];

/** Backend `IProduct` — `price` string ("12.50") */
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
  createdAt: string;
  updatedAt: string;
}

/** Admin ko inventory ka pata bhi chahiye */
export interface IAdminProduct extends IProduct {
  inventoryId: string | null;
  qtyOnHand: number | null;
}

export interface IFetchProductsPayload extends IPaginationPayload {
  q?: string;
  /** Top-level category ho to us ke children ke products bhi */
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: ProductSort;
}

export interface IFetchAdminProductsPayload extends IFetchProductsPayload {
  isActive?: boolean;
}

export interface ICreateProductPayload {
  name: string;
  categoryId: string;
  price: number;
  minimumOrderQuantity: number;
  maximumOrderQuantity: number;
  isActive?: boolean;
}

export type IUpdateProductPayload = Partial<ICreateProductPayload>;
