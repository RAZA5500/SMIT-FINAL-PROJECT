import { ADMIN_API_ENDPOINTS, API_ENDPOINTS } from "@/lib/api";
import { withQuery } from "@/lib/networking/query";
import { getAuthToken, request } from "@/lib/networking/request";
import type { IPaginatedResponse } from "@/services/types";
import type {
  ICategory,
  ICreateCategoryPayload,
  IFetchAdminCategoriesPayload,
  IFetchCategoriesPayload,
  IUpdateCategoryPayload,
} from "./types";

export const categoryService = {
  /** Public — backend sirf active categories deta hai */
  list: async (
    payload: IFetchCategoriesPayload,
    signal?: AbortSignal,
  ): Promise<IPaginatedResponse<ICategory>> => {
    const response = await request<IPaginatedResponse<ICategory>>(
      withQuery(API_ENDPOINTS.categories.list, payload),
      undefined,
      { signal },
    );
    return response.data!;
  },

  listAdmin: async (
    payload: IFetchAdminCategoriesPayload,
    signal?: AbortSignal,
  ): Promise<IPaginatedResponse<ICategory>> => {
    const response = await request<IPaginatedResponse<ICategory>>(
      withQuery(ADMIN_API_ENDPOINTS.categories.list, payload),
      undefined,
      { token: getAuthToken(), signal },
    );
    return response.data!;
  },

  create: async (payload: ICreateCategoryPayload): Promise<ICategory> => {
    const response = await request<ICategory>(ADMIN_API_ENDPOINTS.categories.list, payload, {
      method: "POST",
      token: getAuthToken(),
    });
    return response.data!;
  },

  update: async (id: string, payload: IUpdateCategoryPayload): Promise<ICategory> => {
    const response = await request<ICategory>(ADMIN_API_ENDPOINTS.categories.detail(id), payload, {
      method: "PATCH",
      token: getAuthToken(),
    });
    return response.data!;
  },

  remove: async (id: string): Promise<void> => {
    await request<void>(ADMIN_API_ENDPOINTS.categories.detail(id), undefined, {
      method: "DELETE",
      token: getAuthToken(),
    });
  },
};
