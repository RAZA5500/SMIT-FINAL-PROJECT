import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { productService } from "./index";
import type { IFetchAdminProductsPayload, IFetchProductsPayload } from "./types";

export const productKeys = {
  all: ["products"] as const,
  lists: ["products", "list"] as const,
  list: (payload: IFetchProductsPayload) => ["products", "list", payload] as const,
  detail: (id: string) => ["products", "detail", id] as const,
};

export const adminProductKeys = {
  all: ["adminProducts"] as const,
  list: (payload: IFetchAdminProductsPayload) => ["adminProducts", "list", payload] as const,
  detail: (id: string) => ["adminProducts", "detail", id] as const,
};

export function useGetProducts(payload: IFetchProductsPayload) {
  return useQuery({
    queryKey: productKeys.list(payload),
    queryFn: ({ signal }) => productService.list(payload, signal),
    placeholderData: keepPreviousData,
  });
}

export function useGetAdminProducts(payload: IFetchAdminProductsPayload, enabled = true) {
  return useQuery({
    queryKey: adminProductKeys.list(payload),
    queryFn: ({ signal }) => productService.listAdmin(payload, signal),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useGetAdminProduct(id: string) {
  return useQuery({
    queryKey: adminProductKeys.detail(id),
    queryFn: ({ signal }) => productService.getAdmin(id, signal),
  });
}
