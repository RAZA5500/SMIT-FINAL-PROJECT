import { API_ENDPOINTS } from "@/lib/api";
import { getAuthToken, request } from "@/lib/networking/request";
import type { ILoginPayload, ILoginResponse, IRegisterPayload, IUser } from "./types";

export const authService = {
  login: async (payload: ILoginPayload): Promise<ILoginResponse> => {
    const response = await request<ILoginResponse>(API_ENDPOINTS.auth.login, payload, {
      method: "POST",
    });
    return response.data!;
  },

  register: async (payload: IRegisterPayload): Promise<IUser> => {
    const response = await request<IUser>(API_ENDPOINTS.auth.register, payload, {
      method: "POST",
    });
    return response.data!;
  },

  /** Role hamesha backend se — frontend khud decide nahi karta */
  me: async (signal?: AbortSignal): Promise<IUser> => {
    const response = await request<IUser>(API_ENDPOINTS.auth.me, undefined, {
      token: getAuthToken(),
      signal,
    });
    return response.data!;
  },
};
