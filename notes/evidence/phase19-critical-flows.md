# Phase 19 — Critical E2E workflows (FLOW-MD 12 §5)

Run date: 20 Oct 2026 (local dev). Method: **manual browser script with recorded results** (Phase 19 allows
"Playwright ya manual script with recorded results"), driven in Chrome against:

- `student-web` — `next dev` on http://localhost:3000
- `student-api` — `nest start --watch` on http://localhost:4000/v1, PostgreSQL from `docker-compose.yml`
- Demo catalog created through the admin API (4 categories, 8 products incl. low-stock, out-of-stock,
  no-inventory and inactive cases).

Test accounts: customer `customer1@example.test` (registered through the UI during flow 1) and the
seeded admin from `student-api/.env`. Flows 2–3 ran in the same browser session after flow 1.

The same flows are also covered automatically by `student-api/test/critical-flows.e2e-spec.ts`
(see `api-e2e-tests.txt`).

## Flow 1 — Register → login → cart → checkout (DELIVERY) → mock pay success → CONFIRMED in history

| Step | Result |
|---|---|
| Guest clicks "Add to Cart" on `/shop` | Redirected to `/login?redirect=%2Fshop` ✅ |
| Register `/register` (name, email, password, confirm, terms) | Toast "Account created", redirected to `/login` ✅ |
| Login | Toast "Welcome back!", lands on `/shop`, cart panel shows the server cart ✅ |
| Add Greek Yogurt ×2 (min qty 2) and Whole Milk ×3 | Cart panel: £4.20 + £4.95, subtotal £9.15 (server totals) ✅ |
| Click "+" on Whole Milk three times quickly | **One** `PATCH /cart/items/:id` (350 ms debounce), qty capped at product max 6 ✅ |
| `/checkout` → submit empty | Zod errors on address fields; PICKUP without time → "Choose a pickup time" ✅ |
| DELIVERY with inline address → "Continue to payment" | `/checkout/payment` shows the address from the saved intent ✅ |
| "Pay £14.10" (Approve) | `POST /orders` 201 → `POST /payments/initiate` 200 → `POST /payments/:id/mock-complete` 200 ✅ |
| Redirect | `/orders/<id>` — **ORD-2026-000001 Confirmed / Paid**, cart emptied ✅ |
| `/orders` | ORD-2026-000001 listed as Confirmed / Paid ✅ |

## Flow 2 — Admin → PROCESSING → READY_FOR_DELIVERY → DELIVERED

| Step | Result |
|---|---|
| Customer opens `/admin/categories` | Redirected to `/shop` (AuthGuard, role from `/auth/me`) ✅ |
| Admin `/admin/orders` | Both orders listed with customer, totals, payment + order status ✅ |
| ORD-2026-000001 → "Mark as Processing" | Toast, status Processing; only "Mark as Ready for Delivery" offered (DELIVERY order) ✅ |
| "Mark as Ready for Delivery" → "Mark as Delivered" | Status Delivered, timeline timestamps filled, no further actions / no cancel ✅ |

## Flow 3 — Customer cancels CONFIRMED (paid) order → refund → CANCELLED, stock restored

| Step | Result |
|---|---|
| Bananas (stock 3) — try to add 4 | Toast "Only 3 units available" ✅ |
| Add 2, checkout PICKUP, choose **Decline** and double-click "Pay" | Exactly **one** `POST /orders` 201; ORD-2026-000002 Pending / Failed, "Pay now" offered ✅ |
| "Pay now" → Approve | Toast "Payment successful", Confirmed / Paid, payments list shows Failed + Paid attempts ✅ |
| "Cancel order" → reason Other without note | "Please tell us the reason" (OTHER needs a note) ✅ |
| Add note, tick "I understand", confirm | Order **Cancelled**, payment **Refunded** ✅ |
| Admin → Inventory → Bananas → Stock history | Received +3, Consumed −2 (ORD-2026-000002), **Released +2** (cancel) — stock back to 3 ✅ |
| Admin → Users | Customer totalOrders 1, totalSpent £14.10 (refunded order reversed) ✅ |

## Flow 4 — Unpaid order → payment-timeout cron → CANCELLED, stock restored

Order placed through the API as the test customer (DELIVERY, saved default address) and left unpaid;
result checked in the admin UI after the payment window (5 min) and the every-minute cron.

| Time (UTC) | Observation |
|---|---|
| 18:45:08 | Baby Spinach `qtyOnHand=25` before the order |
| 18:45:08 | **ORD-2026-000003** created — PENDING / UNPAID, `paymentExpiresAt=18:50:08Z`; stock 25 → **23** (CONSUMED) |
| 18:51 | Admin → Orders: ORD-2026-000003 **Cancelled** / Unpaid; detail shows "Cancelled: Payment timed out" (`PAYMENT_TIMEOUT`), timeline Cancelled 23:51 local |
| 18:51 | Admin → Inventory: Baby Spinach back to **25** (RELEASED), last updated 23:51 local ✅ |

## Result

All four critical workflows passed in the browser. `critical-flows.e2e-spec.ts` (4 tests) also passes —
see `api-e2e-tests.txt`.

Notes from the run:
- In `next dev`, React Strict Mode mounts pages twice, so the first `GET /orders/me/:id` is cancelled by
  TanStack Query (`responseStatus 0`, ~9 ms) and immediately re-sent (200). Dev-only; not an API error.
- Bugs found and fixed during this run: shadcn `dark:` styles were following the OS theme (missing
  `@custom-variant dark`), the admin order header card was squashed by the flex layout, and footer
  "Order History"/"Addresses" links pointed to `/`.
