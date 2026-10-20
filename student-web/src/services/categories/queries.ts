import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { categoryService } from "./index";
import type { IFetchAdminCategoriesPayload, IFetchCategoriesPayload } from "./types";

export const categoryKeys = {
  all: ["categories"] as const,
  list: (payload: IFetchCategoriesPayload) => ["categories", "list", payload] as const,
};

export const adminCategoryKeys = {
  all: ["adminCategories"] as const,
  list: (payload: IFetchAdminCategoriesPayload) => ["adminCategories", "list", payload] as const,
};

export function useGetCategories(payload: IFetchCategoriesPayload) {
  return useQuery({
    queryKey: categoryKeys.list(payload),
    queryFn: ({ signal }) => categoryService.list(payload, signal),
  });
}

export function useGetAdminCategories(payload: IFetchAdminCategoriesPayload) {
  return useQuery({
    queryKey: adminCategoryKeys.list(payload),
    queryFn: ({ signal }) => categoryService.listAdmin(payload, signal),
    placeholderData: keepPreviousData,
  });
}
