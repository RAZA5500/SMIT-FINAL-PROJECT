import { config } from "./config";

/** Saare backend URLs ek jagah — components/services mein hard-coded URL nahi (FLOW-MD 07 §8) */
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
