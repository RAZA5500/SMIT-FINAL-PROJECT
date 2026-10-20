import { StockStatus } from '@prisma/client';
import { computeStockStatus } from './stock-status';

describe('computeStockStatus', () => {
  it.each([
    [0, 10, StockStatus.OUT_OF_STOCK],
    [-1, 10, StockStatus.OUT_OF_STOCK],
    [1, 10, StockStatus.LOW_STOCK],
    [10, 10, StockStatus.LOW_STOCK],
    [11, 10, StockStatus.IN_STOCK],
    [5, 0, StockStatus.IN_STOCK],
  ])('qty %i with threshold %i → %s', (qty, threshold, expected) => {
    expect(computeStockStatus(qty, threshold)).toBe(expected);
  });
});
