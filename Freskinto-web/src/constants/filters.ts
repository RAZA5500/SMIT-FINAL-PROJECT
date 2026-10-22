import type { ProductSort } from "@/services/products/types";
import {
  ADJUSTMENT_REASONS,
  ADMIN_CANCEL_REASONS,
  CUSTOMER_CANCEL_REASONS,
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  STOCK_STATUSES,
} from "./enums";
import {
  ADJUSTMENT_REASON_LABELS,
  ADMIN_CANCEL_REASON_LABELS,
  CUSTOMER_CANCEL_REASON_LABELS,
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  STOCK_STATUS_LABELS,
} from "./labels";

export interface FilterOption<T extends string = string> {
  value: T;
  label: string;
}

/** Table/filter dropdown mein "All" ke liye sentinel — API ko kabhi nahi jata */
export const ALL_VALUE = "all";

/** Pagination — storefront grid aur admin tables ka page size */
export const SHOP_PAGE_SIZE = 12;
export const ACCOUNT_PAGE_SIZE = 10;
export const ADMIN_PAGE_SIZE = 10;
/** Dropdowns jo poori list chahte hain (backend max limit) */
export const LOOKUP_LIMIT = 100;

export const SHOP_SORT_OPTIONS: FilterOption<ProductSort>[] = [
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "name_asc", label: "Name: A to Z" },
];

/** Shop ka availability filter (client-side — API mein stock filter nahi) */
export const SHOP_AVAILABILITY_OPTIONS: FilterOption[] = [
  { value: "all", label: "Show everything" },
  { value: "in", label: "In stock only" },
];

/** Shop ke price brackets — `null` = khuli hadd */
export const PRICE_PRESETS: { key: string; label: string; min: number | null; max: number | null }[] = [
  { key: "u2", label: "Under £2", min: null, max: 2 },
  { key: "2-5", label: "£2 – £5", min: 2, max: 5 },
  { key: "5-10", label: "£5 – £10", min: 5, max: 10 },
  { key: "10+", label: "£10+", min: 10, max: null },
];

export const ORDER_STATUS_OPTIONS: FilterOption[] = ORDER_STATUSES.map((value) => ({
  value,
  label: ORDER_STATUS_LABELS[value],
}));

export const PAYMENT_STATUS_OPTIONS: FilterOption[] = PAYMENT_STATUSES.map((value) => ({
  value,
  label: PAYMENT_STATUS_LABELS[value],
}));

export const STOCK_STATUS_OPTIONS: FilterOption[] = STOCK_STATUSES.map((value) => ({
  value,
  label: STOCK_STATUS_LABELS[value],
}));

export const ACTIVE_STATUS_OPTIONS: FilterOption[] = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

export const CUSTOMER_CANCEL_REASON_OPTIONS: FilterOption[] = CUSTOMER_CANCEL_REASONS.map((value) => ({
  value,
  label: CUSTOMER_CANCEL_REASON_LABELS[value],
}));

export const ADMIN_CANCEL_REASON_OPTIONS: FilterOption[] = ADMIN_CANCEL_REASONS.map((value) => ({
  value,
  label: ADMIN_CANCEL_REASON_LABELS[value],
}));

export const ADJUSTMENT_REASON_OPTIONS: FilterOption[] = ADJUSTMENT_REASONS.map((value) => ({
  value,
  label: ADJUSTMENT_REASON_LABELS[value],
}));
