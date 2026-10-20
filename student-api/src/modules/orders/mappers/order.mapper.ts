import type { MoneyService } from '../../../shared/money/money.service';
import type {
  IOrder,
  IOrderSummary,
  OrderDetailRecord,
  OrderSummaryRecord,
} from '../types/order.types';

export function toOrder(order: OrderDetailRecord, money: MoneyService): IOrder {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    deliveryType: order.deliveryType,
    subtotal: money.toDecimalString(order.subtotal),
    shippingCost: money.toDecimalString(order.shippingCost),
    total: money.toDecimalString(order.total),
    customerNotes: order.customerNotes,
    pickupScheduledAt: order.pickupScheduledAt,
    paymentExpiresAt: order.paymentExpiresAt,
    confirmedAt: order.confirmedAt,
    processedAt: order.processedAt,
    readyAt: order.readyAt,
    deliveredAt: order.deliveredAt,
    cancelledAt: order.cancelledAt,
    cancellationReason: order.cancellationReason,
    cancellationNote: order.cancellationNote,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    customer: order.user,
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      sku: item.product.sku,
      quantity: item.quantity,
      price: money.toDecimalString(item.price),
      subtotal: money.toDecimalString(item.subtotal),
    })),
    address: order.address && {
      addressLine: order.address.addressLine,
      city: order.address.city,
      county: order.address.county,
      postcode: order.address.postcode,
    },
    payments: order.payments.map((payment) => ({
      id: payment.id,
      status: payment.status,
      amount: money.toDecimalString(payment.amount),
      gatewayRef: payment.gatewayRef,
      failureReason: payment.failureReason,
      paidAt: payment.paidAt,
      refundedAt: payment.refundedAt,
      createdAt: payment.createdAt,
    })),
  };
}

export function toOrderSummary(
  order: OrderSummaryRecord,
  money: MoneyService,
): IOrderSummary {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    deliveryType: order.deliveryType,
    total: money.toDecimalString(order.total),
    itemCount: order._count.items,
    createdAt: order.createdAt,
    customer: order.user,
  };
}
