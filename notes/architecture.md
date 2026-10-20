# OnlineMart — Architecture (Phase 2)

> Source: `FLOW-MD/02-system-architecture.md`, `04`, `06`, `01 §14–20`.

## 1. Context diagram

```mermaid
flowchart LR
  B[Browser] -->|pages| SW[student-web: Next.js 16]
  B -->|Bearer JWT, JSON — NEXT_PUBLIC_BASE_URL| SA[student-api: NestJS 11]
  SA -->|Prisma 7 + adapter-pg| PG[(PostgreSQL — docker-compose)]
  SA --> MG[MockPaymentGateway — infrastructure/payment]
  MG -.signed webhook event x-signature.-> SA
  SA --> CR[Cron jobs: payment timeout, refund retry]
```

- Frontend aur backend alag apps hain. Browser seedha backend ko call karta hai (Next.js proxy nahi karta).
- Authentication poori tarah backend ka kaam: bcrypt hash/verify + JWT issue/verify. Frontend sirf token store karke `Authorization: Bearer` bhejta hai.
- Koi Redis/queue nahi — background kaam `@nestjs/schedule` cron se.

## 2. Backend modules (`student-api/src`)

| Module / folder | Zimmedari |
|---|---|
| `config/` | Env validation (boot par fail-fast) |
| `database/` | Ek `DatabaseService` (PrismaClient + adapter-pg), lifecycle hooks |
| `common/` | `@Public`, `@Roles`, `@CurrentUser`, `JwtAuthGuard` (global), `RolesGuard` (global), exception filter, pagination |
| `shared/money/` | `MoneyService` — Decimal/pence arithmetic, `"12.50"` strings |
| `infrastructure/payment/` | `PaymentGateway` interface + `MockPaymentGateway` (`createIntent`, `refund`, `signEvent`, `verifyEvent`) |
| `modules/health` | `GET /health` |
| `modules/auth` | Register, login, me, password hashing, JWT |
| `modules/users` | Admin customer list + status, admin seed support |
| `modules/addresses` | Address book (ownership, single default) |
| `modules/categories` | Category tree (2 levels, leaf rule) |
| `modules/products` | Admin CRUD + public catalog (active only) |
| `modules/inventory` | Stock, adjustments (row lock), ledger, stock status |
| `modules/cart` | Customer cart (limits checked in transaction) |
| `modules/orders` | `OrderCreationService`, `OrderCancellationService`, `OrderStatusService`, `OrderQueryService`, payment-timeout cron |
| `modules/payments` | `PaymentsService`, `PaymentWebhookService`, `RefundService`, refund-retry cron |

### Layers (har module)

```mermaid
flowchart TB
  DTO[DTO — class-validator] --> CTRL[Controller — thin]
  CTRL --> SVC[Service — business rules]
  SVC --> DBS[Db service — saari Prisma queries, transactions, locks]
  DBS --> DB[(DatabaseService)]
  SVC --> MAP[Mapper — DB record → API response]
  SVC --> INFRA[Infrastructure — payment gateway]
```

Rules: controller mein business logic / Prisma nahi; Prisma sirf `*.db.service.ts` mein; response hamesha mapper se (`passwordHash` kabhi bahar nahi); side effects commit ke baad.

### Sync vs async

| Kaam | Kaise |
|---|---|
| Register, login, CRUD, cart, order create, status change, cancel | Sync HTTP request + DB transaction |
| Mock payment confirm/fail | `mock-complete` → gateway signed event → webhook handler (wahi code jo `POST /webhooks/payments/mock` chalata hai) |
| Refund | Cancel commit ke baad `RefundService`; fail ho to refund-retry cron (har 5 min) |
| Payment timeout | Cron har minute — `PENDING` + `paymentExpiresAt < now` |

## 3. Frontend (`student-web/src`)

| Folder | Kaam |
|---|---|
| `app/` | Routes — `page.tsx` sirf compose karta hai, `(components)/` mein page ke components |
| `components/ui` | shadcn primitives |
| `components/shared` | `InputField`, `Pagination`, `EmptyState`, `ErrorState`, `StatusBadge`, `AuthGuard`, ... |
| `components/admin`, `components/customer` | Scope-specific components |
| `services/<domain>/` | `index.ts` (API calls), `types.ts`, `queries.ts`, `mutations.ts` |
| `modules/zod/` | Zod schemas + inferred types |
| `lib/api.ts`, `lib/routes/routes.ts`, `lib/config.ts`, `lib/networking/request.ts` | URLs, client routes, env, fetch wrapper |
| `stores/` | Zustand: `auth-store` (JWT + user), `shop-store` (cart UI) |

Data flow: Component → hook (`useGetX` / `useCreateX`) → `xService.method()` → `request()` → backend. Server state TanStack Query mein; client state Zustand mein.

## 4. Order state machine (01 §19)

```mermaid
stateDiagram-v2
  [*] --> PENDING: order created (UNPAID)
  PENDING --> CONFIRMED: payment succeeded (webhook)
  PENDING --> CANCELLED: customer/admin cancel, payment timeout
  CONFIRMED --> PROCESSING: admin
  CONFIRMED --> REFUND_PENDING: cancel (paid)
  PROCESSING --> READY_FOR_PICKUP: admin (PICKUP)
  PROCESSING --> READY_FOR_DELIVERY: admin (DELIVERY)
  PROCESSING --> REFUND_PENDING: admin cancel (paid)
  READY_FOR_PICKUP --> DELIVERED: admin
  READY_FOR_DELIVERY --> DELIVERED: admin
  READY_FOR_PICKUP --> REFUND_PENDING: admin cancel
  READY_FOR_DELIVERY --> REFUND_PENDING: admin cancel
  REFUND_PENDING --> CANCELLED: refund succeeded (RefundService / retry cron)
  DELIVERED --> [*]
  CANCELLED --> [*]
```

## 5. Payment state machine

```mermaid
stateDiagram-v2
  [*] --> UNPAID: initiate
  UNPAID --> PAID: succeeded
  FAILED --> PAID: succeeded on retry
  UNPAID --> FAILED: failed
  UNPAID --> CANCELED: order cancelled while unpaid
  PAID --> REFUNDED: refund succeeded
```

## 6. Checkout sequence

```mermaid
sequenceDiagram
  participant W as student-web (checkout/payment)
  participant API as OrderCreationService
  participant DB as PostgreSQL (1 transaction)
  participant P as PaymentsService
  participant G as MockPaymentGateway
  participant WH as PaymentWebhookService
  W->>API: POST /orders (Bearer)
  API->>API: validate delivery/pickup, resolve own address
  API->>DB: NEXTVAL(order_number_seq)
  API->>DB: BEGIN
  DB->>DB: read cart, sort items by productId
  loop each item
    DB->>DB: SELECT ... FOR UPDATE inventory
    DB->>DB: check stock, deduct, CONSUMED txn
  end
  DB->>DB: totals, INSERT order/items/address, clear cart
  API->>DB: COMMIT
  API-->>W: 201 order (PENDING/UNPAID, paymentExpiresAt)
  W->>P: POST /payments/initiate { orderId }
  P->>G: createIntent(amount)
  P->>DB: INSERT payment UNPAID (gatewayRef unique)
  P-->>W: { paymentId, gatewayRef, amount }
  W->>P: POST /payments/:id/mock-complete { outcome }
  P->>G: signEvent(event)
  P->>WH: handle(rawBody, x-signature)
  WH->>G: verifyEvent (HMAC-SHA256, timingSafeEqual)
  WH->>DB: guarded: payment PAID, order CONFIRMED, user stats
  P-->>W: { status }
```

## 7. Cancel + refund sequence

```mermaid
sequenceDiagram
  participant A as Customer/Admin/Cron
  participant OC as OrderCancellationService
  participant DB as DB transaction
  participant RS as RefundService
  participant G as MockPaymentGateway
  participant CR as Refund retry cron
  A->>OC: cancel(orderId, reason)
  OC->>DB: guarded status update (WHERE status IN allowed), restore stock (CONSUMED → RELEASED)
  Note over OC,DB: paid → REFUND_PENDING (+ totalOrders −1), unpaid → CANCELLED
  OC->>RS: refund after commit (paid only)
  RS->>G: refund(gatewayRef)
  alt success
    RS->>DB: payment PAID→REFUNDED, order REFUND_PENDING→CANCELLED, totalSpent −= total
  else gateway fail
    Note over RS,DB: order REFUND_PENDING hi rahega
    CR->>RS: har 5 min retry
  end
```
