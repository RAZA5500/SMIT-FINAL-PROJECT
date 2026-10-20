import type { Prisma, StockStatus } from '@prisma/client';

export const cartProductInclude = {
  inventory: { select: { qtyOnHand: true, stockStatus: true } },
} satisfies Prisma.ProductInclude;

export type CartProductRecord = Prisma.ProductGetPayload<{
  include: typeof cartProductInclude;
}>;

export const cartInclude = {
  items: {
    include: { product: { include: cartProductInclude } },
    orderBy: { createdAt: 'asc' },
  },
} satisfies Prisma.CartInclude;

export type CartRecord = Prisma.CartGetPayload<{ include: typeof cartInclude }>;

export type CartItemRecord = CartRecord['items'][number];

export interface ICartItem {
  id: string;
  productId: string;
  name: string;
  sku: string;
  /** Hamesha product ki current price */
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
  /** Saare items ki total quantity (header counter) */
  itemCount: number;
  subtotal: string;
  grandTotal: string;
}
