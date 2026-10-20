# 13 — Student Implementation Roadmap

Har phase mein: **Kya banana hai · Kyun · Files · Kya seekhna hai · Kaise test karein · Aage badhne ki shart (exit criteria)**.

Suggested repo:

```text
online-mart-student/
├── docker-compose.yml        # PostgreSQL
├── student-api/              # NestJS + Prisma
└── student-web/              # Next.js
```

---

## Phase 1 — Business requirements samjhein
- **Kya:** [01-business-logic.md](01-business-logic.md) parhein; har feature ke business rules apne alfaaz mein ek page par likhein.
- **Kyun:** Code se pehle "kya" aur "kyun" clear ho, warna ghalat cheez achhi tarah ban jati hai.
- **Files:** `notes/requirements.md`
- **Seekhna:** Actors, rules, invariants, failure cases.
- **Test:** Instructor ke saath walkthrough — order lifecycle aur cancel rules bina dekhe samjha sakein.
- **Exit:** Har core feature ke acceptance criteria likhe hue.

## Phase 2 — Architecture aur workflow diagrams
- **Kya:** Context diagram, module list, order state machine, checkout sequence (Mermaid).
- **Files:** `notes/architecture.md`
- **Seekhna:** Layers, module boundaries, sync vs async.
- **Exit:** State machine [01 §19](01-business-logic.md) se match kare.

## Phase 3 — Database schema
- **Kya:** [03-database-design.md](03-database-design.md) §3 ka schema + raw SQL constraints (single admin, CHECK, partial unique, sequence).
- **Files:** `student-api/prisma/schema.prisma`, `prisma/migrations/<ts>_init/migration.sql`
- **Seekhna:** Relations, unique/FK, indexes, Decimal money, constraints app checks se kyun behtar.
- **Test:** `prisma migrate dev`; psql mein doosra ADMIN insert try → error; `qtyOnHand = -1` → error.
- **Exit:** Migration clean apply, constraints kaam karein.

## Phase 4 — Environment aur database access
- **Kya:** NestJS project, `ConfigModule` + env validation, `DatabaseModule/DatabaseService` (Prisma + adapter-pg), `docker-compose.yml`, `.env.example`.
- **Files:** `src/main.ts`, `src/app.module.ts`, `src/config/env.validation.ts`, `src/database/*`, `src/modules/health/*`
- **Seekhna:** Fail-fast config, single DB client, lifecycle hooks, global prefix, helmet, CORS, ValidationPipe, exception filter.
- **Test:** `GET /v1/health` → 200; missing `JWT_SECRET` → app boot fail.
- **Exit:** App chalti hai, DB connect.

## Phase 5 — Authentication aur authorization
- **Kya:** Register/login/me, bcrypt, JWT, global `JwtAuthGuard`, `RolesGuard`, `@Public`, `@Roles`, `@CurrentUser`, admin seed script.
- **Files:** `src/modules/auth/*`, `src/modules/users/*`, `src/common/{guards,decorators}/*`, `prisma/seed.ts`
- **Seekhna:** Hashing, token signing, deny-by-default, role vs ownership, single admin enforcement. Dekhein [06](06-authentication-and-authorization.md).
- **Test:** Unit — register role CUSTOMER, same error for wrong email/password; e2e — no token 401, customer → admin route 403, deactivated 403.
- **Exit:** Har route by default protected.

> Auth ko DTO/validation se pehle rakha hai kyunke baaki sab endpoints `CurrentUser` par depend karte hain. Register/login ke DTOs isi phase mein banenge.

## Phase 6 — DTOs aur validation
- **Kya:** Har module ke create/update/query/param DTOs; `PaginationDto`.
- **Files:** `src/modules/*/dto/*.dto.ts`, `src/common/pagination/*`
- **Seekhna:** class-validator, transform, whitelist, alag DTOs per operation. Dekhein [09](09-validation-and-error-handling.md).
- **Test:** Extra field 400; invalid UUID 400; `limit=500` 400.
- **Exit:** Koi endpoint untyped body nahi leta.

## Phase 7 — Database access aur mappers
- **Kya:** Har module ka `*.db.service.ts` + `mappers/*.mapper.ts` + `types/*`; `MoneyService`.
- **Seekhna:** Query isolation, Prisma payload types, Decimal → string, sensitive fields hatana, Prisma error mapping.
- **Test:** Mapper unit test — user mapper mein `passwordHash` nahi; money `"10.00"` format.
- **Exit:** Services mein koi direct `prisma.` call nahi.

## Phase 8 — Business services
Order matters (dependencies):
1. Categories (2 levels, leaf rule) → 2. Products (unique name per category, min/max qty, slug/SKU) → 3. Inventory (create, adjust with lock, ledger, stock status) → 4. Addresses (ownership, default in transaction) → 5. Cart (rules [01 §13]) → 6. Orders: creation (single transaction + locks), status transitions, cancellation (shared function) → 7. Payments: mock gateway, initiate, webhook handler, refund → 8. Crons: payment timeout, refund retry.
- **Files:** `src/modules/<domain>/<domain>.service.ts` (orders/payments split into multiple services), `src/infrastructure/payment/*`
- **Seekhna:** Transactions, `FOR UPDATE`, sorted locks, optimistic concurrency, side effects after commit.
- **Test:** Unit tests per [12 §3.2](12-testing-strategy.md).
- **Exit:** Har rule ka kam az kam ek test.

## Phase 9 — REST controllers
- **Kya:** Thin controllers per [api-reference.md](api-reference.md); admin routes `/admin/*`.
- **Seekhna:** REST conventions, status codes, route order (static before `:id`). Dekhein [05](05-api-design.md).
- **Test:** Swagger (`/v1/docs`) se har endpoint manually; Supertest status codes.
- **Exit:** Endpoint list complete aur documented.

## Phase 10 — Backend workflows test
- **Kya:** E2E suite real Postgres par: checkout, oversell race, rollback, cancel/restore, webhook duplicate, ownership.
- **Files:** `student-api/test/*.e2e-spec.ts`
- **Exit:** `bun run test` aur `bun run test:e2e` green (output save karein).

## Phase 11 — Frontend architecture
- **Kya:** Next.js app, Tailwind tokens, providers (QueryClient, Toaster), folder structure [07](07-frontend-development-guide.md), `lib/routes/routes.ts`, `lib/api.ts`, `lib/config.ts`.
- **Exit:** Empty pages route hote hain; `bun run build` clean.

## Phase 12 — API client aur auth flow
- **Kya:** `lib/networking/request.ts` (ApiError, message extraction, 401 handling), `stores/auth-store.ts` (token + user, persist, `_hasHydrated`), login/register pages, `AuthGuard`.
- **Seekhna:** [08](08-api-integration-guide.md) §1–6, §12–13.
- **Test:** Vitest — `request()` error parsing; login → store; 401 → logout.
- **Exit:** Customer aur admin apne area mein land karein.

## Phase 13 — Reusable UI components
- **Kya:** shadcn primitives (`bunx shadcn add button input label card badge skeleton table dialog select`) + shared: `InputField`, `SelectField`, `PageHeader`, `EmptyState`, `ErrorState`, `TableSkeleton`, `Pagination`, `StatusBadge`, `ConfirmDialog`, `SearchInput`.
- **Seekhna:** Composition, typed props, cva variants, Tailwind scale (no arbitrary px).
- **Test:** Component tests (Pagination, InputField).
- **Exit:** Pages sirf in components se bane hon.

## Phase 14 — Zod schemas aur forms
- **Kya:** `modules/zod/{login,register,address,checkout,product,category,inventory-adjustment,cancel-order}.model.ts`
- **Test:** Schema unit tests (cross-field cases).
- **Exit:** Har form RHF + zodResolver.

## Phase 15 — Frontend ↔ backend integration
- **Kya:** `services/<domain>/{index,types,queries,mutations}.ts` har domain ke liye; pages wire karein; checkout → order (button pending mein disabled) → initiate → mock pay.
- **Exit:** Poora customer + admin flow browser mein kaam kare.

## Phase 16 — Loading, error, empty states
- **Kya:** Har list/detail/mutation ke chaaron states [07 §7](07-frontend-development-guide.md).
- **Exit:** Backend band karke har page check — koi blank/crash screen nahi.

## Phase 17 — Permissions aur ownership verify
- **Kya:** Customer B ke token se A ke resources (orders, addresses, cart items) — har ek 404; customer → `/admin/*` 403; frontend admin page customer ko redirect.
- **Exit:** [14 checklist](14-project-acceptance-checklist.md) security section green.

## Phase 18 — Duplicate requests
- **Kya:** Double-click checkout, retry with same key, network throttle (DevTools "Slow 3G") ke saath submit, two tabs.
- **Exit:** Kabhi do orders / double charge nahi.

## Phase 19 — Critical E2E workflows
- **Kya:** [12 §5](12-testing-strategy.md) ke 4 flows (Playwright ya manual script with recorded results).

## Phase 20 — Final acceptance
- **Kya:** [14-project-acceptance-checklist.md](14-project-acceptance-checklist.md) har item; test/build output attach; README (setup steps).

---

## Advanced / optional exercises (core ke baad)

| Exercise | Original reference |
|---|---|
| Batches + FEFO + expiry cron | `api/src/modules/batch`, `order.db.service.ts allocateFefo` |
| Real Stripe (test mode) + webhooks | `api/src/modules/payment` |
| Bull queues + delayed payment timeout | `order.service.ts scheduleOrderPaymentTimeoutJob` |
| S3-compatible uploads with rollback | `common/services/file-upload.service.ts` |
| Reviews with verified purchase | `api/src/modules/review` |
| SSE live notifications | `modules/events`, `web-app/src/lib/notifications/sse.ts` |
| Admin dashboard with period comparison | `common/period/period.service.ts` |
