import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { inventoryService } from "./index";
import type { IFetchInventoryPayload, IFetchInventoryTransactionsPayload } from "./types";

export const inventoryKeys = {
  all: ["inventory"] as const,
  list: (payload: IFetchInventoryPayload) => ["inventory", "list", payload] as const,
  transactions: (inventoryId: string, payload: IFetchInventoryTransactionsPayload) =>
    ["inventory", "transactions", inventoryId, payload] as const,
};

export function useGetInventory(payload: IFetchInventoryPayload) {
  return useQuery({
    queryKey: inventoryKeys.list(payload),
    queryFn: ({ signal }) => inventoryService.list(payload, signal),
    placeholderData: keepPreviousData,
  });
}

export function useGetInventoryTransactions(
  inventoryId: string,
  payload: IFetchInventoryTransactionsPayload,
) {
  return useQuery({
    queryKey: inventoryKeys.transactions(inventoryId, payload),
    queryFn: ({ signal }) => inventoryService.listTransactions(inventoryId, payload, signal),
    placeholderData: keepPreviousData,
  });
}
