# OnlineMart — Student Learning Project Docs

Yeh folder students ke liye ek **complete learning guide** hai. Is mein ek real-world online grocery store (**OnlineMart**) ki business logic, architecture aur engineering practices explain ki gayi hain, taa ke student khud se ek similar project bana sake.

Yeh docs do reference projects ko parh kar likhe gaye hain:

| Reference | Technology | Is docs mein path |
|---|---|---|
| Backend | NestJS 11, Prisma 7, PostgreSQL, JWT + bcrypt (backend auth), Stripe, Bull (Redis), Cloudflare R2 (S3 API), SMTP2GO | `api/src/...` |
| Frontend | Next.js 16 (App Router), React 19, TanStack Query 5, React Hook Form + Zod 4, Zustand, Tailwind v4, shadcn-style components (base-ui) | `web-app/src/...` |

> Docs mein jo bhi rule likha hai woh code se verify kiya gaya hai. Har jagah label laga hai: **[VERIFIED]** (code mein confirm), **[INFERRED]** (andaza — confirm karna hai), **[RECOMMENDED]** (improvement, abhi implement nahi).

## Kis order mein parhein?

| # | File | Kya milega |
|---|---|---|
| 1 | [01-business-logic.md](01-business-logic.md) | **Sab se important.** Har feature ke business rules, workflows, failures, duplicate requests, acceptance criteria |
| 2 | [02-system-architecture.md](02-system-architecture.md) | Poora system kaise juda hai — layers, modules, external services |
| 3 | [03-database-design.md](03-database-design.md) | Tables, relations, constraints, indexes, transactions |
| 4 | [04-backend-development-guide.md](04-backend-development-guide.md) | DTO → Controller → Service → DB service → Mapper layers |
| 5 | [05-api-design.md](05-api-design.md) | REST conventions, status codes, pagination, error format |
| 6 | [06-authentication-and-authorization.md](06-authentication-and-authorization.md) | Backend authentication (JWT + bcrypt), roles, single admin, ownership |
| 7 | [07-frontend-development-guide.md](07-frontend-development-guide.md) | Next.js structure, components, shadcn/ui, Tailwind rules |
| 8 | [08-api-integration-guide.md](08-api-integration-guide.md) | Frontend se backend call karne ka exact pattern |
| 9 | [09-validation-and-error-handling.md](09-validation-and-error-handling.md) | Zod (frontend) + class-validator (backend) + errors |
| 10 | [10-security-best-practices.md](10-security-best-practices.md) | Security checklist |
| 11 | [11-performance-and-reliability.md](11-performance-and-reliability.md) | Caching, deduplication, duplicate writes, N+1, concurrency |
| 12 | [12-testing-strategy.md](12-testing-strategy.md) | Kya aur kaise test karna hai |
| 13 | [13-student-implementation-roadmap.md](13-student-implementation-roadmap.md) | Step-by-step build plan |
| 14 | [14-project-acceptance-checklist.md](14-project-acceptance-checklist.md) | Project "done" kab maana jaye |
| — | [api-reference.md](api-reference.md) | Saare endpoints ek jagah |

## Students ko kya banana hai? (Scope)

**Core commerce slice** — yeh banana zaroori hai:

1. Authentication (register, login, logout) — **local JWT + bcrypt**
2. **Sirf ek admin** + bahut se customers
3. Address book
4. Categories (parent → child)
5. Products
6. Inventory (stock, adjustments, transaction ledger)
7. Cart
8. Orders (create, stock lock, status transitions, cancel + stock restore)
9. Mock payment gateway (webhook style confirm/fail, refund)
10. Payment timeout auto-cancel (cron)

**Optional / advanced** (sirf samajhne ke liye explain kiya gaya hai): Stripe, Redis/Bull queues, S3 file upload, email, live notifications (SSE), batches + FEFO, reviews, dashboard.

## Original se deliberate deviations

| Topic | Original | Student project | Kyun |
|---|---|---|---|
| Auth | — | Backend khud handle kare: JWT + bcrypt | Koi external service nahi; students password security aur tokens khud seekhein |
| Roles / Admin | ADMIN aur CUSTOMER; admin count ki DB limit nahi | Sirf ADMIN + CUSTOMER, exactly **one** ADMIN (DB constraint) | Business requirement |
| Payment | Stripe + webhooks | Mock gateway jo webhook ki tarah kaam kare | Bina Stripe account; concept same |
| Background jobs | Bull (Redis) + cron | Sirf `@nestjs/schedule` cron | Redis setup ki zaroorat nahi |
| Inventory | Batches + FEFO | Simple qtyOnHand | Pehle basics; FEFO advanced exercise |
| Public catalog filter | Frontend `isActive=true` bhejta hai | Backend khud filter kare | Security fix (01 doc Q2) |

## Language note

Explanations Roman Urdu mein hain; technical terms, code, field names aur error messages English mein rakhe gaye hain, taa ke code se match karein.
