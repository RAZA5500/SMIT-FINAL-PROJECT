import { ADMIN_API_ENDPOINTS } from "@/lib/api";
import { withQuery } from "@/lib/networking/query";
import { getAuthToken, request } from "@/lib/networking/request";
import type { IPaginatedResponse } from "@/services/types";
import type {
  IAdjustInventoryPayload,
  IAdjustmentResult,
  ICreateInventoryPayload,
  IFetchInventoryPayload,
  IFetchInventoryTransactionsPayload,
  IInventory,
  IInventoryTransaction,
} from "./types";

export const inventoryService = {
  list: async (
    payload: IFetchInventoryPayload,
    signal?: AbortSignal,
  ): Promise<IPaginatedResponse<IInventory>> => {
    const response = await request<IPaginatedResponse<IInventory>>(
      withQuery(ADMIN_API_ENDPOINTS.inventory.list, payload),
      undefined,
      { token: getAuthToken(), signal },
    );
    return response.data!;
  },

  create: async (payload: ICreateInventoryPayload): Promise<IInventory> => {
    const response = await request<IInventory>(ADMIN_API_ENDPOINTS.inventory.list, payload, {
      method: "POST",
      token: getAuthToken(),
    });
    return response.data!;
  },

  adjust: async (payload: IAdjustInventoryPayload): Promise<IAdjustmentResult> => {
    const response = await request<IAdjustmentResult>(ADMIN_API_ENDPOINTS.inventory.adjustments, payload, {
      method: "POST",
      token: getAuthToken(),
    });
    return response.data!;
  },

  listTransactions: async (
    inventoryId: string,
    payload: IFetchInventoryTransactionsPayload,
    signal?: AbortSignal,
  ): Promise<IPaginatedResponse<IInventoryTransaction>> => {
    const response = await request<IPaginatedResponse<IInventoryTransaction>>(
      withQuery(ADMIN_API_ENDPOINTS.inventory.transactions(inventoryId), payload),
      undefined,
      { token: getAuthToken(), signal },
    );
    return response.data!;
  },
};
