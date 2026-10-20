import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastError, toastSuccess } from "@/lib/toast";
import { adminCategoryKeys, categoryKeys } from "@/services/categories/queries";
import type { IMutationOptions } from "@/services/types";
import { productService } from "./index";
import { adminProductKeys, productKeys } from "./queries";
import type { ICreateProductPayload, IUpdateProductPayload } from "./types";

export function useCreateProduct({ silent }: IMutationOptions = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICreateProductPayload) => productService.create(payload),
    onSuccess: (product) => {
      void qc.invalidateQueries({ queryKey: productKeys.lists });
      void qc.invalidateQueries({ queryKey: adminProductKeys.all });
      // Category ka productCount badal gaya
      void qc.invalidateQueries({ queryKey: adminCategoryKeys.all });
      void qc.invalidateQueries({ queryKey: categoryKeys.all });
      if (!silent) toastSuccess("Product created", `"${product.name}" (${product.sku}) has been added.`);
    },
    onError: (error: Error) => {
      if (!silent) toastError("Failed to create product", error.message);
    },
  });
}

export function useUpdateProduct({ silent }: IMutationOptions = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: IUpdateProductPayload }) =>
      productService.update(id, payload),
    onSuccess: (product) => {
      void qc.invalidateQueries({ queryKey: productKeys.lists });
      void qc.invalidateQueries({ queryKey: productKeys.detail(product.id) });
      void qc.invalidateQueries({ queryKey: adminProductKeys.all });
      void qc.invalidateQueries({ queryKey: adminCategoryKeys.all });
      void qc.invalidateQueries({ queryKey: categoryKeys.all });
      if (!silent) toastSuccess("Product updated", `"${product.name}" has been saved.`);
    },
    onError: (error: Error) => {
      if (!silent) toastError("Failed to update product", error.message);
    },
  });
}
