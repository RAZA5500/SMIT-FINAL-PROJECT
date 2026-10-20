/* Reference data for the admin screens, mirroring the production store. */

export interface Brand {
  name: string;
  logo: string;
  ownLabel: boolean;
}

export const BRANDS: Brand[] = [
  { name: "lu", logo: "/media/brands/03e92761-4b85-469c-874a-50a7230bf12c/c5373402.jpg", ownLabel: false },
  { name: "nestle", logo: "/media/brands/2eeffd3d-9b4e-4631-88d7-3b95086bd6ff/3f4d2da9.jpg", ownLabel: false },
];

export type Presence = "Contains" | "May Contain" | "Free From";

export interface AllergenRow {
  product: string;
  sku: string;
  allergen: string;
  presence: Presence;
}

export const ALLERGENS: AllergenRow[] = [
  { product: "Milk Pack", sku: "FRE-000033", allergen: "Milk", presence: "Contains" },
  { product: "Milk Pack", sku: "FRE-000033", allergen: "Lupin", presence: "May Contain" },
  { product: "Milk Pack", sku: "FRE-000033", allergen: "Molluscs", presence: "May Contain" },
  { product: "Milk Pack", sku: "FRE-000033", allergen: "Gluten", presence: "Free From" },
];

export type TransactionType = "RELEASED" | "CONSUMED" | "RESERVED" | "RECEIVED";

export interface TransactionRow {
  product: string;
  type: TransactionType;
  quantity: number;
}

/* Production shows 202 movements; the same alternating pattern is reproduced. */
const TX_SEED: [string, TransactionType][] = [
  ["Chicken Wings", "RELEASED"],
  ["Chicken Thigh Fillets", "RELEASED"],
  ["Chicken Wings", "CONSUMED"],
  ["Chicken Thigh Fillets", "CONSUMED"],
  ["Chicken Wings", "RELEASED"],
  ["Low Fat Fresh Milk", "RELEASED"],
  ["Chicken Thigh Fillets", "RELEASED"],
  ["Chicken Wings", "CONSUMED"],
  ["Low Fat Fresh Milk", "CONSUMED"],
  ["Chicken Thigh Fillets", "CONSUMED"],
];

export const TRANSACTIONS: TransactionRow[] = Array.from({ length: 202 }, (_, i) => {
  const [product, type] = TX_SEED[i % TX_SEED.length];
  return { product, type, quantity: 1 };
});


export interface OrderRow {
  reference: string;
  customer: string;
  deliveryType: "Pickup" | "Delivery";
  total: number;
  paymentStatus: "Paid" | "Unpaid" | "Refunded";
  orderStatus: "Cancelled" | "Delivered" | "Pending" | "Processing";
  placedAt: string;
}

export const ORDERS: OrderRow[] = [
  { reference: "ORD-2026-000057", customer: "MR123", deliveryType: "Pickup", total: 11, paymentStatus: "Unpaid", orderStatus: "Cancelled", placedAt: "17/09/2026 7:32 pm" },
  { reference: "ORD-2026-000056", customer: "munimdalmiatest1", deliveryType: "Pickup", total: 13, paymentStatus: "Unpaid", orderStatus: "Cancelled", placedAt: "16/09/2026 4:06 pm" },
  { reference: "ORD-2026-000055", customer: "munimdalmiatest1", deliveryType: "Pickup", total: 13, paymentStatus: "Unpaid", orderStatus: "Cancelled", placedAt: "16/09/2026 3:08 pm" },
  { reference: "ORD-2026-000054", customer: "MR123", deliveryType: "Pickup", total: 24, paymentStatus: "Unpaid", orderStatus: "Cancelled", placedAt: "15/09/2026 3:24 pm" },
  { reference: "ORD-2026-000053", customer: "MR123", deliveryType: "Pickup", total: 2, paymentStatus: "Unpaid", orderStatus: "Cancelled", placedAt: "15/09/2026 3:23 pm" },
  { reference: "ORD-2026-000052", customer: "MR123", deliveryType: "Pickup", total: 2, paymentStatus: "Unpaid", orderStatus: "Cancelled", placedAt: "15/09/2026 2:59 pm" },
  { reference: "ORD-2026-000051", customer: "MR123", deliveryType: "Pickup", total: 4, paymentStatus: "Unpaid", orderStatus: "Cancelled", placedAt: "15/09/2026 2:56 pm" },
  { reference: "ORD-2026-000050", customer: "MR123", deliveryType: "Pickup", total: 31, paymentStatus: "Unpaid", orderStatus: "Cancelled", placedAt: "15/09/2026 2:51 pm" },
  { reference: "ORD-2026-000049", customer: "MR123", deliveryType: "Pickup", total: 25, paymentStatus: "Unpaid", orderStatus: "Cancelled", placedAt: "15/09/2026 2:50 pm" },
  { reference: "ORD-2026-000048", customer: "MR123", deliveryType: "Pickup", total: 31, paymentStatus: "Unpaid", orderStatus: "Cancelled", placedAt: "15/09/2026 2:48 pm" },
  { reference: "ORD-2026-000047", customer: "MR123", deliveryType: "Pickup", total: 18, paymentStatus: "Unpaid", orderStatus: "Cancelled", placedAt: "15/09/2026 2:44 pm" },
  { reference: "ORD-2026-000046", customer: "MR123", deliveryType: "Pickup", total: 9, paymentStatus: "Unpaid", orderStatus: "Cancelled", placedAt: "15/09/2026 2:41 pm" },
  { reference: "ORD-2026-000045", customer: "MR123", deliveryType: "Pickup", total: 12, paymentStatus: "Unpaid", orderStatus: "Cancelled", placedAt: "15/09/2026 2:38 pm" },
  { reference: "ORD-2026-000044", customer: "MR123", deliveryType: "Pickup", total: 7, paymentStatus: "Unpaid", orderStatus: "Cancelled", placedAt: "15/09/2026 2:30 pm" },
];

export type TestimonialSource = "ADMIN PANEL" | "TRUSTPILOT" | "GOOGLE";

export interface AdminTestimonial {
  customer: string;
  rating: number;
  text: string;
  source: TestimonialSource;
  status: "Approved" | "Pending" | "Rejected";
  published: boolean;
  date: string;
  photo?: string;
}

const T_CDN = "/media/testimonials";

export const ADMIN_TESTIMONIALS: AdminTestimonial[] = [
  { customer: "Harry Johnson", rating: 3, text: "The products were good and the website was easy to use. Delivery was a little later than expected.", source: "ADMIN PANEL", status: "Approved", published: true, date: "01 Sept 2026", photo: `${T_CDN}/003e858b-d109-4d0b-9f4c-8b7e78c88d30/defaf71d.jpg` },
  { customer: "Charlotte Davies", rating: 5, text: "Absolutely brilliant. The bakery items were fresh and delicious. I'll definitely order again.", source: "ADMIN PANEL", status: "Approved", published: true, date: "01 Sept 2026", photo: `${T_CDN}/a28c1561-c2a4-438f-84ad-56218f216311/7d71b9b0.jpg` },
  { customer: "Jack Harrison", rating: 4, text: "Very convenient service with plenty of choice. The order arrived well chilled and nicely packed.", source: "TRUSTPILOT", status: "Approved", published: true, date: "01 Sept 2026", photo: `${T_CDN}/e182b0cf-e490-4719-a2cd-71239e879fa5/9f94ce79.jpg` },
  { customer: "Sophie Williams", rating: 5, text: "Everything was packed carefully and arrived in perfect condition. Really happy with the quality.", source: "ADMIN PANEL", status: "Approved", published: true, date: "01 Sept 2026", photo: `${T_CDN}/b60b9b8e-d394-4ef5-b2f4-9dd78d69a83c/238cb969.jpg` },
  { customer: "Oliver Bennett", rating: 5, text: "Good range of products and a very easy ordering process. Delivery was quick too.", source: "ADMIN PANEL", status: "Approved", published: true, date: "01 Sept 2026", photo: `${T_CDN}/7fa65b76-d2f0-4b21-9757-280c95524fdd/c4a53e11.jpg` },
  { customer: "Emily Thompson", rating: 5, text: "Great service and excellent quality. The fresh produce was lovely and lasted really well.", source: "ADMIN PANEL", status: "Approved", published: true, date: "01 Sept 2026", photo: `${T_CDN}/874ccd59-bb76-445d-8cba-ed4be4d9d128/d2a67740.jpg` },
  { customer: "James Wilson", rating: 5, text: "Really pleased with my order. Everything arrived fresh, well packaged and right on time.", source: "ADMIN PANEL", status: "Approved", published: true, date: "01 Sept 2026", photo: `${T_CDN}/5366abd5-8880-4d4d-bd00-ae3872993c9a/7aa2b011.jpg` },
  { customer: "test 1", rating: 1, text: "test 1test 1test 1test 1test 1test 1test 1test 1test 1test 1", source: "ADMIN PANEL", status: "Approved", published: true, date: "01 Sept 2026" },
];

export interface OrderLine {
  product: string;
  qty: number;
}

/** Line items and relative age, as shown on the order board. */
export const ORDER_DETAILS: Record<string, { ago: string; email: string; lines: OrderLine[] }> = {
  "ORD-2026-000057": { ago: "2 days ago", email: "mutahirkareem820@gmail.com", lines: [{ product: "Chicken Thigh Fillets", qty: 1 }, { product: "Chicken Wings", qty: 1 }] },
  "ORD-2026-000056": { ago: "3 days ago", email: "munimdalmiatest2@gmail.com", lines: [{ product: "Chicken Thigh Fillets", qty: 1 }, { product: "Low Fat Fresh Milk", qty: 1 }, { product: "Chicken Wings", qty: 1 }] },
  "ORD-2026-000055": { ago: "3 days ago", email: "munimdalmiatest2@gmail.com", lines: [{ product: "Premium Bananas", qty: 1 }, { product: "Pure Dairy Cream", qty: 1 }, { product: "Classic Potato Chips", qty: 1 }] },
  "ORD-2026-000054": { ago: "4 days ago", email: "mutahirkareem820@gmail.com", lines: [{ product: "Chicken Thigh Fillets", qty: 1 }, { product: "Frozen French Fries", qty: 1 }] },
  "ORD-2026-000053": { ago: "4 days ago", email: "mutahirkareem820@gmail.com", lines: [{ product: "Low Fat Fresh Milk", qty: 1 }] },
  "ORD-2026-000052": { ago: "4 days ago", email: "mutahirkareem820@gmail.com", lines: [{ product: "Low Fat Fresh Milk", qty: 1 }] },
  "ORD-2026-000051": { ago: "4 days ago", email: "mutahirkareem820@gmail.com", lines: [{ product: "Chicken Thigh Fillets", qty: 1 }] },
  "ORD-2026-000050": { ago: "4 days ago", email: "mutahirkareem820@gmail.com", lines: [{ product: "Chicken Thigh Fillets", qty: 1 }, { product: "Chicken Wings", qty: 1 }, { product: "Frozen French Fries", qty: 1 }] },
  "ORD-2026-000049": { ago: "4 days ago", email: "mutahirkareem820@gmail.com", lines: [{ product: "Frozen French Fries", qty: 1 }, { product: "Classic Potato Chips", qty: 1 }] },
  "ORD-2026-000048": { ago: "4 days ago", email: "mutahirkareem820@gmail.com", lines: [{ product: "Chicken Thigh Fillets", qty: 1 }, { product: "Chicken Wings", qty: 1 }, { product: "Frozen French Fries", qty: 1 }] },
  "ORD-2026-000047": { ago: "4 days ago", email: "mutahirkareem820@gmail.com", lines: [{ product: "Chicken Thigh Fillets", qty: 1 }, { product: "Low Fat Fresh Milk", qty: 1 }] },
  "ORD-2026-000046": { ago: "4 days ago", email: "mutahirkareem820@gmail.com", lines: [{ product: "Low Fat Fresh Milk", qty: 1 }] },
  "ORD-2026-000045": { ago: "4 days ago", email: "mutahirkareem820@gmail.com", lines: [{ product: "Chicken Wings", qty: 1 }] },
  "ORD-2026-000044": { ago: "4 days ago", email: "mutahirkareem820@gmail.com", lines: [{ product: "Chicken Wings", qty: 1 }] },
};

export const ORDER_BOARD_TABS = [
  { label: "All", count: 57 },
  { label: "Pending", count: 0 },
  { label: "Confirmed", count: null },
  { label: "Processing", count: 0 },
  { label: "Ready for Pickup", count: null },
  { label: "Ready for Delivery", count: null },
  { label: "Delivered", count: 0 },
  { label: "Cancelled", count: 57 },
  { label: "Returned", count: null },
  { label: "Refund Pending", count: 0 },
] as const;
