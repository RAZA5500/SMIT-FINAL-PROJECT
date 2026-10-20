import { API_ENDPOINTS } from "@/lib/api";
import { getAuthToken, request } from "@/lib/networking/request";
import type {
  IInitiatePaymentPayload,
  IInitiatePaymentResponse,
  IMockCompletePayload,
  IMockCompleteResponse,
} from "./types";

export const paymentService = {
  /**
   * Existing UNPAID payment ho to wahi milta hai — retry naya payment nahi banata.
   * Idempotency key backend `${orderId}:${attempt}` se banata hai (FLOW-MD 08 §8 gap ka fix).
   */
  initiate: async (payload: IInitiatePaymentPayload): Promise<IInitiatePaymentResponse> => {
    const response = await request<IInitiatePaymentResponse>(API_ENDPOINTS.payment.initiate, payload, {
      method: "POST",
      token: getAuthToken(),
    });
    return response.data!;
  },

  /** Student mock gateway — Stripe confirm ki jagah outcome (FLOW-MD 08 §16) */
  mockComplete: async (
    paymentId: string,
    payload: IMockCompletePayload,
  ): Promise<IMockCompleteResponse> => {
    const response = await request<IMockCompleteResponse>(
      API_ENDPOINTS.payment.mockComplete(paymentId),
      payload,
      { method: "POST", token: getAuthToken() },
    );
    return response.data!;
  },
};
