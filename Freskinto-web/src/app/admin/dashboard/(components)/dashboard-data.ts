/**
 * Sample data for the dashboard (user decision: dashboard is a static mock, not
 * connected to the API). One source of truth so the KPI tiles, charts and table
 * views always agree — totals are derived, never typed twice.
 */

export const PERIOD_LABEL = "Last 7 days";
export const COMPARISON_LABEL = "vs previous 7 days";

export const DAILY = [
  { day: "Wed", revenue: 182, orders: 3 },
  { day: "Thu", revenue: 140, orders: 2 },
  { day: "Fri", revenue: 226, orders: 4 },
  { day: "Sat", revenue: 198, orders: 3 },
  { day: "Sun", revenue: 254, orders: 4 },
  { day: "Mon", revenue: 312, orders: 6 },
  { day: "Tue", revenue: 286, orders: 5 },
];

export const CATEGORY_SALES = [
  { category: "Fresh produce", revenue: 512 },
  { category: "Meat & poultry", revenue: 438 },
  { category: "Dairy & eggs", revenue: 296 },
  { category: "Bakery", revenue: 188 },
  { category: "Frozen", revenue: 164 },
];

const PREVIOUS = { revenue: 1204, orders: 21, customers: 15, refundRate: 3.1 };

const revenue = DAILY.reduce((sum, d) => sum + d.revenue, 0);
const orders = DAILY.reduce((sum, d) => sum + d.orders, 0);

function change(current: number, previous: number): number {
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

export interface Kpi {
  key: string;
  label: string;
  value: string;
  /** Signed % change (or percentage points for rates) */
  delta: number;
  deltaUnit: "%" | "pp";
  /** Kya barhna acha hai? (refund rate ke liye nahi) */
  upIsGood: boolean;
  /** 12 points — last point = current period */
  trend: number[];
}

export const KPIS: Kpi[] = [
  {
    key: "revenue",
    label: "Revenue",
    value: `£${revenue.toLocaleString("en-GB")}`,
    delta: change(revenue, PREVIOUS.revenue),
    deltaUnit: "%",
    upIsGood: true,
    trend: [820, 910, 880, 1010, 960, 1090, 1050, 1120, 1180, 1204, 1310, revenue],
  },
  {
    key: "orders",
    label: "Orders",
    value: String(orders),
    delta: change(orders, PREVIOUS.orders),
    deltaUnit: "%",
    upIsGood: true,
    trend: [14, 16, 15, 18, 17, 19, 18, 20, 22, 21, 24, orders],
  },
  {
    key: "customers",
    label: "Active customers",
    value: "18",
    delta: change(18, PREVIOUS.customers),
    deltaUnit: "%",
    upIsGood: true,
    trend: [9, 10, 10, 11, 12, 12, 13, 13, 14, 15, 16, 18],
  },
  {
    key: "refunds",
    label: "Refund rate",
    value: "1.9%",
    delta: Math.round((1.9 - PREVIOUS.refundRate) * 10) / 10,
    deltaUnit: "pp",
    upIsGood: false,
    trend: [4.2, 3.9, 4.1, 3.6, 3.8, 3.4, 3.3, 3.5, 3.2, 3.1, 2.4, 1.9],
  },
];

export const ACTIVITY = [
  { kind: "order", title: "Order ORD-2026-000027 confirmed", detail: "Paid by card · 5 items", time: "09:42" },
  { kind: "stock", title: "Stock adjusted: Bananas +24", detail: "Restock", time: "09:15" },
  { kind: "order", title: "Order ORD-2026-000026 delivered", detail: "Home delivery", time: "08:58" },
  { kind: "customer", title: "New customer registered", detail: "Created an account", time: "08:31" },
  { kind: "product", title: "Product created: Greek Yogurt", detail: "Dairy & eggs", time: "Yesterday" },
] as const;
