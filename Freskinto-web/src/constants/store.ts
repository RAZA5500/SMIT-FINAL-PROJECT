/** Storefront ki asli baatein ek jagah — copy, footer, receipts sab isi se */
export const STORE = {
  name: "Freskinto",
  tagline: "The neighbourhood market, delivered.",
  supportEmail: "hello@freskinto.co.uk",
  currency: "GBP",
  /** Backend `ORDER_PAYMENT_TIMEOUT_MINUTES` (FLOW-MD 01 §17) */
  paymentWindowMinutes: 5,
  /** Click & collect slots: khulne/band hone ke ghante, kitne din aage, aur pack karne ka waqt */
  pickup: { openHour: 9, closeHour: 20, daysAhead: 6, leadHours: 1 },
} as const;
