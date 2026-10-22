import { ADMIN_API_ENDPOINTS, API_ENDPOINTS, getAuthToken, request, withQuery } from "@/lib/api";
import type { IPaginatedResponse } from "@/services/types";
import type {
  IAdminCancelOrderPayload,
  ICancelOrderPayload,
  ICreateOrderPayload,
  IFetchAdminOrdersPayload,
  IFetchCustomerOrdersPayload,
  IOrder,
  IOrderSummary,
  IUpdateOrderStatusPayload,
} from "./types";

export const orderService = {
  /** Stock lock + order + cart clear — backend ek transaction mein */
  create: async (payload: ICreateOrderPayload): Promise<IOrder> => {
    const response = await request<IOrder>(API_ENDPOINTS.order.create, payload, {
      method: "POST",
      token: getAuthToken(),
    });
    return response.data!;
  },

  listCustomer: async (
    payload: IFetchCustomerOrdersPayload,
    signal?: AbortSignal,
  ): Promise<IPaginatedResponse<IOrderSummary>> => {
    const response = await request<IPaginatedResponse<IOrderSummary>>(
      withQuery(API_ENDPOINTS.order.list, payload),
      undefined,
      { token: getAuthToken(), signal },
    );
    return response.data!;
  },

  getCustomerDetail: async (id: string, signal?: AbortSignal): Promise<IOrder> => {
    const response = await request<IOrder>(API_ENDPOINTS.order.detail(id), undefined, {
      token: getAuthToken(),
      signal,
    });
    return response.data!;
  },

  cancelCustomer: async (id: string, payload: ICancelOrderPayload): Promise<IOrder> => {
    const response = await request<IOrder>(API_ENDPOINTS.order.cancel(id), payload, {
      method: "PATCH",
      token: getAuthToken(),
    });
    return response.data!;
  },

  listAdmin: async (
    payload: IFetchAdminOrdersPayload,
    signal?: AbortSignal,
  ): Promise<IPaginatedResponse<IOrderSummary>> => {
    const response = await request<IPaginatedResponse<IOrderSummary>>(
      withQuery(ADMIN_API_ENDPOINTS.orders.list, payload),
      undefined,
      { token: getAuthToken(), signal },
    );
    return response.data!;
  },

  getAdminDetail: async (id: string, signal?: AbortSignal): Promise<IOrder> => {
    const response = await request<IOrder>(ADMIN_API_ENDPOINTS.orders.detail(id), undefined, {
      token: getAuthToken(),
      signal,
    });
    return response.data!;
  },

  updateStatus: async (id: string, payload: IUpdateOrderStatusPayload): Promise<IOrder> => {
    const response = await request<IOrder>(ADMIN_API_ENDPOINTS.orders.status(id), payload, {
      method: "PATCH",
      token: getAuthToken(),
    });
    return response.data!;
  },

  cancelAdmin: async (id: string, payload: IAdminCancelOrderPayload): Promise<IOrder> => {
    const response = await request<IOrder>(ADMIN_API_ENDPOINTS.orders.cancel(id), payload, {
      method: "PATCH",
      token: getAuthToken(),
    });
    return response.data!;
  },
};
