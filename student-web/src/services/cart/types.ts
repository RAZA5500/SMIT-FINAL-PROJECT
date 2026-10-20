import type { StockStatus } from "@/constants/enums";

/** Cart item ki price hamesha product ki current price (cart mein price column nahi) */
export interface ICartItem {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price: string;
  quantity: number;
  lineTotal: string;
  minimumOrderQuantity: number;
  maximumOrderQuantity: number;
  stockStatus: StockStatus;
  /** min(stock, maximumOrderQuantity) */
  maxAllowedQuantity: number;
  isAvailable: boolean;
}

export interface ICart {
  id: string;
  items: ICartItem[];
  /** Saare items ki total quantity */
  itemCount: number;
  subtotal: string;
  grandTotal: string;
}

/** Existing line par quantity **add** hoti hai */
export interface IAddCartItemPayload {
  productId: string;
  quantity: number;
}

/** Absolute quantity (retry-safe); 0 = remove */
export interface IUpdateCartItemPayload {
  quantity: number;
}
