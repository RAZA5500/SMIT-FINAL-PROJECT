# Acceptance checklist — evidence (FLOW-MD 14)

Status as of 20 Oct 2026. Evidence files live in [`notes/evidence/`](evidence). e2e test names refer to
`student-api/test/*.e2e-spec.ts` (run: [`api-e2e-tests.txt`](evidence/api-e2e-tests.txt), 95/95 passing); unit
tests to `student-api/src/**/*.spec.ts` ([`api-unit-tests.txt`](evidence/api-unit-tests.txt), 185/185).

## A. Business rules

| Item | Status | Evidence |
|---|---|---|
| Register always CUSTOMER; `role` in body → 400 | ✅ | auth e2e: "creates a CUSTOMER…", "rejects a role field in the body (mass assignment) with 400" |
| Exactly one ADMIN; second admin rejected by the DB | ✅ | auth e2e: "a second ADMIN cannot be inserted" (partial unique index `users_single_admin`) |
| Deactivated customer's old token → 403 | ✅ | auth e2e: "deactivated customer: old token → 403 and login → 403"; admin deactivate/activate checked in the browser (phase 19 run) |
| Category max 2 levels; product only in a leaf + active category | ✅ | catalog e2e: "max 2 levels: a third level → 400", "…non-leaf category → 400"; product form only offers leaf categories |
| Product name unique per category; max ≥ min order qty | ✅ | catalog e2e: "max < min → 400; … same name same category → 409"; Zod cross-field rule shown in the product form |
| Public catalog only active products (server-side) | ✅ | catalog e2e: "public catalog hides inactive products (list + detail 404)"; inactive "Seasonal Plums" not shown in `/shop` |
| DAMAGE / RETURN_TO_SUPPLIER only negative; stock never negative | ✅ | catalog e2e: "DAMAGE +5 → 400; stock never negative (10 − 11 → 400)"; DB `CHECK (qtyOnHand >= 0)`; browser: "+2 Damage" blocked |
| Stock status IN/LOW/OUT follows the threshold | ✅ | catalog e2e: "adjustment updates stock, status and the ledger"; `stock-status.spec.ts` |
| Cart: min on first add, max = min(stock, maxQty), out of stock 400, admin cart 403 | ✅ | cart e2e (stock 5 / max 10 → 6 → 400 "Only 5 units available", min, out of stock, admin 403); browser: "Only 3 units available" |
| Order: DELIVERY → address (saved or inline, not both); PICKUP → time; server price; order number from sequence | ✅ | orders e2e: PICKUP/DELIVERY tests, "client cannot send a price or total"; numbers `ORD-2026-000001…` |
| Order create in one transaction: stock deduct, CONSUMED ledger, cart clear | ✅ | orders e2e: "creates PENDING/UNPAID with server prices; stock deducted, CONSUMED ledger, cart cleared" |
| Payment timeout → PENDING order auto-cancelled, stock restored | ✅ | payments e2e: payment timeout cron tests; critical flow 4 (e2e + live run, [`phase19-critical-flows.md`](evidence/phase19-critical-flows.md)) |
| Status transitions only per allowed map; delivery-type mismatch 400 | ✅ | orders e2e: "rejects invalid transitions with 400"; admin UI only offers the valid next status |
| Customer cancel only PENDING/CONFIRMED; OTHER needs a note | ✅ | orders e2e: "PROCESSING → 400", "OTHER needs a note"; Zod rule in the cancel dialog |
| Paid cancel → REFUND_PENDING → refund → CANCELLED/REFUNDED; `totalSpent` restored | ✅ | payments e2e refunds tests; phase 18 run (refunded once, totalSpent restored) |
| Late payment on cancelled order → auto-refund | ✅ | payments e2e: "a late payment on an already cancelled order is refunded automatically" |

## B. Backend architecture

| Item | Status | Evidence |
|---|---|---|
| DTO / Controller / Service / Db service / Types / Mappers per module | ✅ | `student-api/src/modules/*/{dto,types,mappers}` + `*.controller.ts`, `*.service.ts`, `*.db.service.ts` |
| No business logic or Prisma in controllers | ✅ | controllers only map HTTP → service calls |
| One `DatabaseService`, no other PrismaClient | ✅ | `src/database/database.service.ts` is the only client in the app (the standalone `prisma/seed.ts` script opens its own short-lived client) |
| Payment gateway behind an interface | ✅ | `src/infrastructure/payment/payment-gateway.ts` (`PAYMENT_GATEWAY` token, mock implementation) |
| Orders/payments split into focused services | ✅ | order creation, cancellation, status, query; payments, webhook, refund; payment-timeout and refund-retry crons |

## C. REST API

| Item | Status | Evidence |
|---|---|---|
| Resource URLs, correct methods and status codes | ✅ | e2e suites assert status codes (201 create, 204 delete, 400/401/403/404/409) |
| All lists paginated with `data` + `meta` | ✅ | `common/pagination`; e2e "admin list: paginated…" |
| Consistent error JSON; no stack in 500 | ✅ | `AllExceptionsFilter` → `{ statusCode, message, error }`; validation e2e |
| Matches `api-reference.md` | ✅ | Swagger at `/v1/docs` lists the Part 2 endpoints + `GET /admin/products/:id` (documented deviation) |

## D. Security

| Item | Status | Evidence |
|---|---|---|
| bcrypt, generic login error, login rate limit | ✅ | auth e2e: "same 401 for an unknown email and a wrong password", "allows 10 login attempts per minute per IP, then 429" (also hit live during phase 18) |
| Global auth guard; `/admin/*` only ADMIN | ✅ | auth e2e guard/roles tests; [`phase17-permissions-run.md`](evidence/phase17-permissions-run.md) |
| IDOR: another user's order/address/cart item → 404 | ✅ | addresses/cart/orders e2e ownership tests; phase 17 run (8/8 → 404) |
| `passwordHash` in no response | ✅ | auth e2e: "never returns the hash", "/auth/me … without passwordHash" |
| Webhook signature verified; invalid → 400 | ✅ | payments e2e: "invalid signature → 400 and nothing changes" |
| `.env` not committed; `.env.example` placeholders | ✅ | `.gitignore`; `git ls-files` only lists `student-api/.env.example` and `student-web/.env.example` |

## E. Reliability, duplicates, concurrency

| Item | Status | Evidence |
|---|---|---|
| Cart empty after order; immediate second order → 400 `Cart is empty` | ✅ | orders e2e; [`phase18-duplicates-run.md`](evidence/phase18-duplicates-run.md) |
| 2 customers, 1 unit, parallel → 1 order | ✅ | orders e2e: "does not oversell the last unit (2 customers, 1 unit, parallel)" |
| Duplicate webhook → stats only once | ✅ | payments e2e: "the same webhook event delivered twice is processed once"; phase 18 parallel mock-complete |
| Transaction rollback (stock unchanged when one item fails) | ✅ | orders e2e: "rolls back everything when one item is short on stock" |

## F. Frontend

| Item | Status | Evidence |
|---|---|---|
| Folder structure per 07; pages compose | ✅ | `page.tsx` files render a view from their `(components)/` folder; `services/<domain>`, `modules/zod`, `components/{ui,shared,admin,customer}` |
| All forms Zod + RHF; cross-field rules | ✅ | 11 in-scope forms use `zodResolver` (register confirm, checkout DELIVERY/PICKUP, product max ≥ min, adjustment sign, cancel OTHER note); schema tests in `schemas.test.ts` |
| `services/<domain>` hooks; no direct `fetch` | ✅ | only `lib/networking/request.ts` calls `fetch` |
| Loading (skeleton) / error / empty / success on every list | ✅ | every list/detail view; `FreshDealsSection.test.tsx` (MSW 500 → ErrorState, empty → EmptyState); API stopped → no blank pages ([`phase16-ui-states.md`](evidence/phase16-ui-states.md)) |
| Submit buttons disabled while pending; checkout key stable in `useRef` | ✅ / deviation | `LoadingButton` everywhere; `ProductCard.test.tsx` double click → 1 request; browser double-click on Pay → 1 `POST /orders`. No idempotency key by decision (see README) — a `useRef` guard + cart clear protect checkout |
| Correct query invalidation after mutations | ✅ | invalidation per 08 §9 in `services/*/mutations.ts`; `ProductCard.test.tsx` add → `["cart"]` refetch |
| AuthGuard: customer can't see admin pages; 401 → logout | ✅ | `AuthGuard.test.tsx`, `request.test.ts`; browser: customer → `/admin/categories` → `/shop` |
| shadcn/ui primitives + shared components; no duplicate UI patterns | ✅ | `components/ui` (Base UI shadcn) + `components/shared` (Pagination, ConfirmDialog, StatusBadge, …) |
| Tailwind: no arbitrary spacing | ✅ | `grep` for `p-[…]`, `m-[…]`, `gap-[…]` etc. in `student-web/src` → none |

## G. Code quality

| Item | Status | Evidence |
|---|---|---|
| No source file over 1000 lines | ✅ | largest: `admin/dashboard/page.tsx` 466, `AdminSidebar.tsx` 451, `orders.e2e-spec.ts` 408 |
| `lint` and `typecheck` clean | ✅ | [`api-lint-typecheck-build.txt`](evidence/api-lint-typecheck-build.txt), [`web-tests-lint-typecheck.txt`](evidence/web-tests-lint-typecheck.txt) |

## H. Tests and build

| Item | Status | Evidence |
|---|---|---|
| `student-api`: `bun run test` | ✅ | [`api-unit-tests.txt`](evidence/api-unit-tests.txt) — 18 suites, 185 tests |
| `student-api`: `bun run test:e2e` (real Postgres) | ✅ | [`api-e2e-tests.txt`](evidence/api-e2e-tests.txt) — 8 suites, 95 tests |
| `student-api`: `bun run build` | ✅ | [`api-lint-typecheck-build.txt`](evidence/api-lint-typecheck-build.txt) |
| `student-web`: `bun run build` | ✅ | [`web-build.txt`](evidence/web-build.txt) |
| `student-web`: `bun run test` | ✅ | [`web-tests-lint-typecheck.txt`](evidence/web-tests-lint-typecheck.txt) — 9 files, 46 tests |
| 4 critical E2E flows | ✅ | [`phase19-critical-flows.md`](evidence/phase19-critical-flows.md) + `critical-flows.e2e-spec.ts` |

## I. Documentation

| Item | Status | Evidence |
|---|---|---|
| README: setup (docker, env, migrate, seed, run), where admin credentials come from | ✅ | [`README.md`](../README.md) |
| Deviations from the original documented | ✅ | README "Deviations from the documents" |
| Open questions (01 §23) — instructor's answer recorded | ⏳ pending | [`requirements.md`](requirements.md) table; answers must come from the instructor |
