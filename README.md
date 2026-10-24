# OnlineMart — full-stack grocery store (Freskinto UI)

Student implementation of the OnlineMart specification in [`FLOW-MD/`](FLOW-MD/README.md), built by following
the 20-phase roadmap ([`FLOW-MD/13-student-implementation-roadmap.md`](FLOW-MD/13-student-implementation-roadmap.md))
and checked against the acceptance checklist ([`notes/acceptance-checklist.md`](notes/acceptance-checklist.md)).

| Folder | What | Stack |
|---|---|---|
| `Freskinto-api/` | REST API (`/v1`) | NestJS 11, Prisma 7 + PostgreSQL 17, JWT, class-validator, Jest + Supertest |
| `Freskinto-web/` | Storefront + admin panel | Next.js 16 (App Router), TanStack Query, Zustand, React Hook Form + Zod, Tailwind v4 + shadcn/ui (Base UI), Vitest + MSW |
| `docker-compose.yml` | Local PostgreSQL (port **5433**) + `onlinemart_test` database | Docker |
| `render.yaml` | Render Blueprint for backend + PostgreSQL deployment | Render |
| `DEPLOYMENT.md` | Complete production deployment guide (Render + Vercel) | Docs |
| `notes/` | Phase 1–2 notes (requirements, architecture), acceptance checklist, test/build evidence | Markdown |

> **Deploying to Production?** Follow our step-by-step guide in [`DEPLOYMENT.md`](DEPLOYMENT.md) to deploy `Freskinto-api` on **Render** (via 1-click Blueprint or manual setup) and `Freskinto-web` on **Vercel**.

The app folders were called `student-api/` and `student-web/` until 2026-10-22 (package names are now
`freskinto-api` and `freskinto-web`); run logs in `notes/evidence/` recorded before that date still use the old
names.

## Prerequisites

- Docker (for PostgreSQL)
- [Bun](https://bun.sh) 1.4+ (package manager and script runner for both apps)
- Node.js 20.9+ (Next.js and the Prisma CLI run on Node)

## Setup

```bash
# 1. Database — PostgreSQL 17 on localhost:5433 (dev DB `onlinemart` + test DB `onlinemart_test`)
docker compose up -d

# 2. API
cd Freskinto-api
cp .env.example .env        # then fill in the secrets (see below)
bun install                 # also runs `prisma generate`
bun run db:deploy           # apply migrations (during schema work: bun run db:migrate)
bun run db:seed             # creates the single ADMIN from ADMIN_EMAIL / ADMIN_PASSWORD
bun run start:dev           # http://localhost:4000/v1  (Swagger: http://localhost:4000/v1/docs)

# 3. Web
cd ../Freskinto-web
cp .env.example .env.local  # NEXT_PUBLIC_BASE_URL=http://localhost:4000/v1
bun install
bun run dev                 # http://localhost:3000
```

`Freskinto-api/.env` values:

| Variable | Notes |
|---|---|
| `DATABASE_URL` | `postgresql://onlinemart:onlinemart@localhost:5433/onlinemart?schema=public` (docker-compose) |
| `JWT_SECRET` | random, **at least 32 characters** — the API refuses to start otherwise |
| `JWT_EXPIRES_IN` | e.g. `1d` |
| `CORS_ORIGINS` | comma-separated, e.g. `http://localhost:3000` |
| `PAYMENT_WEBHOOK_SECRET` | random, at least 16 characters (HMAC-SHA256 for the mock gateway webhook) |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` | used only by `bun run db:seed` |

The test database is created by `docker/postgres/init/01-create-test-db.sql` the first time the Docker volume is
created. If your volume is older than that script, create it once with
`docker exec onlinemart-db createdb -U onlinemart onlinemart_test`.

### Accounts

- **Admin:** the credentials are whatever you put in `Freskinto-api/.env` as `ADMIN_EMAIL` / `ADMIN_PASSWORD`;
  `bun run db:seed` creates that user. Exactly one ADMIN can exist (enforced by a database index), and the seed
  skips if one is already there. Admins land on `/admin/dashboard`.
- **Customers:** register at `/register` (always created as CUSTOMER). Customers land on `/shop`.
- The catalog starts empty: create categories → products → inventory in the admin panel.

## Tests and quality gates

| | API (`Freskinto-api`) | Web (`Freskinto-web`) |
|---|---|---|
| Unit / component tests | `bun run test` (Jest, mocked DB) | `bun run test` (Vitest + Testing Library + MSW) |
| Integration / e2e | `bun run test:e2e` (Supertest against the real `onlinemart_test` DB, run in band) | — |
| Lint | `bun run lint` (eslint **with `--fix`**) | `bun run lint` |
| Types | `bun run typecheck` | `bun run typecheck` (runs `next typegen` first) |
| Build | `bun run build` | `bun run build` |

Latest results are saved in [`notes/evidence/`](notes/evidence): API 185 unit + 95 e2e tests, web 60 tests,
lint/typecheck/build clean for both apps, the permission and duplicate-request runs (phases 17–18) and the four
critical browser workflows (phase 19).

## Scope

In scope and connected to the API: register/login, shop (search, category tree, price range, sort,
pagination), cart (debounced quantity updates), checkout (delivery with saved or new address, or pickup) and mock
payment, order history and detail (cancel, pay again), address book, and admin categories, products
(create/edit), inventory (opening stock, adjustments, stock history), orders (status workflow, cancel) and
customers (activate/deactivate).

Kept as **static mock pages** with sample data (not connected to the API): admin dashboard, brands (and the new
brand form), allergens, coupons, promotions, reviews, testimonials, notifications, settings, order board, stock
movements, `/forgot-password` and the home page "Loved locally" reviews section. In the admin these screens carry a
**Sample data** label and their action buttons show an "isn't connected yet" notice instead of pretending to save.
The admin profile shows the signed-in admin's real details; editing and password changes aren't connected.

## Deviations from the documents

**Product decisions**
- Duplicate orders are prevented by clearing the cart inside the order transaction (a repeat `POST /orders` gets
  `400 Cart is empty`) plus a disabled "Pay" button and a ref guard — **no idempotency key**. Docs 05, 08, 12, 13
  and 14 mention a "same key" / "checkout key `useRef`"; those mentions are superseded by this decision.
- Frontend env var is `NEXT_PUBLIC_BASE_URL` (doc 08 §14 also shows `NEXT_PUBLIC_API_URL`).
- Out-of-scope screens kept as static mocks (see Scope).

**API**
- PostgreSQL is published on host port 5433 (5432 is often already taken).
- Added `GET /admin/products/:id` (needed by the product edit page); Swagger lists 42 operations.
- Schema additions: `orders.customerNotes`, `users.lastLoginAt`, a `CancellationReason` enum (customer, admin and
  `PAYMENT_TIMEOUT` reasons) and a `product_sku_seq` sequence for race-safe SKUs.
- Categories are limited to 2 levels; a `categoryId` filter on products includes the category's children.
- Pickup time must be in the future; the cart minimum quantity is also enforced on `PATCH`.
- Payment idempotency uses a server-side key `${orderId}:${attempt}` (deterministic gateway reference); retries
  reuse the existing UNPAID payment.
- `POST /payments/:id/mock-complete` signs a gateway event and runs it through the same webhook handler in-process.
- Cancelling an unpaid order marks its open payment `CANCELED` after the commit (best effort).
- Rate limiting is applied to login/register only (10 requests/minute per IP).
- e2e tests truncate tables between suites instead of `prisma migrate reset`; Prisma uses the `prisma-client-js`
  generator with the `@prisma/adapter-pg` driver adapter.

**Web**
- The UI is branded **Freskinto** and uses the "Fresh in Motion" design (redesigned 2026-10-23): a mint-paper
  background with slowly drifting colour and film grain, white rounded cards, near-black ink text and one signature
  gradient (green → teal → sky) reserved for forward actions ("Add to basket", "Checkout", "Pay", "Sign in").
  Headings use Unbounded with Instrument Serif italic accent words; body text is Manrope. Products are
  background-free cutouts that float over a soft glow in their own colour.
- Motion: the home hero is a 3D orbit of real products around a glowing orb (mouse parallax, pauses on hover), the
  hero search types popular searches, aisle ribbons scroll across the page, aisle panels open on hover and sections
  rise in on scroll. Product cards tilt in 3D; adding to the basket flies the photo into the basket button; the
  photo morphs from the card into the product page (React `<ViewTransition>` with Next
  `experimental.viewTransition`); pages cross-fade; the theme toggle spreads the new theme in a circle; the checkout
  test card tilts (and turns red for "decline"); a fresh payment shows confetti. All of it respects
  `prefers-reduced-motion`, and nothing is hidden when JavaScript is off.
- Other interactive pieces: a ⌘K / Ctrl+K command palette with live product search (storefront and admin), an
  "Aisles" mega menu, tabbed product shelves, product quick view, accordion filters, a floating phone tab bar and a
  light/dark theme toggle. The admin uses the shadcn `Sidebar` (icon-collapse with ⌘B, sheet on phones) and an
  Overview dashboard with count-up KPI tiles and an orders-by-status chart (with a table view).
- shadcn/ui is the Base UI flavour (`base-nova`) with its tokens mapped onto the Freskinto design tokens in
  `Freskinto-web/src/app/globals.css` (light and `.dark` sets, all text pairs WCAG AA): ink `#0c1a14` primary on
  mint `#f3f6f1` (`#ecf2ee` on `#060a08` in dark mode), brand green `#12c08a` (`#047857` for green text); green,
  amber and red otherwise only for status. Fonts — Unbounded (display), Manrope (text), Instrument Serif italic
  (accent words), JetBrains Mono (codes, SKUs) — are self-hosted with `next/font/local`. Dark mode is class-based
  (`.dark` on `<html>`, chosen with the theme toggle and remembered in `localStorage`). The packshots in
  `public/images/cutouts` are background-free versions of the demo photos in `public/images/products` (purely
  presentational; a product with no matching photo shows its aisle icon). Customer copy uses UK English ("basket").
- No raw HTML elements in pages or feature components — enforced by ESLint (`no-restricted-syntax` in
  `Freskinto-web/eslint.config.mjs`): they compose shadcn/ui components and the layout/type primitives in
  `components/ui` (`Box`, `Flex`/`Stack`, `Grid`, `Container`, `Heading`, `Text`, `Form`), and every `className`
  goes through `cn()`. Only `components/ui` and the root layout (`<html>`/`<body>`) render HTML tags.
- The home page shows only real data and real store rules: no invented discounts, vouchers, "was" prices, live
  order feeds or ratings; totals always come from the server.
- Login: the Google button was removed (no external identity provider in scope); "Remember me" stores the
  session in `localStorage`, otherwise in `sessionStorage`.
- Removed the unused `AuthModal` and the `/admin/categories/create` page — categories are created and edited in a
  dialog.
- Products have no images or descriptions in scope. The storefront pairs product names with demo packshots by
  keyword (`Freskinto-web/src/lib/merchandising.ts`, photos in `public/images/products`) and shows the category icon
  when nothing fits, so a photo never misrepresents a product; the admin product form previews which photo will be
  used. Purely presentational — no data changes. The product form has three steps (Basics, Price & limits, Review);
  stock is managed on the Inventory page.
- Added a product page `/products/[id]` (not in the student page list) with a related-products rail. Shop filters
  live in the URL (`/shop?q=&category=&sort=&min=&max=&page=`) so header search suggestions, category links and
  back/forward all work. The basket opens as a drawer; phones get a bottom tab bar; checkout hides the store
  navigation (header, footer, tab bar) to stay enclosed.
- Customers never see category product counts: the API's `productCount` also counts inactive products, so the
  storefront shows sub-aisle names instead, and aisle shelves use their own product query's total.
- Components inside Suspense boundaries that render query data (the shop view) wait for hydration
  (`hooks/useHydrated.ts`), because data fetched by already-hydrated components would otherwise make the first
  client render differ from the server HTML.
- The admin Overview (`/admin`) uses live API counts (orders per status, customers, stock alerts, latest orders);
  its single-series bar chart uses `--chart-1` (validated for both themes) and has a table view.
- Shop sort options are the API whitelist (`newest`, `price_asc`, `price_desc`, `name_asc`); "Name Z→A" was
  dropped. Home "Just landed" shows the newest products (there is no popularity data).
- Checkout keeps the validated form in `sessionStorage` (`checkout_order_intent`); the payment page creates the
  order, starts the payment and completes it with a mock outcome (approve/decline) instead of a card form. If the
  payment cannot be started, the order is cancelled with reason `OTHER`. After paying, the customer lands on the
  order page (there is no separate `/order-confirmation` page in the student page list).
- `vite-tsconfig-paths` was replaced by Vite's built-in `resolve.tsconfigPaths`.

## Open questions

The open questions from [`FLOW-MD/01-business-logic.md`](FLOW-MD/01-business-logic.md) §23 are tracked in
[`notes/requirements.md`](notes/requirements.md#open-questions-01-23--is-project-mein-status) together with how
this project currently handles each one. **The instructor's answers are still pending** and need to be recorded
there.
