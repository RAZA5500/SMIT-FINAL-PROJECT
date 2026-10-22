import { API_ENDPOINTS, getAuthToken, request } from "@/lib/api";
import type { IAddCartItemPayload, ICart, IUpdateCartItemPayload } from "./types";

export const cartService = {
  /** Get-or-create — CUSTOMER only */
  get: async (signal?: AbortSignal): Promise<ICart> => {
    const response = await request<ICart>(API_ENDPOINTS.cart.get, undefined, {
      token: getAuthToken(),
      signal,
    });
    return response.data!;
  },

  addItem: async (payload: IAddCartItemPayload): Promise<ICart> => {
    const response = await request<ICart>(API_ENDPOINTS.cart.items, payload, {
      method: "POST",
      token: getAuthToken(),
    });
    return response.data!;
  },

  updateItem: async (itemId: string, payload: IUpdateCartItemPayload): Promise<ICart> => {
    const response = await request<ICart>(API_ENDPOINTS.cart.item(itemId), payload, {
      method: "PATCH",
      token: getAuthToken(),
    });
    return response.data!;
  },

  removeItem: async (itemId: string): Promise<void> => {
    await request<void>(API_ENDPOINTS.cart.item(itemId), undefined, {
      method: "DELETE",
      token: getAuthToken(),
    });
  },

  clear: async (): Promise<void> => {
    await request<void>(API_ENDPOINTS.cart.get, undefined, {
      method: "DELETE",
      token: getAuthToken(),
    });
  },
};
