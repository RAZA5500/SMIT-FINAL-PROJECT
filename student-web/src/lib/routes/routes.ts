/** Saare client paths — components mein hard-coded "/admin/orders" nahi (FLOW-MD 07 §8) */

export const publicRoutes = {
  home: "/",
  shop: "/shop",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
} as const;

export const customerRoutes = {
  cart: "/cart",
  checkout: "/checkout",
  checkoutPayment: "/checkout/payment",
  orders: "/orders",
  orderDetail: (id: string) => `/orders/${id}`,
  addresses: "/addresses",
} as const;

export const adminRoutes = {
  dashboard: "/admin/dashboard",
  categories: "/admin/categories",
  products: "/admin/products",
  productNew: "/admin/products/new",
  productEdit: (id: string) => `/admin/products/${id}/edit`,
  inventory: "/admin/inventory",
  orders: "/admin/orders",
  orderDetail: (id: string) => `/admin/orders/${id}`,
  customers: "/admin/customers",
} as const;

/** Login ke baad har role ka apna area (FLOW-MD 01 §4) */
export function homeForRole(role: "ADMIN" | "CUSTOMER"): string {
  return role === "ADMIN" ? adminRoutes.dashboard : publicRoutes.shop;
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

/**
 * Scope se bahar ke admin screens — sirf static mock UI, backend se connected nahi
 * (user decision: inhein waisa hi rakha gaya hai).
 */
export const adminMockRoutes = {
  brands: "/admin/brands",
  brandNew: "/admin/brands/create",
  allergens: "/admin/allergens",
  inventoryTransactions: "/admin/inventory-transactions",
  coupons: "/admin/coupons",
  promotions: "/admin/promotions",
  reviews: "/admin/reviews",
  testimonials: "/admin/testimonials",
  orderListing: "/admin/order-listing",
  settings: "/admin/settings",
  profile: "/admin/profile",
  notifications: "/admin/notifications",
} as const;
