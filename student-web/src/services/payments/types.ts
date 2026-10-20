import type { PaymentStatus } from "@/constants/enums";
import type { MockPaymentFormValues } from "@/modules/zod/payment.model";

/** Amount client nahi bhejta — server `order.total` use karta hai */
export interface IInitiatePaymentPayload {
  orderId: string;
}

export interface IInitiatePaymentResponse {
  paymentId: string;
  gatewayRef: string;
  amount: string;
}

export type IMockCompletePayload = MockPaymentFormValues;

export interface IMockCompleteResponse {
  status: PaymentStatus;
}
