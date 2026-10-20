import { API_ENDPOINTS } from "@/lib/api";
import { withQuery } from "@/lib/networking/query";
import { getAuthToken, request } from "@/lib/networking/request";
import type { IPaginatedResponse } from "@/services/types";
import type {
  IAddress,
  ICreateAddressPayload,
  IFetchAddressesPayload,
  IUpdateAddressPayload,
} from "./types";

export const addressService = {
  /** Default address pehle */
  list: async (
    payload: IFetchAddressesPayload,
    signal?: AbortSignal,
  ): Promise<IPaginatedResponse<IAddress>> => {
    const response = await request<IPaginatedResponse<IAddress>>(
      withQuery(API_ENDPOINTS.addresses.list, payload),
      undefined,
      { token: getAuthToken(), signal },
    );
    return response.data!;
  },

  create: async (payload: ICreateAddressPayload): Promise<IAddress> => {
    const response = await request<IAddress>(API_ENDPOINTS.addresses.list, payload, {
      method: "POST",
      token: getAuthToken(),
    });
    return response.data!;
  },

  update: async (id: string, payload: IUpdateAddressPayload): Promise<IAddress> => {
    const response = await request<IAddress>(API_ENDPOINTS.addresses.detail(id), payload, {
      method: "PATCH",
      token: getAuthToken(),
    });
    return response.data!;
  },

  setDefault: async (id: string): Promise<IAddress> => {
    const response = await request<IAddress>(API_ENDPOINTS.addresses.setDefault(id), undefined, {
      method: "PATCH",
      token: getAuthToken(),
    });
    return response.data!;
  },

  remove: async (id: string): Promise<void> => {
    await request<void>(API_ENDPOINTS.addresses.detail(id), undefined, {
      method: "DELETE",
      token: getAuthToken(),
    });
  },
};
