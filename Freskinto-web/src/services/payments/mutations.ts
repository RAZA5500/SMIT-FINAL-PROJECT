import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customerOrderKeys } from "@/services/orders/queries";
import { paymentService } from "./index";
import type { IInitiatePaymentPayload, IMockCompletePayload } from "./types";

/** Payment flow ke errors caller (checkout / order detail) khud handle karta hai */
export function useInitiatePayment() {
  return useMutation({
    mutationFn: (payload: IInitiatePaymentPayload) => paymentService.initiate(payload),
  });
}

export function useMockCompletePayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ paymentId, payload }: { paymentId: string; payload: IMockCompletePayload }) =>
      paymentService.mockComplete(paymentId, payload),
    // Order status (CONFIRMED) aur payment history badal gayi
    onSettled: () => qc.invalidateQueries({ queryKey: customerOrderKeys.all }),
  });
}
