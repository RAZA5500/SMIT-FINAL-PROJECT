import type { ICreateOrderPayload } from "@/services/orders/types";

/**
 * Checkout form ka validated payload `/checkout/payment` tak (FLOW-MD 08 §16:
 * `saveOrderIntent(sessionStorage)`). Order "Pay Now" par hi banta hai.
 */
const ORDER_INTENT_KEY = "checkout_order_intent";

export function saveOrderIntent(payload: ICreateOrderPayload): void {
  try {
    sessionStorage.setItem(ORDER_INTENT_KEY, JSON.stringify(payload));
  } catch {
    // Storage band ho (private mode) — payment page "start again" dikhayega
  }
}

export function readOrderIntent(): ICreateOrderPayload | null {
  try {
    const raw = sessionStorage.getItem(ORDER_INTENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ICreateOrderPayload>;
    return parsed.deliveryType === "DELIVERY" || parsed.deliveryType === "PICKUP"
      ? (parsed as ICreateOrderPayload)
      : null;
  } catch {
    return null;
  }
}

export function clearOrderIntent(): void {
  try {
    sessionStorage.removeItem(ORDER_INTENT_KEY);
  } catch {
    // ignore
  }
}
