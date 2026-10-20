/** bcrypt cost — FLOW-MD 06 §4 */
export const BCRYPT_COST = 12;

/** Login/register: 10 requests per minute per IP — FLOW-MD 06 §4 */
export const AUTH_THROTTLER = { name: 'auth', ttl: 60_000, limit: 10 };

/** Shipping abhi hamesha 0 — FLOW-MD 01 §2.6 (Q9) */
export const ORDER_SHIPPING_COST = 0;

/** PENDING order itne minute mein pay na ho to auto-cancel — FLOW-MD 01 §17 */
export const ORDER_PAYMENT_TIMEOUT_MINUTES = 5;
