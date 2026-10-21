import { ADMIN_API_ENDPOINTS, API_ENDPOINTS } from "@/lib/api";
import { withQuery } from "@/lib/networking/query";
import { getAuthToken, request } from "@/lib/networking/request";
import type { IPaginatedResponse } from "@/services/types";
import type {
  IAdminProduct,
  ICreateProductPayload,
  IFetchAdminProductsPayload,
  IFetchProductsPayload,
  IProduct,
  IUpdateProductPayload,
} from "./types";

export const productService = {
  /** Public catalog — backend sirf active products deta hai */
  list: async (
    payload: IFetchProductsPayload,
    signal?: AbortSignal,
  ): Promise<IPaginatedResponse<IProduct>> => {
    const response = await request<IPaginatedResponse<IProduct>>(
      withQuery(API_ENDPOINTS.products.list, payload),
      undefined,
      { signal },
    );
    return response.data!;
  },

  /** Public detail — inactive product par backend 404 deta hai */
  get: async (id: string, signal?: AbortSignal): Promise<IProduct> => {
    const response = await request<IProduct>(API_ENDPOINTS.products.detail(id), undefined, { signal });
    return response.data!;
  },

  listAdmin: async (
    payload: IFetchAdminProductsPayload,
    signal?: AbortSignal,
  ): Promise<IPaginatedResponse<IAdminProduct>> => {
    const response = await request<IPaginatedResponse<IAdminProduct>>(
      withQuery(ADMIN_API_ENDPOINTS.products.list, payload),
      undefined,
      { token: getAuthToken(), signal },
    );
    return response.data!;
  },

  getAdmin: async (id: string, signal?: AbortSignal): Promise<IAdminProduct> => {
    const response = await request<IAdminProduct>(ADMIN_API_ENDPOINTS.products.detail(id), undefined, {
      token: getAuthToken(),
      signal,
    });
    return response.data!;
  },

  create: async (payload: ICreateProductPayload): Promise<IAdminProduct> => {
    const response = await request<IAdminProduct>(ADMIN_API_ENDPOINTS.products.list, payload, {
      method: "POST",
      token: getAuthToken(),
    });
    return response.data!;
  },

  update: async (id: string, payload: IUpdateProductPayload): Promise<IAdminProduct> => {
    const response = await request<IAdminProduct>(ADMIN_API_ENDPOINTS.products.detail(id), payload, {
      method: "PATCH",
      token: getAuthToken(),
    });
    return response.data!;
  },
};
