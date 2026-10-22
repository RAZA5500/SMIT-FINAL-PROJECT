import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastError, toastSuccess } from "@/lib/toast";
import type { IMutationOptions } from "@/services/types";
import { customerService } from "./index";
import { adminCustomerKeys } from "./queries";
import type { IUpdateCustomerStatusPayload } from "./types";

export function useUpdateCustomerStatus({ silent }: IMutationOptions = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: IUpdateCustomerStatusPayload }) =>
      customerService.updateStatus(id, payload),
    onSuccess: (customer) => {
      void qc.invalidateQueries({ queryKey: adminCustomerKeys.all });
      if (!silent) {
        toastSuccess(
          customer.isActive ? "Customer activated" : "Customer deactivated",
          `${customer.name} (${customer.email})`,
        );
      }
    },
    onError: (error: Error) => {
      if (!silent) toastError("Failed to update customer", error.message);
    },
  });
}
