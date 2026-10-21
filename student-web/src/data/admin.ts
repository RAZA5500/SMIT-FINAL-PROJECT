/**
 * Sample data for the static admin screens (user decision: brands, allergens,
 * stock movements, order board, coupons, promotions, reviews, testimonials and
 * notifications stay design previews, not connected to the API). Dates are
 * display strings so server and browser render the same text.
 */
import type { AdjustmentReason, DeliveryType, OrderStatus, PaymentStatus, TransactionType } from "@/constants/enums";

export interface Brand {
  name: string;
  /** Aisle the brand mostly supplies — picks the monogram tint */
  aisle: string;
  ownLabel: boolean;
  products: number;
}

export const BRANDS: Brand[] = [
  { name: "Freskinto Kitchen", aisle: "Bakery", ownLabel: true, products: 6 },
  { name: "Freskinto Farm Shop", aisle: "Fresh vegetables", ownLabel: true, products: 9 },
  { name: "Meadow Lane Dairy", aisle: "Dairy & eggs", ownLabel: false, products: 4 },
  { name: "Green Valley Growers", aisle: "Fresh fruit", ownLabel: false, products: 7 },
  { name: "Northfield Butchers", aisle: "Meat", ownLabel: false, products: 5 },
  { name: "Hillside Poultry", aisle: "Poultry", ownLabel: false, products: 4 },
  { name: "Polar Pantry", aisle: "Frozen", ownLabel: false, products: 5 },
  { name: "Crunch & Co.", aisle: "Snacks", ownLabel: false, products: 3 },
];

/** The 14 allergens UK food law requires us to declare */
export const UK_ALLERGENS = [
  "Celery",
  "Cereals containing gluten",
  "Crustaceans",
  "Eggs",
  "Fish",
  "Lupin",
  "Milk",
  "Molluscs",
  "Mustard",
  "Peanuts",
  "Sesame",
  "Soya",
  "Sulphites",
  "Tree nuts",
] as const;
export type Allergen = (typeof UK_ALLERGENS)[number];

export const PRESENCES = ["Contains", "May contain", "Free from"] as const;
export type Presence = (typeof PRESENCES)[number];

export interface AllergenRow {
  product: string;
  category: string;
  sku: string;
  allergen: Allergen;
  presence: Presence;
}

export const ALLERGENS: AllergenRow[] = [
  { product: "Fresh Whole Milk 1L", category: "Dairy", sku: "FRE-000004", allergen: "Milk", presence: "Contains" },
  { product: "Mature Cheddar Cheese", category: "Cheese", sku: "FRE-000009", allergen: "Milk", presence: "Contains" },
  { product: "Cheese Crackers", category: "Snacks", sku: "FRE-000011", allergen: "Cereals containing gluten", presence: "Contains" },
  { product: "Cheese Crackers", category: "Snacks", sku: "FRE-000011", allergen: "Milk", presence: "Contains" },
  { product: "Roasted Salted Peanuts", category: "Snacks", sku: "FRE-000013", allergen: "Peanuts", presence: "Contains" },
  { product: "Roasted Salted Peanuts", category: "Snacks", sku: "FRE-000013", allergen: "Tree nuts", presence: "May contain" },
  { product: "Multigrain Sandwich Bread", category: "Bakery", sku: "FRE-000017", allergen: "Cereals containing gluten", presence: "Contains" },
  { product: "Multigrain Sandwich Bread", category: "Bakery", sku: "FRE-000017", allergen: "Sesame", presence: "May contain" },
  { product: "Frozen Vegetable Samosas", category: "Frozen", sku: "FRE-000021", allergen: "Cereals containing gluten", presence: "Contains" },
  { product: "Frozen Vegetable Samosas", category: "Frozen", sku: "FRE-000021", allergen: "Mustard", presence: "May contain" },
  { product: "Classic Potato Chips", category: "Snacks", sku: "FRE-000012", allergen: "Cereals containing gluten", presence: "Free from" },
  { product: "Greek Yogurt", category: "Dairy", sku: "FRE-000006", allergen: "Milk", presence: "Contains" },
];

export interface TransactionRow {
  product: string;
  type: TransactionType;
  quantity: number;
  reason: AdjustmentReason | null;
  /** Order number for order-linked movements */
  reference: string | null;
  performedBy: "Admin" | "System";
  at: string;
}

export const TRANSACTIONS: TransactionRow[] = [
  { product: "Premium Bananas", type: "CONSUMED", quantity: 2, reason: null, reference: "ORD-2026-000027", performedBy: "System", at: "21 Oct 2026, 09:42" },
  { product: "Fresh Whole Milk 1L", type: "CONSUMED", quantity: 3, reason: null, reference: "ORD-2026-000027", performedBy: "System", at: "21 Oct 2026, 09:42" },
  { product: "Premium Bananas", type: "RECEIVED", quantity: 40, reason: null, reference: null, performedBy: "Admin", at: "21 Oct 2026, 09:10" },
  { product: "Organic Baby Spinach", type: "ADJUSTMENT_DECREASE", quantity: 4, reason: "DAMAGE", reference: null, performedBy: "Admin", at: "20 Oct 2026, 18:05" },
  { product: "Chicken Wings", type: "RELEASED", quantity: 1, reason: null, reference: "ORD-2026-000018", performedBy: "System", at: "20 Oct 2026, 17:31" },
  { product: "Mature Cheddar Cheese", type: "ADJUSTMENT_INCREASE", quantity: 12, reason: "RESTOCK", reference: null, performedBy: "Admin", at: "20 Oct 2026, 12:20" },
  { product: "Frozen French Fries", type: "CONSUMED", quantity: 2, reason: null, reference: "ORD-2026-000026", performedBy: "System", at: "20 Oct 2026, 11:02" },
  { product: "Royal Gala Apples", type: "RECEIVED", quantity: 60, reason: null, reference: null, performedBy: "Admin", at: "19 Oct 2026, 08:45" },
  { product: "Classic Beef Burgers", type: "ADJUSTMENT_DECREASE", quantity: 1, reason: "RECOUNT", reference: null, performedBy: "Admin", at: "19 Oct 2026, 08:30" },
  { product: "Whole Wheat Bread Loaf", type: "CONSUMED", quantity: 1, reason: null, reference: "ORD-2026-000022", performedBy: "System", at: "18 Oct 2026, 19:14" },
  { product: "Greek Yogurt", type: "RECEIVED", quantity: 24, reason: null, reference: null, performedBy: "Admin", at: "18 Oct 2026, 09:00" },
  { product: "Chicken Thigh Fillets", type: "RELEASED", quantity: 2, reason: null, reference: "ORD-2026-000017", performedBy: "System", at: "17 Oct 2026, 16:40" },
];

export interface BoardOrder {
  orderNumber: string;
  customer: string;
  deliveryType: DeliveryType;
  /** Display only — the API owns totals */
  total: string;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  placed: string;
  items: { product: string; quantity: number }[];
}

export const BOARD_ORDERS: BoardOrder[] = [
  {
    orderNumber: "ORD-2026-000029",
    customer: "Grace Lee",
    deliveryType: "DELIVERY",
    total: "9.20",
    paymentStatus: "UNPAID",
    status: "PENDING",
    placed: "2 min ago",
    items: [{ product: "Organic Baby Spinach", quantity: 2 }],
  },
  {
    orderNumber: "ORD-2026-000028",
    customer: "Daniel Okafor",
    deliveryType: "PICKUP",
    total: "14.85",
    paymentStatus: "UNPAID",
    status: "PENDING",
    placed: "6 min ago",
    items: [
      { product: "Lean Beef Mince", quantity: 1 },
      { product: "Fresh Bell Peppers", quantity: 3 },
    ],
  },
  {
    orderNumber: "ORD-2026-000027",
    customer: "Ayesha Khan",
    deliveryType: "DELIVERY",
    total: "18.40",
    paymentStatus: "PAID",
    status: "CONFIRMED",
    placed: "12 min ago",
    items: [
      { product: "Premium Bananas", quantity: 2 },
      { product: "Fresh Whole Milk 1L", quantity: 3 },
    ],
  },
  {
    orderNumber: "ORD-2026-000026",
    customer: "Tom Hughes",
    deliveryType: "PICKUP",
    total: "12.75",
    paymentStatus: "PAID",
    status: "PROCESSING",
    placed: "40 min ago",
    items: [
      { product: "Chicken Wings", quantity: 1 },
      { product: "Frozen French Fries", quantity: 2 },
    ],
  },
  {
    orderNumber: "ORD-2026-000025",
    customer: "Priya Shah",
    deliveryType: "DELIVERY",
    total: "31.10",
    paymentStatus: "PAID",
    status: "PROCESSING",
    placed: "55 min ago",
    items: [
      { product: "Premium Sirloin Steak", quantity: 2 },
      { product: "Crisp Romaine Lettuce", quantity: 1 },
      { product: "Classic Mozzarella Cheese", quantity: 1 },
    ],
  },
  {
    orderNumber: "ORD-2026-000024",
    customer: "Sam Patel",
    deliveryType: "DELIVERY",
    total: "22.60",
    paymentStatus: "PAID",
    status: "READY_FOR_DELIVERY",
    placed: "1 h ago",
    items: [
      { product: "Mature Cheddar Cheese", quantity: 1 },
      { product: "Multigrain Sandwich Bread", quantity: 1 },
      { product: "Royal Gala Apples", quantity: 2 },
    ],
  },
  {
    orderNumber: "ORD-2026-000023",
    customer: "Lucy Evans",
    deliveryType: "PICKUP",
    total: "8.35",
    paymentStatus: "PAID",
    status: "READY_FOR_PICKUP",
    placed: "2 h ago",
    items: [{ product: "Fresh Chicken Breast", quantity: 1 }],
  },
  {
    orderNumber: "ORD-2026-000022",
    customer: "Chloe Martin",
    deliveryType: "PICKUP",
    total: "7.50",
    paymentStatus: "PAID",
    status: "DELIVERED",
    placed: "Yesterday",
    items: [{ product: "Classic Beef Burgers", quantity: 1 }],
  },
  {
    orderNumber: "ORD-2026-000021",
    customer: "Ben Carter",
    deliveryType: "DELIVERY",
    total: "11.10",
    paymentStatus: "CANCELED",
    status: "CANCELLED",
    placed: "Yesterday",
    items: [{ product: "Whole Wheat Bread Loaf", quantity: 2 }],
  },
];

export const CAMPAIGN_STATUSES = ["Active", "Scheduled", "Expired"] as const;
export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number];

export interface AdminCoupon {
  code: string;
  discount: string;
  appliesTo: string;
  /** Display string — the UI never works out money */
  minimumSpend: string | null;
  used: number;
  limit: number;
  from: string;
  to: string;
  status: CampaignStatus;
}

export const COUPONS: AdminCoupon[] = [
  { code: "WELCOME10", discount: "10% off", appliesTo: "First order", minimumSpend: "20.00", used: 38, limit: 100, from: "01 Oct 2026", to: "31 Dec 2026", status: "Active" },
  { code: "FRESH5", discount: "£5 off", appliesTo: "Fresh produce", minimumSpend: "35.00", used: 12, limit: 200, from: "15 Oct 2026", to: "15 Nov 2026", status: "Active" },
  { code: "BAKERY15", discount: "15% off", appliesTo: "Bakery", minimumSpend: null, used: 0, limit: 150, from: "01 Nov 2026", to: "30 Nov 2026", status: "Scheduled" },
  { code: "BBQ20", discount: "20% off", appliesTo: "Meat & poultry", minimumSpend: "25.00", used: 64, limit: 64, from: "01 Aug 2026", to: "31 Aug 2026", status: "Expired" },
  { code: "SNACK3", discount: "£3 off", appliesTo: "Snacks", minimumSpend: "12.00", used: 41, limit: 100, from: "01 Sep 2026", to: "30 Sep 2026", status: "Expired" },
];

export interface AdminPromotion {
  title: string;
  blurb: string;
  image: string;
  placement: "Home hero" | "Home banner" | "Shop banner";
  from: string;
  to: string;
  status: CampaignStatus;
}

export const PROMOTIONS: AdminPromotion[] = [
  { title: "Weekend produce", blurb: "Crisp greens, sweet peppers and fruit for the week ahead.", image: "/images/editorial/produce-market.webp", placement: "Home hero", from: "17 Oct 2026", to: "26 Oct 2026", status: "Active" },
  { title: "The butcher's counter", blurb: "Chicken, beef and more — ready for the grill.", image: "/images/editorial/chicken-marble.webp", placement: "Home banner", from: "10 Oct 2026", to: "31 Oct 2026", status: "Active" },
  { title: "Bakery & treats", blurb: "Loaves, rolls and something sweet.", image: "/images/editorial/artisan-bread.webp", placement: "Shop banner", from: "01 Nov 2026", to: "15 Nov 2026", status: "Scheduled" },
  { title: "Celebration cakes", blurb: "Something special for the weekend.", image: "/images/editorial/celebration-cake.webp", placement: "Home banner", from: "20 Nov 2026", to: "30 Nov 2026", status: "Scheduled" },
  { title: "Dairy favourites", blurb: "Milk, cheddar and cream for everyday cooking.", image: "/images/editorial/cheese-board.webp", placement: "Shop banner", from: "01 Sep 2026", to: "30 Sep 2026", status: "Expired" },
  { title: "Fruit crate", blurb: "Seasonal fruit picked for colour and flavour.", image: "/images/editorial/fruit-crates.webp", placement: "Home hero", from: "01 Sep 2026", to: "14 Sep 2026", status: "Expired" },
];

export const REVIEW_STATUSES = ["Pending", "Published", "Hidden"] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

export interface AdminReview {
  id: string;
  product: string;
  category: string;
  customer: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  replied: boolean;
  date: string;
}

export const REVIEWS: AdminReview[] = [
  { id: "r1", product: "Royal Gala Apples", category: "Fruit", customer: "Ayesha K.", rating: 5, comment: "Crisp, sweet and not a single bruise. Will reorder.", status: "Pending", replied: false, date: "21 Oct 2026" },
  { id: "r2", product: "Frozen French Fries", category: "Frozen", customer: "Sam P.", rating: 2, comment: "Arrived partly thawed. Tasted fine once cooked, but please pack with more ice.", status: "Pending", replied: false, date: "20 Oct 2026" },
  { id: "r3", product: "Fresh Chicken Breast", category: "Poultry", customer: "Tom H.", rating: 4, comment: "Good size fillets, well within date. Packaging could use less plastic.", status: "Published", replied: true, date: "19 Oct 2026" },
  { id: "r4", product: "Whole Wheat Bread Loaf", category: "Bakery", customer: "Grace L.", rating: 5, comment: "Soft and fresh — lasted the whole week.", status: "Published", replied: false, date: "18 Oct 2026" },
  { id: "r5", product: "Mature Cheddar Cheese", category: "Cheese", customer: "Chloe M.", rating: 5, comment: "Proper sharp cheddar. Great on toast.", status: "Published", replied: true, date: "15 Oct 2026" },
  { id: "r6", product: "Classic Potato Chips", category: "Snacks", customer: "Ben C.", rating: 1, comment: "Bag was crushed — mostly crumbs.", status: "Hidden", replied: true, date: "12 Oct 2026" },
];

export type NotificationKind = "order" | "inventory" | "customer" | "system";

export interface AdminNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export const NOTIFICATIONS: AdminNotification[] = [
  { id: "n1", kind: "order", title: "New order paid", message: "ORD-2026-000027 · 2 items · £18.40 by card.", time: "12 min ago", read: false },
  { id: "n2", kind: "inventory", title: "Low stock: Organic Baby Spinach", message: "Only 6 left after today's adjustment. Consider restocking.", time: "45 min ago", read: false },
  { id: "n3", kind: "order", title: "Order ready for pickup", message: "ORD-2026-000023 is waiting at the counter.", time: "2 h ago", read: false },
  { id: "n4", kind: "customer", title: "New customer", message: "Daniel Okafor created an account.", time: "3 h ago", read: true },
  { id: "n5", kind: "order", title: "Order cancelled", message: "ORD-2026-000021 was cancelled — payment wasn't completed in time.", time: "Yesterday", read: true },
  { id: "n6", kind: "system", title: "Nightly backup complete", message: "The database backup finished without errors.", time: "Yesterday", read: true },
];
