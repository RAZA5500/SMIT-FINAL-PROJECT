import {
  CancellationReason,
  DeliveryType,
  OrderStatus,
  PaymentStatus,
  Prisma,
} from '@prisma/client';

/** Admin status transitions — FLOW-MD 01 §19 (CANCELLED sirf cancel endpoint se) */
export const ADMIN_ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [],
  [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING],
  [OrderStatus.PROCESSING]: [
    OrderStatus.READY_FOR_PICKUP,
    OrderStatus.READY_FOR_DELIVERY,
  ],
  [OrderStatus.READY_FOR_PICKUP]: [OrderStatus.DELIVERED],
  [OrderStatus.READY_FOR_DELIVERY]: [OrderStatus.DELIVERED],
  [OrderStatus.DELIVERED]: [],
  [OrderStatus.CANCELLED]: [],
  [OrderStatus.REFUND_PENDING]: [],
};

export const CUSTOMER_CANCELLABLE_STATUSES: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.CONFIRMED,
];

export const ADMIN_CANCELLABLE_STATUSES: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.CONFIRMED,
  OrderStatus.PROCESSING,
  OrderStatus.READY_FOR_PICKUP,
  OrderStatus.READY_FOR_DELIVERY,
];

export const CUSTOMER_CANCEL_REASONS = [
  CancellationReason.CHANGED_MIND,
  CancellationReason.ORDERED_BY_MISTAKE,
  CancellationReason.FOUND_BETTER_PRICE,
  CancellationReason.DELIVERY_TOO_LONG,
  CancellationReason.OTHER,
] as const;

export const ADMIN_CANCEL_REASONS = [
  CancellationReason.CUSTOMER_REQUEST,
  CancellationReason.OUT_OF_STOCK,
  CancellationReason.PAYMENT_ISSUE,
  CancellationReason.OTHER,
] as const;

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'Pending',
  [OrderStatus.CONFIRMED]: 'Confirmed',
  [OrderStatus.PROCESSING]: 'Processing',
  [OrderStatus.READY_FOR_PICKUP]: 'Ready for Pickup',
  [OrderStatus.READY_FOR_DELIVERY]: 'Ready for Delivery',
  [OrderStatus.DELIVERED]: 'Delivered',
  [OrderStatus.CANCELLED]: 'Cancelled',
  [OrderStatus.REFUND_PENDING]: 'Refund Pending',
};

export const STATUS_CONFLICT_MESSAGE =
  'Order status changed before update could complete';

export const orderDetailInclude = {
  items: {
    include: { product: { select: { name: true, sku: true } } },
    orderBy: { id: 'asc' },
  },
  address: true,
  payments: { orderBy: { createdAt: 'asc' } },
  user: { select: { id: true, name: true, email: true } },
} satisfies Prisma.OrderInclude;

export type OrderDetailRecord = Prisma.OrderGetPayload<{
  include: typeof orderDetailInclude;
}>;

export const orderSummaryInclude = {
  _count: { select: { items: true } },
  user: { select: { id: true, name: true, email: true } },
} satisfies Prisma.OrderInclude;

export type OrderSummaryRecord = Prisma.OrderGetPayload<{
  include: typeof orderSummaryInclude;
}>;

/** Cancel ke liye zaroori data (items stock restore ke liye) */
export const orderForCancelSelect = {
  id: true,
  userId: true,
  status: true,
  paymentStatus: true,
  items: { select: { id: true } },
} satisfies Prisma.OrderSelect;

export type OrderForCancel = Prisma.OrderGetPayload<{
  select: typeof orderForCancelSelect;
}>;

export interface IOrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  price: string;
  subtotal: string;
}

export interface IOrderAddress {
  addressLine: string;
  city: string;
  county: string;
  postcode: string;
}

export interface IOrderPayment {
  id: string;
  status: PaymentStatus;
  amount: string;
  gatewayRef: string;
  failureReason: string | null;
  paidAt: Date | null;
  refundedAt: Date | null;
  createdAt: Date;
}

export interface IOrderCustomer {
  id: string;
  name: string;
  email: string;
}

export interface IOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveryType: DeliveryType;
  subtotal: string;
  shippingCost: string;
  total: string;
  customerNotes: string | null;
  pickupScheduledAt: Date | null;
  paymentExpiresAt: Date;
  confirmedAt: Date | null;
  processedAt: Date | null;
  readyAt: Date | null;
  deliveredAt: Date | null;
  cancelledAt: Date | null;
  cancellationReason: CancellationReason | null;
  cancellationNote: string | null;
  createdAt: Date;
  updatedAt: Date;
  customer: IOrderCustomer;
  items: IOrderItem[];
  address: IOrderAddress | null;
  payments: IOrderPayment[];
}

export interface IOrderSummary {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveryType: DeliveryType;
  total: string;
  itemCount: number;
  createdAt: Date;
  customer: IOrderCustomer;
}

export interface IOrderLine {
  productId: string;
  quantity: number;
  price: Prisma.Decimal;
  subtotal: Prisma.Decimal;
}

export interface ICreateOrderData {
  orderNumber: string;
  userId: string;
  deliveryType: DeliveryType;
  subtotal: Prisma.Decimal;
  shippingCost: Prisma.Decimal;
  total: Prisma.Decimal;
  customerNotes: string | null;
  pickupScheduledAt: Date | null;
  paymentExpiresAt: Date;
  items: IOrderLine[];
  address: IOrderAddress | null;
}

export interface IAdminOrdersFilter {
  page: number;
  limit: number;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}
