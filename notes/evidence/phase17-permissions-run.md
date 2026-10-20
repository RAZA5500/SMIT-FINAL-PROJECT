# Phase 17 — Permissions and ownership (live run)

Run date: 20 Oct 2026 against the running dev API (`http://localhost:4000/v1`) with a throwaway script:
customer A = `customer1@example.test`, customer B = `customer2@example.test` (both test accounts), admin from
`student-api/.env`. B attacks A's real resources by id; A's data is re-read afterwards to prove nothing changed.
Same rules are covered by the e2e suites (ownership tests in `addresses`, `cart`, `orders`, `auth` specs).
Frontend part: a customer opening `/admin/categories` is redirected to `/shop` (browser, phase 19 run).

Customer A order ORD-2026-000003, address d1a45c1e…, cart item 9a127a26…

| Check | Expected | Actual | Result |
|---|---|---|---|
| B reads A's order | 404 | 404 | PASS |
| B cancels A's order | 404 | 404 | PASS |
| B starts payment for A's order | 404 | 404 | PASS |
| B edits A's address | 404 | 404 | PASS |
| B sets A's address as default | 404 | 404 | PASS |
| B deletes A's address | 404 | 404 | PASS |
| B updates A's cart item | 404 | 404 | PASS |
| B deletes A's cart item | 404 | 404 | PASS |
| Customer → GET /admin/products | 403 | 403 | PASS |
| Customer → GET /admin/orders | 403 | 403 | PASS |
| Customer → PATCH /admin/orders/:id/status | 403 | 403 | PASS |
| Customer → GET /admin/customers | 403 | 403 | PASS |
| Admin → GET /cart | 403 | 403 | PASS |
| Admin → POST /orders | 403 | 403 | PASS |
| No token → GET /orders/me | 401 | 401 | PASS |
| No token → GET /admin/customers | 401 | 401 | PASS |
| Garbage token → GET /auth/me | 401 | 401 | PASS |

A's order still PENDING; A's cart item quantity still 1

All permission checks passed.
