# 12 — Testing Strategy

## 1. Original mein abhi kya hai [VERIFIED]

| Area | Tests |
|---|---|
| Backend unit (Jest + ts-jest) | `batch`, `category`, `inventory`, `products` (controller/service/db spec), `health`, `app.controller` |
| Backend e2e | `test/app.e2e-spec.ts` — sirf placeholder `GET /` "Hello World" (global prefix ki wajah se likely outdated) |
| Load / race (k6) | `k6/race-create-order.js`, `k6/race-checkout.js`, `k6/user/*` |
| Manual | `postman/` collection, `docs/MANUAL_TEST_INSTRUCTIONS.md` |
| Frontend | **Koi test nahi**; sirf `bun run build` (type check) aur `eslint` |

**Gaps:** order, payment, cart, user, auth guard ke unit tests nahi; frontend tests nahi. Is review mein koi test execute nahi kiya gaya.

## 2. Tools (student project)

| Level | Tool | Kyun |
|---|---|---|
| Backend unit | Jest + `@nestjs/testing` (original jaisa) | Services ke rules, mocked db service |
| Backend integration/e2e | Jest + Supertest + real PostgreSQL (Docker) | Transactions, constraints, locks sirf real DB mein test hote hain |
| Frontend unit/component | Vitest + Testing Library + MSW | Original mein gap — naya tool, documented reason |
| E2E (optional) | Playwright | Poora checkout flow |
| Race | k6 (original) ya `Promise.all` in Jest e2e | Concurrency |

Test DB: alag database (`DATABASE_URL` test), har suite se pehle `prisma migrate reset --force` ya truncate.

## 3. Backend test plan

### 3.1 DTO validation
- `CreateOrderDto` bina `deliveryType` → 400.
- Extra field (`role` in register) → 400.
- `quantity: 0` add-to-cart → 400; `limit: 101` → 400.

### 3.2 Service business rules (unit, mocked db)

| Service | Cases |
|---|---|
| AuthService | register role hamesha CUSTOMER; duplicate email 409; wrong password aur unknown email same 401; inactive 403 |
| CartService | out of stock 400; min qty first add; max = min(stock, maxQty); doosre ka item 404 |
| MoneyService | 10% of 19.99 = 2.00; total kabhi < 0 nahi |
| OrderCreation | DELIVERY bina address 400; dono address 400; PICKUP bina time 400 |
| OrderStatus | har allowed/forbidden transition (table-driven test); delivery type mismatch |
| OrderCancellation | customer PROCESSING 400; OTHER bina note 400; paid → REFUND_PENDING |
| PaymentWebhook | succeeded twice → stats +1 sirf ek baar; late success on cancelled → refund |

### 3.3 Controller behaviour
- Guards wired: customer → `/admin/*` 403; bina token 401.
- Status codes: POST 201, DELETE 204.

### 3.4 Database / integration (real Postgres)
- Order create: stock deduct, CONSUMED transaction, cart clear — sab ek saath.
- **Rollback:** transaction ke beech koi item ka stock kam nikle (doosra item) → pehle item ka deduct bhi **wapas pehle jaisa** (transaction rollback).
- CHECK constraint: direct `qtyOnHand = -1` update → error.
- Single admin: doosra ADMIN insert → unique violation.

### 3.5 Concurrency

```ts
it('does not oversell the last unit', async () => {
  await setStock(productId, 1);
  const [a, b] = await Promise.allSettled([
    placeOrder(customerA, uuid()),
    placeOrder(customerB, uuid()),
  ]);
  const ok = [a, b].filter((r) => r.status === 'fulfilled' && r.value.status === 201);
  expect(ok).toHaveLength(1);
  expect(await getStock(productId)).toBe(0);
});
```

Aur: same customer ke 2 parallel orders (ek hi cart) → ek order bane, doosre ko 400 `Cart is empty`.

### 3.6 Auth / ownership
- Customer B `GET /orders/<A ka id>` → 404; `PATCH /orders/<A ka id>/cancel` → 404.
- Deactivated customer ka purana token → 403.

### 3.7 External service failure
- Mock gateway refund throw kare → order `REFUND_PENDING` rahe; refund cron dobara chalane par `CANCELLED`/`REFUNDED`.
- Invalid webhook signature → 400, DB unchanged.

### 3.8 Error responses
- 500 response mein `stack` field nahi.
- Validation error `message` array.

## 4. Frontend test plan

| Area | Test |
|---|---|
| Zod | `registerSchema` password mismatch → error path `confirmPassword`; `checkoutSchema` PICKUP bina time |
| `request()` | 400 body `{message:[...]}` → `ApiError.message` joined; 401 → store logout |
| Reusable components | `Pagination` disables Prev on page 1; `InputField` `aria-invalid` when error |
| Loading/error/empty | List component: MSW 500 → `ErrorState`; empty array → `EmptyState` |
| Duplicate submit | Submit button disabled while mutation pending; double click → 1 request (MSW counter) |
| Cache invalidation | Add to cart mutation ke baad `["cart"]` refetch |
| Protected routes | `AuthGuard` bina token → `router.replace('/login')`; customer role on admin layout → redirect |

## 5. E2E (critical workflows)

1. Register → login → add to cart → checkout (DELIVERY) → mock pay success → order CONFIRMED in history.
2. Admin login → order PROCESSING → READY_FOR_DELIVERY → DELIVERED.
3. Customer cancel CONFIRMED (paid) order → REFUND_PENDING → refund → CANCELLED, stock restored.
4. Unpaid order → timeout cron → CANCELLED, stock restored.

## 6. Rules

- Test pass ka claim tabhi jab actually run kiya ho aur output dekha ho.
- Failing test ko pass karne ke liye test badalna mana hai jab tak behaviour samajh na lein.
- CI mein: `lint`, `typecheck`, `test`, `test:e2e` (DB service container ke saath), frontend `build` + `test`.
