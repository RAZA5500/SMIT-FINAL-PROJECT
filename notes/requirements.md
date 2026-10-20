# OnlineMart — Requirements (Phase 1)

> Source: `FLOW-MD/01-business-logic.md` (+ 03, 06, api-reference Part 2). Yeh notes **student project** ke rules hain — reference project ke optional features (Stripe, Redis/Bull, uploads, email, SSE, batches/FEFO, reviews, dashboard) is scope mein nahi.

## Actors

| Actor | Kaun | Kya kar sakta hai |
|---|---|---|
| Guest | Bina login visitor | Active categories/products dekhna, register, login |
| CUSTOMER | Registered customer | Apne addresses, cart, orders, payments |
| ADMIN | **Sirf ek** store admin (seed script se) | Categories, products, inventory, orders fulfilment/cancel, customers activate/deactivate |
| SYSTEM | Cron jobs + mock payment webhook | Payment timeout cancel, refund retry, payment confirm/fail |

## Cross-cutting rules

- **Har route by default protected** (global JWT guard). Sirf `@Public()` routes khule: health, register, login, public catalog GETs, mock webhook.
- Har request par user DB se load hota hai: na mile → 401, `isActive = false` → 403. Role bhi DB se (token se nahi).
- Validation: global `ValidationPipe` (`whitelist`, `forbidNonWhitelisted`, `transform`) — DTO se bahar ka field → 400 (mass assignment block).
- Doosre user ka resource (order, address, cart item) → **404** (403 nahi — existence leak na ho).
- Money hamesha `Decimal(10,2)`, API mein string (`"12.50"`); price aur totals **server** calculate karta hai.
- Ek transaction = ek business operation. Side effects (refund, payment cancel) **commit ke baad**; DB transaction ke andar koi network/gateway call nahi.
- Error JSON: `{ statusCode, message, error }`; 500 mein stack/SQL kabhi nahi.
- Lists hamesha paginated: `{ data, meta: { total, currentPage, limit, pages, hasNextPage, hasPrevPage } }`, `page ≥ 1`, `limit 1–100` (default 10).

## 1. Registration

- `POST /auth/register { name, email, password, phone? }` — public, 10/min per IP.
- Password 8–72 chars (72 = bcrypt limit); bcrypt cost 12 se hash; plain password kabhi store/log/return nahi.
- Role hamesha `CUSTOMER` — DTO mein `role` field hai hi nahi; body mein `role` bhejo → 400.
- Email lowercase + trim; email ya phone pehle se ho → 409.
- **Acceptance:** naya user `role = CUSTOMER` + bcrypt hash; `role: "ADMIN"` body → 400; same email dobara → 409; response mein `passwordHash` nahi.

## 2. Login, me, logout

- `POST /auth/login { email, password }` → `{ accessToken, user }`; `lastLoginAt` update. 10/min per IP.
- Email na mile **ya** password ghalat → dono par same 401 `Invalid email or password` (user enumeration se bachao).
- Inactive account → 403 `User account is deactivated. Please contact support.`
- JWT payload `{ sub: userId, role }`, secret `JWT_SECRET` (≥32 chars), expiry `JWT_EXPIRES_IN` (e.g. `1d`).
- `GET /auth/me` → current user. Logout = client token + user delete (stateless token).
- Frontend: admin → `/admin/dashboard`, customer → `/shop`; expired token (401) → store clear + `/login`.
- **Acceptance:** customer → `/shop`, admin → `/admin/dashboard`; ghalat email aur ghalat password ka same error; deactivated user ki har API → 403; expired token → 401 → login page; customer `/admin/...` khole → redirect.

## 3. Single admin + customer status

- Sirf do roles: `ADMIN`, `CUSTOMER`. **Exactly ek ADMIN** — teen layers: register mein role nahi; koi endpoint role nahi badalta (admin sirf seed script `ADMIN_EMAIL`/`ADMIN_PASSWORD`/`ADMIN_NAME` se, admin pehle se ho to skip); DB partial unique index `users_single_admin`.
- `GET /admin/customers` (page, limit, search, isActive) — sirf customers.
- `PATCH /admin/customers/:id/status { isActive }`: apna account → 400; target CUSTOMER na ho → 403; user na mile → 404.
- **Acceptance:** doosra ADMIN insert → DB error; admin khud ko deactivate kare → 400; deactivated customer ki agli request → 403.

## 4. Address book

- `GET/POST /addresses`, `PATCH/DELETE /addresses/:id`, `PATCH /addresses/:id/default` — CUSTOMER only.
- Fields: `addressLine ≤100`, `city ≤30`, `county ≤30`, `postcode ≤20`, `isDefault?`.
- Ek user ka **max ek default** (partial unique index). Naya default set karna → purana unset — **ek transaction** mein. Default delete ho → sab se naya address default.
- Ownership `(id, userId)` — doosre ka address → 404. List mein default pehle.
- **Acceptance:** doosre user ka address GET/PATCH/DELETE → 404; do addresses `isDefault: true` → sirf aakhri default.

## 5. Categories

- Tree **max 2 levels** (parent → child). Teesra level → 400.
- Name aur slug globally unique → 409; slug name se banta hai.
- Product sirf **leaf + active** category mein. Jis category ke paas products hon us ke neeche child nahi → 409. Children ya products wali category delete → 409.
- Admin: `GET/POST /admin/categories`, `PATCH/DELETE /admin/categories/:id`. Public: `GET /categories` (sirf active).
- **Acceptance:** 3rd level → 400; products wali category ke neeche child → 409; delete with children/products → 409.

## 6. Products + public catalog

- Required: `name ≤100`, `categoryId` (leaf + active), `price ≥ 0.01` (2 decimals), `minimumOrderQuantity ≥ 1`, `maximumOrderQuantity ≥ 1`, `max ≥ min` → warna 400.
- Name per category unique → 409. Slug aur SKU unique (server generate karta hai, SKU DB sequence se).
- Delete ke bajaye deactivate (`isActive = false`).
- Admin: `GET/POST /admin/products` (list mein inactive bhi), `PATCH /admin/products/:id`.
- Public: `GET /products` (page, limit, q, categoryId, minPrice, maxPrice, sortBy `newest|price_asc|price_desc|name_asc`) aur `GET /products/:id` — backend **khud** sirf active products deta hai (inactive detail → 404); har product ke saath `stockStatus`. `minPrice > maxPrice` → 400.
- **Acceptance:** `max < min` → 400; same name same category → 409; non-leaf category → 400; inactive product shop mein na dikhe.

## 7. Inventory

- Har product ki **ek** inventory row (`productId` unique) — dobara create → 409. `POST /admin/inventory { productId, qtyOnHand ≥ 0, lowStockThreshold? }` (default threshold 10).
- Stock status: `qty ≤ 0 → OUT_OF_STOCK`, `qty ≤ threshold → LOW_STOCK`, warna `IN_STOCK` — har movement ke baad refresh.
- Adjustment `POST /admin/inventory/adjustments { inventoryId, quantity ≠ 0, reason, note? }`: reasons `DAMAGE, RECOUNT, RETURN_TO_SUPPLIER, MANUAL_CORRECTION, RESTOCK`; `DAMAGE` aur `RETURN_TO_SUPPLIER` sirf negative; stock kabhi negative nahi (400 + DB CHECK). Row lock `FOR UPDATE`.
- Har movement ledger (`inventory_transactions`) mein: `RECEIVED, ADJUSTMENT_INCREASE, ADJUSTMENT_DECREASE, CONSUMED, RELEASED`. `GET /admin/inventory/:id/transactions`.
- **Acceptance:** `DAMAGE +5` → 400; 10 stock par −11 → 400; status threshold ke mutabiq badle.

## 8. Cart

- Sirf CUSTOMER (admin → 403). Har user ki ek cart (`GET /cart` get-or-create).
- Product active na ho → 404; `OUT_OF_STOCK` → 400.
- Pehli dafa add par quantity ≥ `minimumOrderQuantity`; total ≤ min(stock, `maximumOrderQuantity`) — check transaction ke andar → 400 (e.g. `Only 5 units available`).
- `POST /cart/items` same product par quantity **increment**; `PATCH /cart/items/:id` absolute quantity (0 = remove); `DELETE /cart/items/:id`, `DELETE /cart` → 204. Doosre ka item → 404.
- Cart stock **reserve nahi** karta; price hamesha product se (cart item par price column nahi).
- **Acceptance:** stock 5, max 10 → 6 add → 400; admin `GET /cart` → 403.

## 9. Order creation (checkout)

- `POST /orders { deliveryType, addressId? | shippingAddress?, pickupScheduledAt?, customerNotes? }` — CUSTOMER.
- DELIVERY: `addressId` (apna saved) **ya** inline `shippingAddress` — exactly ek; pickup time mana. PICKUP: `pickupScheduledAt` zaroori; address mana.
- Cart khali → 400 `Cart is empty. Cannot create order.`; inactive product → 400.
- **Ek transaction:** cart padho → items `productId` se sort (deadlock se bachao) → inventory `SELECT … FOR UPDATE` → kam stock → 400 `Not enough stock. Requested: X, Available: Y.` → stock deduct (reservation nahi) → price product se → totals (shipping 0) → order + items + address snapshot → `CONSUMED` ledger → cart clear.
- Order number `ORD-<YEAR>-<000001>` sequence se; status `PENDING`, payment `UNPAID`, `paymentExpiresAt = now + 5 min`.
- Duplicate: cart order ke saath khali hota hai, is liye dobara request → 400 `Cart is empty` (koi idempotency key nahi — user decision); "Pay Now" button pending mein disabled.
- **Acceptance:** order ke baad cart khali; turant dobara order → 400; stock 1 + 2 parallel orders → sirf 1 kamyab; PICKUP bina date → 400; beech mein stock fail → poora transaction rollback.

## 10. Order status (admin)

| Current | Allowed next |
|---|---|
| PENDING | — (sirf payment confirm se CONFIRMED) |
| CONFIRMED | PROCESSING |
| PROCESSING | READY_FOR_PICKUP (sirf PICKUP), READY_FOR_DELIVERY (sirf DELIVERY) |
| READY_FOR_PICKUP / READY_FOR_DELIVERY | DELIVERED |
| DELIVERED, CANCELLED, REFUND_PENDING | — |

- `PATCH /admin/orders/:id/status { status }`; `CANCELLED` yahan se nahi → 400 (cancel endpoint use karo). Timestamps `processedAt`, `readyAt`, `deliveredAt`.
- Guarded update `WHERE id AND status = <read status>` → kisi aur ne pehle badla → 409.
- **Acceptance:** CONFIRMED → DELIVERED → 400; DELIVERY order → READY_FOR_PICKUP → 400.

## 11. Cancellation + refund

- Customer `PATCH /orders/me/:id/cancel { reason, note? }`: sirf `PENDING`/`CONFIRMED` (warna 400); reasons `CHANGED_MIND, ORDERED_BY_MISTAKE, FOUND_BETTER_PRICE, DELIVERY_TOO_LONG, OTHER`; `OTHER` par note zaroori (≤500); already cancelled → 200 `Order is already cancelled.`
- Admin `PATCH /admin/orders/:id/cancel { reason, note? }`: PENDING, CONFIRMED, PROCESSING, READY_* se; DELIVERED / already CANCELLED → 400; reasons `CUSTOMER_REQUEST, OUT_OF_STOCK, PAYMENT_ISSUE, OTHER` (note zaroori). System reason: `PAYMENT_TIMEOUT`.
- Customer, admin aur system — **ek shared** cancel-in-transaction function. Stock `CONSUMED` rows se exact wapas + `RELEASED` rows.
- Unpaid → `CANCELLED` (commit ke baad UNPAID payment best-effort `CANCELED`). Paid → `REFUND_PENDING` + `totalOrders −1` → commit ke baad gateway refund → kamyab: payment `REFUNDED`, order `CANCELLED`, `totalSpent −= total`; fail: order `REFUND_PENDING` hi rahe, **refund retry cron** (har 5 min) dobara try kare. Guarded `WHERE status = 'PAID'` se double refund nahi.
- **Acceptance:** PROCESSING order customer cancel → 400; doosre customer ka order → 404; paid order cancel → REFUND_PENDING → refund ke baad CANCELLED/REFUNDED, `totalSpent` wapas; gateway down → REFUND_PENDING rahe, cron ke baad complete.

## 12. Payments (mock gateway)

- `POST /payments/initiate { orderId }` (CUSTOMER): order apna aur `PENDING` (warna 404), total > 0; existing UNPAID payment **reuse**; amount server ka `order.total`; `gatewayRef` unique → `{ paymentId, gatewayRef, amount }`.
- `POST /payments/:id/mock-complete { outcome: "succeeded" | "failed" }` — mock gateway signed event banata hai aur webhook handler se process hota hai → `{ status }`.
- `POST /webhooks/payments/mock` — public, `x-signature` (HMAC-SHA256, `timingSafeEqual`) — ghalat signature → 400, DB unchanged.
- **Succeeded:** guarded — payment `UNPAID/FAILED → PAID` aur order `PENDING → CONFIRMED` (`confirmedAt`), user `totalOrders +1`, `totalSpent += total`. Duplicate event → koi doosra effect nahi.
- **Failed:** payment `UNPAID → FAILED` (+ reason); order `PENDING` hi rahe (retry ho sakta hai).
- **Late payment:** order pehle cancel ho chuka aur payment ab succeed → payment `PAID` + commit ke baad automatic refund.
- **Acceptance:** same order 3 dafa initiate → 1 payment row; same succeeded event 2 dafa → `totalOrders` sirf +1; invalid signature → 400.

## 13. Payment timeout

- Cron (`@nestjs/schedule`, har minute): `status = PENDING AND paymentExpiresAt < now` orders → `PAYMENT_TIMEOUT` reason se cancel, stock wapas, UNPAID payment best-effort `CANCELED`.
- Guarded `WHERE status = PENDING` — payment confirm aur cron ek saath chalein to sirf ek jeetega.
- **Acceptance:** unpaid order 5 min ke baad → CANCELLED, stock wapas.

## Database invariants (aakhri line of defence)

1. `users_single_admin` — partial unique index (sirf ek ADMIN).
2. `inventory_qty_non_negative` — CHECK `qtyOnHand >= 0`.
3. `addresses_user_default_unique` — partial unique index (ek default per user).
4. `order_number_seq` (aur `product_sku_seq`) — race-safe numbering.
5. Unique: `users.email`, `users.phone`, `categories.name/slug`, `products(name, categoryId)`, `products.slug/sku`, `inventory.productId`, `carts.userId`, `cart_items(cartId, productId)`, `orders.orderNumber`, `payments.gatewayRef`, `order_addresses.orderId`.

## Open questions (01 §23) — is project mein status

| # | Sawal | Is project mein | Instructor ka jawab |
|---|---|---|---|
| Q1 | Do roles + ek admin | Implemented (closed decision) | Closed |
| Q2 | Public catalog inactive products | Backend khud `isActive = true` filter karta hai | Pending |
| Q3 | Default address transaction | Transaction mein | Pending |
| Q4 | `best_selling` sort | Student `sortBy` list mein nahi | Pending |
| Q5 | Dead frontend endpoints | Saare frontend URLs `lib/api.ts` mein, backend se match | Pending |
| Q6 | In-memory throttler/SSE | Single instance; SSE scope mein nahi | Pending |
| Q7 | Batch cancel restore | Batches scope mein nahi | Pending |
| Q8 | Partial refunds | Sirf full refund | Pending |
| Q9 | Shipping cost | Hamesha 0 | Pending |
| Q10 | Missing tests | Unit + e2e tests likhe gaye | Pending |
