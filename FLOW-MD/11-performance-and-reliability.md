# 11 — Performance aur Reliability

## 1. Do alag concepts (inhein mix na karein)

| Concept | Sawal | Layer | Example |
|---|---|---|---|
| **Request deduplication** | "Kya same read request do baar ek saath ja rahi hai?" | Frontend | TanStack Query same key ki in-flight request share karta hai |
| **Caching** | "Kya hum data dobara fetch kiye baghair dikha sakte hain?" | Frontend (aur kabhi server) | `staleTime: 5 min` |

Dedup aur cache sirf **reads** (GET) ke liye hain. Writes (order, payment, refund) ke liye neeche "duplicate requests" section dekhein — cache kabhi double order nahi rokta.

## 2. Duplicate requests — writes ko safe kaise rakhein?

| Operation | Duplicate ka nuksan | Bachao |
|---|---|---|
| Order create | Double order | Cart order ke saath khali hota hai (dobara request → 400 `Cart is empty`); frontend "Pay Now" button pending mein disabled |
| Payment initiate | Do payments | Existing UNPAID payment reuse; `gatewayRef` unique |
| Payment confirm (webhook) | Double `totalSpent` | `updateMany where status IN (UNPAID, FAILED)` |
| Refund | Double refund | Payment `PAID → REFUNDED` guarded update |
| Stock adjustment | Double adjustment | Submit button disabled while pending |
| Account creation | Do accounts | `email` unique |
| Order cancel | Double stock restore | Guarded status update |

**Simple rules:**
1. **Unique constraint** jahan business ek hi record allow kare (email, gatewayRef, cart per user).
2. **Status guard** har state change par: `updateMany({ where: { id, status: expected } })` → `count === 0` matlab kisi aur ne pehle kar diya.
3. **Absolute values** behtar hain: `PUT quantity = 3` dobara bhejna safe hai, "+1" nahi.
4. **Frontend** submit button pending mein disabled — lekin yeh sirf UX hai, backend rules ke baghair kaafi nahi.

## 3. Concurrency — overselling se bachao

```text
Customer A (qty 1) ──┐                         stock = 1
Customer B (qty 1) ──┴─> dono "stock >= 1" padhte hain ❌ (bina lock)
```

Original solution [VERIFIED]:

1. Transaction ke andar `SELECT ... FOR UPDATE` (doosra transaction intezar karta hai).
2. Lock ke baad check, phir deduct.
3. Items `productId` se sort — A aur B alag order mein same do products lock karein to **deadlock** hota; sorted order is ko khatam karta hai.
4. DB CHECK `qtyOnHand >= 0` — aakhri safety.

Status transitions: optimistic concurrency (`WHERE status = expected`, `count === 0 → 409`).

## 4. Frontend — unnecessary calls avoid karein

| Rule | Original example |
|---|---|
| Shared query hooks — har component apna `fetch` na kare | `useGetCart` cart sidebar, header counter aur checkout sab mein |
| `useEffect` dependency loop se bachein | `AuthGuard` effect deps stable (`hasHydrated, user, expectedRole`) |
| Spam clicks coalesce | Cart +/- 350 ms debounce |
| Search debounce | `useDebounce` |
| Obsolete requests cancel | TanStack Query `signal` / `AbortController` (SSE teardown `controller.abort()`) |
| Pagination par blank flash nahi | `placeholderData: keepPreviousData` |
| Mutation ke baad targeted invalidate | `invalidateQueries({ queryKey: cartKeys.cart })` |
| Heavy modals sirf open par mount | `{open && <Modal />}` (maps, video) |
| Duplicate submit | button `disabled` while pending |

**Anti-pattern:** checkout page aur cart sidebar dono `cartService.getCart()` khud call karein — ek hi `useGetCart()` hook use karein.

## 5. Backend — efficient queries

| Rule | Example |
|---|---|
| N+1 avoid | Cancel par order items ke CONSUMED transactions **ek** `findMany({ orderItemId: { in: ids } })` se (original comment), loop mein query nahi |
| Parallel independent reads | `Promise.all([findMany, count])` pagination mein |
| Sirf zaroori fields | `select: { id: true, name: true }` |
| Aggregates DB mein | `groupBy` order summary; `aggregate _max depth` category subtree |
| Indexes | `(status, paymentExpiresAt)` timeout sweep, `(userId, createdAt)` history |
| Batch updates | `updateMany`, `createMany` |
| Ek operation mein same lookup dobara nahi | Order create cart ek baar transaction mein padhta hai |
| External side effect ek hi baar | Status guards |

## 6. Reliability patterns

| Pattern | Kab | Original |
|---|---|---|
| **After-commit call + retry cron** | DB change ke baad external call (refund) | Status `REFUND_PENDING` = "kaam baqi hai"; `RefundService` commit ke baad call, fail par cron retry |
| **Queue + retries** | Webhook processing, emails | Bull, 3 attempts exponential |
| **Delayed job + cron backstop** | Payment timeout | Bull delayed job (primary) + 5-min cron (backstop) |
| **Fire-and-forget side effects** | Audit/notification fail se main flow fail na ho | `auditService.log` `.catch(log)` |
| **Graceful shutdown** | Deploy | `enableShutdownHooks`, SIGTERM handler |
| **Upload rollback** | S3 + DB | `FileUploadService.uploadAndPersist` |

Student project (Redis ke baghair): payment timeout cron har minute; refund retry cron (`REFUND_PENDING` orders ke liye gateway refund dobara try).

## 7. Expected API call map — important workflows

| Workflow | Trigger | Calls (order) | Cacheable | Duplicate safe | Retry safe | Invalidate | DB side effects |
|---|---|---|---|---|---|---|---|
| Shop open | Page load | `GET /categories` ∥ `GET /products?page=1` (parallel) | ✅ | ✅ | ✅ | — | none |
| Add to cart | "Add" click | `POST /cart/items` | ❌ | ⚠️ increments | ⚠️ | `cart` | cart_items upsert |
| Change qty | +/- | (debounced) `PUT /cart/items/:id` | ❌ | ✅ absolute | ✅ | `cart` | update |
| Checkout | Pay Now | `POST /orders` → `POST /payments/initiate` (sequential, dependent) | ❌ | ⚠️ button disabled; cart khali hone se dobara order 400 | ⚠️ | `cart`, `customerOrders` | order, items, stock, cart clear |
| Pay | Card confirm | Stripe → webhook (student: `POST /payments/:id/mock-complete`) | ❌ | ✅ guards | ✅ | `customerOrders` | payment PAID, order CONFIRMED, user stats |
| Customer cancel | Cancel modal | `PATCH /orders/:id/cancel` | ❌ | ✅ | ✅ | `customerOrders` | status, stock restore / refund |
| Admin advance | Status picker | `PATCH /admin/orders/:id/status` | ❌ | ✅ (409/400) | ✅ | `adminOrders` | status + timestamp |
| Admin adjust stock | Modal | `POST /admin/inventory/adjustments` | ❌ | ⚠️ button disabled | ⚠️ | `inventory` | qty + transaction |

Note: checkout mein do calls sequential hain kyunke payment ko order id chahiye. Backend order create ko **ek transaction** rakhta hai — frontend ko stock aur cart alag alag orchestrate nahi karna padta.
