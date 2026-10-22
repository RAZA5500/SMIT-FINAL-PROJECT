"use client";

import type { PaymentStatus } from "@/constants/enums";
import { PAYMENT_STATUS_LABELS } from "@/constants/labels";
import { toastError, toastSuccess } from "@/lib/toast";
import type { MockPaymentFormValues } from "@/modules/zod/payment.model";
import { useInitiatePayment, useMockCompletePayment } from "@/services/payments/mutations";

/** `POST /payments/initiate` fail hua — payment shuru hi nahi hui (checkout order cancel karta hai) */
export class PaymentStartError extends Error {
  constructor(cause: Error) {
    super(cause.message);
    this.name = "PaymentStartError";
  }
}

/**
 * Existing order ki payment: initiate → mock-complete (sequential, dependent —
 * FLOW-MD 11 §7). Initiate retry par backend wahi UNPAID payment lautata hai.
 */
export function usePayOrder() {
  const initiate = useInitiatePayment();
  const complete = useMockCompletePayment();

  const pay = async (orderId: string, outcome: MockPaymentFormValues["outcome"]): Promise<PaymentStatus> => {
    let paymentId: string;
    try {
      ({ paymentId } = await initiate.mutateAsync({ orderId }));
    } catch (error) {
      throw new PaymentStartError(error as Error);
    }
    const { status } = await complete.mutateAsync({ paymentId, payload: { outcome } });
    return status;
  };

  return { pay, isPending: initiate.isPending || complete.isPending };
}

export function notifyPaymentResult(status: PaymentStatus, orderNumber: string): void {
  if (status === "PAID") {
    toastSuccess("Payment successful", `Order ${orderNumber} is confirmed.`);
  } else if (status === "FAILED") {
    toastError(
      "Payment failed",
      `Your payment for ${orderNumber} was declined. You can try again from the order page before it expires.`,
    );
  } else {
    toastError("Payment not completed", `Payment status: ${PAYMENT_STATUS_LABELS[status]}.`);
  }
}
