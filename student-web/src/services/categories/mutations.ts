import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastError, toastSuccess } from "@/lib/toast";
import { adminProductKeys, productKeys } from "@/services/products/queries";
import type { IMutationOptions } from "@/services/types";
import { categoryService } from "./index";
import { adminCategoryKeys, categoryKeys } from "./queries";
import type { ICreateCategoryPayload, IUpdateCategoryPayload } from "./types";

export function useCreateCategory({ silent }: IMutationOptions = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICreateCategoryPayload) => categoryService.create(payload),
    onSuccess: (category) => {
      void qc.invalidateQueries({ queryKey: adminCategoryKeys.all });
      void qc.invalidateQueries({ queryKey: categoryKeys.all });
      if (!silent) toastSuccess("Category created", `"${category.name}" has been added.`);
    },
    onError: (error: Error) => {
      if (!silent) toastError("Failed to create category", error.message);
    },
  });
}

export function useUpdateCategory({ silent }: IMutationOptions = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: IUpdateCategoryPayload }) =>
      categoryService.update(id, payload),
    onSuccess: (category) => {
      void qc.invalidateQueries({ queryKey: adminCategoryKeys.all });
      void qc.invalidateQueries({ queryKey: categoryKeys.all });
      // Product lists category ka naam dikhati hain
      void qc.invalidateQueries({ queryKey: adminProductKeys.all });
      void qc.invalidateQueries({ queryKey: productKeys.all });
      if (!silent) toastSuccess("Category updated", `"${category.name}" has been saved.`);
    },
    onError: (error: Error) => {
      if (!silent) toastError("Failed to update category", error.message);
    },
  });
}

export function useDeleteCategory({ silent }: IMutationOptions = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoryService.remove(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: adminCategoryKeys.all });
      void qc.invalidateQueries({ queryKey: categoryKeys.all });
      if (!silent) toastSuccess("Category deleted");
    },
    onError: (error: Error) => {
      if (!silent) toastError("Failed to delete category", error.message);
    },
  });
}
