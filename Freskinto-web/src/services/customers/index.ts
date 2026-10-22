import { ADMIN_API_ENDPOINTS, getAuthToken, request, withQuery } from "@/lib/api";
import type { IPaginatedResponse } from "@/services/types";
import type { ICustomer, IFetchCustomersPayload, IUpdateCustomerStatusPayload } from "./types";

export const customerService = {
  list: async (
    payload: IFetchCustomersPayload,
    signal?: AbortSignal,
  ): Promise<IPaginatedResponse<ICustomer>> => {
    const response = await request<IPaginatedResponse<ICustomer>>(
      withQuery(ADMIN_API_ENDPOINTS.customers.list, payload),
      undefined,
      { token: getAuthToken(), signal },
    );
    return response.data!;
  },

  updateStatus: async (id: string, payload: IUpdateCustomerStatusPayload): Promise<ICustomer> => {
    const response = await request<ICustomer>(ADMIN_API_ENDPOINTS.customers.status(id), payload, {
      method: "PATCH",
      token: getAuthToken(),
    });
    return response.data!;
  },
};
