import { config } from "@/lib/config";
import { useAuthStore } from "@/stores/auth-store";

/* ---------------------------------------------------------------------------
   Endpoints — saare backend URLs ek jagah. Components/services mein hard-coded
   URL nahi (FLOW-MD 07 §8).
--------------------------------------------------------------------------- */
const BASE_URL = config.apiBaseUrl;

export const API_ENDPOINTS = {
  auth: {
    register: `${BASE_URL}/auth/register`,
    login: `${BASE_URL}/auth/login`,
    me: `${BASE_URL}/auth/me`,
  },
  categories: {
    list: `${BASE_URL}/categories`,
  },
  products: {
    list: `${BASE_URL}/products`,
    detail: (id: string) => `${BASE_URL}/products/${id}`,
  },
  addresses: {
    list: `${BASE_URL}/addresses`,
    detail: (id: string) => `${BASE_URL}/addresses/${id}`,
    setDefault: (id: string) => `${BASE_URL}/addresses/${id}/default`,
  },
  cart: {
    get: `${BASE_URL}/cart`,
    items: `${BASE_URL}/cart/items`,
    item: (id: string) => `${BASE_URL}/cart/items/${id}`,
  },
  order: {
    create: `${BASE_URL}/orders`,
    list: `${BASE_URL}/orders/me`,
    detail: (id: string) => `${BASE_URL}/orders/me/${id}`,
    cancel: (id: string) => `${BASE_URL}/orders/me/${id}/cancel`,
  },
  payment: {
    initiate: `${BASE_URL}/payments/initiate`,
    mockComplete: (id: string) => `${BASE_URL}/payments/${id}/mock-complete`,
  },
} as const;

export const ADMIN_API_ENDPOINTS = {
  categories: {
    list: `${BASE_URL}/admin/categories`,
    detail: (id: string) => `${BASE_URL}/admin/categories/${id}`,
  },
  products: {
    list: `${BASE_URL}/admin/products`,
    detail: (id: string) => `${BASE_URL}/admin/products/${id}`,
  },
  inventory: {
    list: `${BASE_URL}/admin/inventory`,
    adjustments: `${BASE_URL}/admin/inventory/adjustments`,
    transactions: (id: string) => `${BASE_URL}/admin/inventory/${id}/transactions`,
  },
  orders: {
    list: `${BASE_URL}/admin/orders`,
    detail: (id: string) => `${BASE_URL}/admin/orders/${id}`,
    status: (id: string) => `${BASE_URL}/admin/orders/${id}/status`,
    cancel: (id: string) => `${BASE_URL}/admin/orders/${id}/cancel`,
  },
  customers: {
    list: `${BASE_URL}/admin/customers`,
    status: (id: string) => `${BASE_URL}/admin/customers/${id}/status`,
  },
} as const;

/* ---------------------------------------------------------------------------
   API client — saari network calls isi se. Components kabhi `fetch` direct nahi
   karte (FLOW-MD 07 §2).
--------------------------------------------------------------------------- */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class AuthTokenMissingError extends Error {
  constructor() {
    super("Please sign in to continue.");
    this.name = "AuthTokenMissingError";
  }
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  contentType?: string;
  /** Diya ho to `Authorization: Bearer <token>` */
  token?: string | null;
  /** Opt-in timeout → ApiError(408) */
  timeoutMs?: number;
  signal?: AbortSignal;
}

export interface ApiResponse<T> {
  data?: T;
  status: number;
}

export const NETWORK_ERROR_MESSAGE =
  "Unable to reach the server. Please check your connection and try again.";
const FALLBACK_MESSAGE = "Something went wrong. Please try again.";

/** NestJS ke generic labels — inhein user ko message ki tarah nahi dikhate */
const GENERIC_ERROR_LABELS = new Set([
  "Bad Request",
  "Unauthorized",
  "Forbidden",
  "Not Found",
  "Conflict",
  "Too Many Requests",
  "Internal Server Error",
  "Error",
]);

/**
 * NestJS ke har error shape se readable message: `message` string, `message[]`
 * (validation — join), nested `message.message`, `errors[]`, aur `error` (FLOW-MD 08 §6).
 */
export function extractApiMessage(body: unknown, fallback = FALLBACK_MESSAGE): string {
  if (typeof body === "string") return body.trim() || fallback;
  if (!body || typeof body !== "object") return fallback;

  const { message, errors, error } = body as {
    message?: unknown;
    errors?: unknown;
    error?: unknown;
  };

  if (typeof message === "string" && message.trim()) return message;
  if (Array.isArray(message) && message.length > 0) {
    return message.map(String).join(", ");
  }
  if (message && typeof message === "object") {
    return extractApiMessage(message, fallback);
  }
  if (Array.isArray(errors) && errors.length > 0) {
    const joined = errors
      .map((entry) =>
        typeof entry === "string" ? entry : ((entry as { message?: string })?.message ?? ""),
      )
      .filter(Boolean)
      .join(", ");
    if (joined) return joined;
  }
  if (typeof error === "string" && error.trim() && !GENERIC_ERROR_LABELS.has(error)) {
    return error;
  }
  return fallback;
}

/**
 * Query string sirf defined values ke saath — khali filter URL mein nahi jata
 * (FLOW-MD 08 §11).
 */
export function withQuery(url: string, params: object): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `${url}?${query}` : url;
}

async function parseBody(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined;
  const text = await response.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

export async function request<T>(
  url: string,
  data?: unknown,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const method = options.method ?? (data === undefined ? "GET" : "POST");
  const headers: Record<string, string> = { Accept: "application/json" };
  if (data !== undefined) headers["Content-Type"] = options.contentType ?? "application/json";
  if (options.token) headers.Authorization = `Bearer ${options.token}`;

  const controller = new AbortController();
  const timer = options.timeoutMs
    ? setTimeout(() => controller.abort("timeout"), options.timeoutMs)
    : undefined;
  options.signal?.addEventListener("abort", () => controller.abort(options.signal?.reason), {
    once: true,
  });

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: data === undefined ? undefined : JSON.stringify(data),
      signal: controller.signal,
    });
  } catch (error) {
    if (options.signal?.aborted) throw error; // caller ne cancel kiya (e.g. TanStack Query)
    if (controller.signal.aborted) {
      throw new ApiError(408, "The request timed out. Please try again.");
    }
    throw new ApiError(0, NETWORK_ERROR_MESSAGE);
  } finally {
    if (timer) clearTimeout(timer);
  }

  const body = await parseBody(response);
  if (!response.ok) {
    // Token expire / invalid — session khatam (FLOW-MD 08 §13)
    if (response.status === 401 && options.token) {
      useAuthStore.getState().logout();
    }
    throw new ApiError(response.status, extractApiMessage(body), body);
  }
  return { data: body as T | undefined, status: response.status };
}

/** Login par save hua JWT; na ho to AuthTokenMissingError (FLOW-MD 08 §3) */
export function getAuthToken(): string {
  const token = useAuthStore.getState().token;
  if (!token) throw new AuthTokenMissingError();
  return token;
}
