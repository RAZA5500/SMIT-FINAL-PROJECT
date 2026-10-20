import { StockStatus } from '@prisma/client';

/** qty ≤ 0 → OUT_OF_STOCK, qty ≤ threshold → LOW_STOCK, warna IN_STOCK (FLOW-MD 01 §11) */
export function computeStockStatus(
  qtyOnHand: number,
  lowStockThreshold: number,
): StockStatus {
  if (qtyOnHand <= 0) return StockStatus.OUT_OF_STOCK;
  if (qtyOnHand <= lowStockThreshold) return StockStatus.LOW_STOCK;
  return StockStatus.IN_STOCK;
}
