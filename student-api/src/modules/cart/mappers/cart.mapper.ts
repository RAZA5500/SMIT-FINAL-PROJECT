import { StockStatus } from '@prisma/client';
import { ORDER_SHIPPING_COST } from '../../../common/constants';
import type { MoneyService } from '../../../shared/money/money.service';
import type {
  CartItemRecord,
  CartRecord,
  ICart,
  ICartItem,
} from '../types/cart.types';

function toCartItem(item: CartItemRecord, money: MoneyService): ICartItem {
  const { product } = item;
  const available = product.inventory?.qtyOnHand ?? 0;
  const maxAllowedQuantity = Math.max(
    0,
    Math.min(available, product.maximumOrderQuantity),
  );

  return {
    id: item.id,
    productId: product.id,
    name: product.name,
    sku: product.sku,
    price: money.toDecimalString(product.price),
    quantity: item.quantity,
    lineTotal: money.toDecimalString(
      money.lineItemTotal(product.price, item.quantity),
    ),
    minimumOrderQuantity: product.minimumOrderQuantity,
    maximumOrderQuantity: product.maximumOrderQuantity,
    stockStatus: product.inventory?.stockStatus ?? StockStatus.OUT_OF_STOCK,
    maxAllowedQuantity,
    isAvailable:
      product.isActive &&
      item.quantity >= product.minimumOrderQuantity &&
      item.quantity <= maxAllowedQuantity,
  };
}

export function toCart(cart: CartRecord, money: MoneyService): ICart {
  const subtotal = money.sumItems(
    cart.items.map((item) =>
      money.lineItemTotal(item.product.price, item.quantity),
    ),
  );
  return {
    id: cart.id,
    items: cart.items.map((item) => toCartItem(item, money)),
    itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: money.toDecimalString(subtotal),
    grandTotal: money.toDecimalString(
      money.calculateOrderTotal(subtotal, ORDER_SHIPPING_COST),
    ),
  };
}
