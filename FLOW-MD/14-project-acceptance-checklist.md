# 14 — Project Acceptance Checklist

Project tab "done" hai jab har box tick ho aur evidence (test output, screenshot, ya command result) saath ho.

## A. Business rules
- [ ] Register hamesha CUSTOMER banata hai; `role` field bhejne par 400.
- [ ] Exactly ek ADMIN; doosra admin DB level par reject.
- [ ] Deactivated customer ka purana token → 403.
- [ ] Category max 2 levels; product sirf leaf + active category mein.
- [ ] Product name per category unique; `max >= min` order qty.
- [ ] Public catalog sirf active products (server-side filter).
- [ ] Stock adjustment: `DAMAGE`/`RETURN_TO_SUPPLIER` sirf negative; stock kabhi negative nahi.
- [ ] Stock status IN/LOW/OUT threshold ke mutabiq update.
- [ ] Cart: min qty first add, max = min(stock, maxQty), out-of-stock 400, admin cart 403.
- [ ] Order: DELIVERY → address (saved ya inline, dono nahi); PICKUP → time; price server se; order number sequence se.
- [ ] Order create ek transaction: stock deduct, CONSUMED ledger, cart clear.
- [ ] Payment timeout ke baad PENDING order auto-cancel, stock wapas.
- [ ] Status transitions sirf allowed map ke mutabiq; delivery-type mismatch 400.
- [ ] Customer cancel sirf PENDING/CONFIRMED; OTHER par note zaroori.
- [ ] Paid order cancel → REFUND_PENDING → refund → CANCELLED/REFUNDED; `totalSpent` wapas.
- [ ] Late payment on cancelled order → auto-refund.

## B. Backend architecture
- [ ] DTO / Controller / Service / Db service / Types / Mappers layers har module mein (jitni zaroorat).
- [ ] Controllers mein business logic ya Prisma nahi.
- [ ] Ek `DatabaseService`; koi doosra PrismaClient nahi.
- [ ] Payment gateway infrastructure interface ke peeche.
- [ ] Orders/payments multiple focused services mein split.

## C. REST API
- [ ] Resource URLs, sahi methods, sahi status codes ([05](05-api-design.md)).
- [ ] Saari lists paginated, `data` + `meta` shape.
- [ ] Consistent error JSON; 500 mein stack nahi.
- [ ] [api-reference.md](api-reference.md) implementation se match.

## D. Security
- [ ] bcrypt, generic login error, login rate limit.
- [ ] Global auth guard; `/admin/*` sirf ADMIN.
- [ ] IDOR tests: doosre user ke order/address/cart item → 404.
- [ ] `passwordHash` kisi response mein nahi.
- [ ] Webhook signature verified; invalid → 400.
- [ ] `.env` committed nahi; `.env.example` placeholders.

## E. Reliability, duplicates, concurrency
- [ ] Order ke baad cart khali; turant dobara order → 400 `Cart is empty`.
- [ ] 2 customers, 1 unit stock, parallel → 1 order.
- [ ] Duplicate webhook → stats sirf ek baar.
- [ ] Transaction rollback test (beech mein stock fail par pehle items ka stock unchanged).

## F. Frontend
- [ ] Folder structure [07](07-frontend-development-guide.md) ke mutabiq; pages compose karte hain.
- [ ] Saare forms Zod + RHF; cross-field rules.
- [ ] `services/<domain>` hooks; components direct `fetch` nahi karte.
- [ ] Loading (skeleton) / error / empty / success states har list par.
- [ ] Submit buttons pending mein disabled; checkout key `useRef` mein stable.
- [ ] Mutations ke baad sahi query invalidation.
- [ ] AuthGuard: customer admin pages na dekh sake; 401 par logout.
- [ ] shadcn/ui primitives + shared components; duplicate UI patterns nahi.
- [ ] Tailwind: koi arbitrary spacing (`p-[20px]`) nahi.

## G. Code quality
- [ ] Koi source file 1000 lines se zyada nahi (check: `find src -name "*.ts*" | xargs wc -l | sort -n | tail`).
- [ ] `lint` aur `typecheck` clean.

## H. Tests aur build (evidence attach karein)
- [ ] `student-api`: `bun run test` — output
- [ ] `student-api`: `bun run test:e2e` (real Postgres) — output
- [ ] `student-api`: `bun run build`
- [ ] `student-web`: `bun run build`
- [ ] `student-web`: `bun run test`
- [ ] 4 critical E2E flows ([12 §5](12-testing-strategy.md)) — result

## I. Documentation
- [ ] README: setup (docker, env, migrate, seed, run), admin credentials kahan se aate hain.
- [ ] Deviations from original documented.
- [ ] Open questions ([01 §23](01-business-logic.md)) par instructor ka jawab record.
