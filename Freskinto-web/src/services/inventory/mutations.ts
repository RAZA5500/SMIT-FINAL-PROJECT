import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { toastError, toastSuccess } from "@/lib/toast";
import { adminProductKeys, productKeys } from "@/services/products/queries";
import type { IMutationOptions } from "@/services/types";
import { inventoryService } from "./index";
import { inventoryKeys } from "./queries";
import type { IAdjustInventoryPayload, ICreateInventoryPayload } from "./types";

/** Stock badla to inventory, admin products (qtyOnHand) aur catalog (stockStatus) purane */
function invalidateStock(qc: QueryClient) {
  void qc.invalidateQueries({ queryKey: inventoryKeys.all });
  void qc.invalidateQueries({ queryKey: adminProductKeys.all });
  void qc.invalidateQueries({ queryKey: productKeys.all });
}

export function useCreateInventory({ silent }: IMutationOptions = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICreateInventoryPayload) => inventoryService.create(payload),
    onSuccess: (inventory) => {
      invalidateStock(qc);
      if (!silent) {
        toastSuccess("Inventory added", `${inventory.product.name}: ${inventory.qtyOnHand} in stock.`);
      }
    },
    onError: (error: Error) => {
      if (!silent) toastError("Failed to add inventory", error.message);
    },
  });
}

export function useAdjustInventory({ silent }: IMutationOptions = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: IAdjustInventoryPayload) => inventoryService.adjust(payload),
    onSuccess: ({ inventory }) => {
      invalidateStock(qc);
      if (!silent) {
        toastSuccess("Stock adjusted", `${inventory.product.name}: ${inventory.qtyOnHand} in stock.`);
      }
    },
    onError: (error: Error) => {
      if (!silent) toastError("Failed to adjust stock", error.message);
    },
  });
}
