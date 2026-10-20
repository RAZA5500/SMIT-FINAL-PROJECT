import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ORDER_STATUS_LABELS } from "@/constants/labels";
import { toastError, toastSuccess } from "@/lib/toast";
import { cartKeys } from "@/services/cart/queries";
import { inventoryKeys } from "@/services/inventory/queries";
import { adminProductKeys, productKeys } from "@/services/products/queries";
import type { IMutationOptions } from "@/services/types";
import { orderService } from "./index";
import { adminOrderKeys, customerOrderKeys } from "./queries";
import type {
  IAdminCancelOrderPayload,
  ICancelOrderPayload,
  ICreateOrderPayload,
  IUpdateOrderStatusPayload,
} from "./types";

/** Checkout page khud errors map karti hai (409, stock, khali cart) — is liye default silent */
export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICreateOrderPayload) => orderService.create(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: cartKeys.cart });
      void qc.invalidateQueries({ queryKey: customerOrderKeys.all });
      // Stock deduct hua — catalog ka stockStatus badal sakta hai
      void qc.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useCancelOrder({ silent }: IMutationOptions = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ICancelOrderPayload }) =>
      orderService.cancelCustomer(id, payload),
    onSuccess: (order) => {
      void qc.invalidateQueries({ queryKey: customerOrderKeys.all });
      void qc.invalidateQueries({ queryKey: productKeys.all });
      if (!silent) {
        toastSuccess(
          order.status === "REFUND_PENDING" ? "Order cancelled — refund in progress" : "Order cancelled",
          order.orderNumber,
        );
      }
    },
    onError: (error: Error) => {
      if (!silent) toastError("Failed to cancel order", error.message);
    },
  });
}

/**
 * Admin order mutations error par bhi refetch karte hain — 409/400 ka matlab aksar
 * cache purana hai (doosre admin/cron ne status badal diya) (FLOW-MD 08 §9).
 */
export function useUpdateOrderStatus({ silent }: IMutationOptions = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: IUpdateOrderStatusPayload }) =>
      orderService.updateStatus(id, payload),
    onSuccess: (order) => {
      if (!silent) {
        toastSuccess("Order status updated", `${order.orderNumber} is now ${ORDER_STATUS_LABELS[order.status]}.`);
      }
    },
    onError: (error: Error) => {
      if (!silent) toastError("Failed to update status", error.message);
    },
    onSettled: () => qc.refetchQueries({ queryKey: adminOrderKeys.all }),
  });
}

export function useAdminCancelOrder({ silent }: IMutationOptions = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: IAdminCancelOrderPayload }) =>
      orderService.cancelAdmin(id, payload),
    onSuccess: (order) => {
      // Stock wapas aaya
      void qc.invalidateQueries({ queryKey: inventoryKeys.all });
      void qc.invalidateQueries({ queryKey: adminProductKeys.all });
      void qc.invalidateQueries({ queryKey: productKeys.all });
      if (!silent) {
        toastSuccess(
          order.status === "REFUND_PENDING" ? "Order cancelled — refund in progress" : "Order cancelled",
          order.orderNumber,
        );
      }
    },
    onError: (error: Error) => {
      if (!silent) toastError("Failed to cancel order", error.message);
    },
    onSettled: () => qc.refetchQueries({ queryKey: adminOrderKeys.all }),
  });
}
