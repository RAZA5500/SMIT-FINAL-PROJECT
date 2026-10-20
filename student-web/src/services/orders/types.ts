import type {
  AdminCancelReason,
  CustomerCancelReason,
  DeliveryType,
  OrderStatus,
  PaymentStatus,
} from "@/constants/enums";
import type { IPaginationPayload } from "@/services/types";

export interface IOrderItem {
  id: string;
  productId: string;
  /** Order ke waqt ka snapshot */
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
  paidAt: string | null;
  refundedAt: string | null;
  createdAt: string;
}

export interface IOrderCustomer {
  id: string;
  name: string;
  email: string;
}

/** Backend `IOrder` — money string, status UPPER_SNAKE */
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
  pickupScheduledAt: string | null;
  paymentExpiresAt: string;
  confirmedAt: string | null;
  processedAt: string | null;
  readyAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  /** Customer/admin reasons + system `PAYMENT_TIMEOUT` */
  cancellationReason: string | null;
  cancellationNote: string | null;
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  customer: IOrderCustomer;
}

/** DELIVERY: `addressId` ya `shippingAddress` (exactly ek); PICKUP: `pickupScheduledAt` */
export interface ICreateOrderPayload {
  deliveryType: DeliveryType;
  addressId?: string;
  shippingAddress?: IOrderAddress;
  pickupScheduledAt?: string;
  customerNotes?: string;
}

export interface IFetchCustomerOrdersPayload extends IPaginationPayload {
  status?: OrderStatus;
}

export interface IFetchAdminOrdersPayload extends IPaginationPayload {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  /** Order number ya customer name/email */
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ICancelOrderPayload<Reason extends string = CustomerCancelReason> {
  reason: Reason;
  note?: string;
}

export type IAdminCancelOrderPayload = ICancelOrderPayload<AdminCancelReason>;

export interface IUpdateOrderStatusPayload {
  status: OrderStatus;
}
