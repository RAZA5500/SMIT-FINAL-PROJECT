/** Saare client paths — components mein hard-coded "/admin/orders" nahi (FLOW-MD 07 §8) */

export const publicRoutes = {
  home: "/",
  shop: "/shop",
  product: (id: string) => `/products/${id}`,
  login: "/login",
  register: "/register",
} as const;

export const customerRoutes = {
  cart: "/cart",
  cartSummary: "/cart-summary",
  checkout: "/checkout",
  checkoutPayment: "/checkout/payment",
  orders: "/orders",
  orderDetail: (id: string) => `/orders/${id}`,
  addresses: "/addresses",
  profile: "/profile",
} as const;

export const adminRoutes = {
  home: "/admin",
  categories: "/admin/categories",
  products: "/admin/products",
  productNew: "/admin/products/new",
  productEdit: (id: string) => `/admin/products/${id}/edit`,
  inventory: "/admin/inventory",
  orders: "/admin/orders",
  orderDetail: (id: string) => `/admin/orders/${id}`,
  customers: "/admin/customers",
} as const;

/** Shop ke filters URL mein — header search, category links aur back button sab isi se */
export interface ShopUrlParams {
  q?: string;
  category?: string;
  sort?: string;
  min?: number;
  max?: number;
  stock?: string;
  page?: number;
}

export function shopUrl(params: ShopUrlParams = {}): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `${publicRoutes.shop}?${query}` : publicRoutes.shop;
}

/** Login ke baad har role ka apna area (FLOW-MD 01 §4) */
export function homeForRole(role: "ADMIN" | "CUSTOMER"): string {
  return role === "ADMIN" ? adminRoutes.orders : publicRoutes.shop;
}

/** Login page, wapas aane ke liye redirect param ke saath */
export function loginUrl(redirectTo?: string): string {
  return redirectTo
    ? `${publicRoutes.login}?redirect=${encodeURIComponent(redirectTo)}`
    : publicRoutes.login;
}

/** Sirf apni site ke relative paths — open redirect se bachao */
export function safeRedirect(path: string | null | undefined): string | null {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return null;
  return path;
}
