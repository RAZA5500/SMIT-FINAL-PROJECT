# Phase 18 — Duplicate requests (live run)

Run date: 20 Oct 2026 against the running dev API with a throwaway script (test customer
`customer2@example.test`; admin from `student-api/.env` only to read stock and customer stats). "Two tabs" and
"double submit" are simulated with parallel requests (`Promise.all`). There is no idempotency key by decision —
the cart is cleared inside the order transaction (see README).

Browser side (phase 19 run): double-clicking "Pay" sent exactly one `POST /orders`; three quick "+" clicks on a
cart line sent one `PATCH /cart/items/:id` (350 ms debounce). `ProductCard.test.tsx` checks double click → one
`POST /cart/items`.

Order under test: ORD-2026-000004

| Scenario | Expected | Actual | Result |
|---|---|---|---|
| 2 parallel POST /orders (same cart) | one 201 + one 400 Cart is empty | 201, 400 "Cart is empty. Cannot create order." | PASS |
| Stock deducted once | 24 → 22 | 24 → 22 | PASS |
| Retry POST /orders after success | 400 Cart is empty | 400 "Cart is empty. Cannot create order." | PASS |
| 2 parallel POST /payments/initiate | both 200, same paymentId | 200, 200; 1 distinct paymentId | PASS |
| 2 parallel mock-complete (succeeded) | both 200; order CONFIRMED/PAID; totalOrders +1 | 200 PAID, 200 PAID; CONFIRMED/PAID; totalOrders 0 → 1 | PASS |
| 2 parallel customer cancels (paid order) | one succeeds, other rejected; refunded once; stock + stats restored | 200, 409; CANCELLED/REFUNDED; refunded payments 1; totalSpent 3.30 → 0.00; stock → 24 | PASS |

All duplicate-request checks passed.
