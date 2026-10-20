# API Reference

Do hisse: **Part 1** reference project (`api/`) ke actual endpoints [VERIFIED controllers se], **Part 2** student project ke liye target endpoints (spec).

Base: `/{URL_PREFIX}` (e.g. `/v1`). Auth column: P = public, C = CUSTOMER, A = ADMIN, Any = koi bhi logged-in.

## Part 1 — Reference project endpoints

### Health
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/health` | P | Liveness |

### User (`/user`) — class throttle USER 80/min
| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/auth/register` | P | `{ name, email, password, phone? }` → CUSTOMER (bcrypt hash) |
| POST | `/auth/login` | P | `{ email, password }` → `{ accessToken, user }` |
| GET | `/user/me` | C, A | Current profile |
| GET | `/user/me/stats` | C, A | `{ totalOrders, totalSpent, avgRating }` |
| POST | `/user/login` | C, A | 204; records lastLoginAt/IP |
| PUT | `/user` | C, A | `{ name?, phone? }`; phone 409 |
| DELETE | `/user` | C | 204; anonymize (email, phone, passwordHash) |
| GET | `/user/list` | A | search, role, isActive, includeDeleted, page, limit |
| PATCH | `/user/:id/status` | A | `{ isActive }`; self 400; target sirf CUSTOMER (warna 403) |
| POST/GET | `/user/address` | C, A | Create (201) / list (default first) |
| GET/PUT/DELETE | `/user/address/:id` | C, A | Ownership → 404 |
| PATCH | `/user/address/:id/default` | C, A | |
| POST/GET/PUT | `/user/preferences` | C, A | push/email toggles; POST 409 if exists |

### Categories (`/categories`)
| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/categories` | A | parentId?, bestCategory?, isActive? |
| GET | `/categories` | P | search, bestCategory, isActive, parentId, depth (csv), isLeaf, page, limit |
| GET | `/categories/:id` | P | |
| PATCH | `/categories/:id` | A | re-parent rules |
| DELETE | `/categories/:id` | A | 204; 409 if children/products |
| POST/DELETE | `/categories/:id/image` | A | multipart `image` ≤5 MB |

### Brands (`/brands`), Suppliers (`/suppliers`) — A
CRUD (`POST`, `GET`, `GET :id`, `PUT :id`, `DELETE :id`); brand logo `POST/DELETE /brands/:id/logo`.

### Products (`/products`)
| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/products` | A | see 01 §9 |
| GET | `/products` | P | q, categoryId, brandId, storageType, batchTracked, minPrice, maxPrice, sortBy, sortOrder, isActive, allergens, page, limit |
| GET | `/products/:id` | P | |
| PUT | `/products/:id` | A | partial update |
| DELETE | `/products/:id` | A | 204; 409 if referenced |
| POST | `/products/:id/images` | A | multipart files (≤3) + `sortOrders[]`, `isPrimaryIndex` |
| PATCH/DELETE | `/products/:productId/image/:imageId` | A | primary/alt/sortOrder |
| GET/POST | `/products/:id/allergens` | A | |
| PATCH/DELETE | `/products/:id/allergens/:allergenId` | A | |

### Inventory (`/inventory`) & Batches (`/batches`) — A
| Method | Path | Notes |
|---|---|---|
| GET | `/inventory` | search, stockStatus, page, limit |
| GET | `/inventory/available-products` | products bina inventory |
| GET | `/inventory/transactions` | q, productId, inventoryId, type, dateFrom, dateTo |
| GET | `/inventory/transactions/export` | CSV (one page) |
| GET/PATCH | `/inventory/:id` | PATCH: lowStockThreshold / batch expiry |
| POST | `/inventory` | `{ productId, qtyOnHand, lowStockThreshold?, batch? }` |
| POST | `/inventory/adjustments` | `{ inventoryId, batchId?, quantity≠0, reason, note? }` |
| POST | `/batches` | `{ inventoryId, qtyOnHand≥1, expiryDate }` |
| GET | `/batches` | productId, categoryId, status, expiryFrom, expiryTo |

### Cart (`/cart`) — C only (`CustomerOnlyGuard`)
| Method | Path | Notes |
|---|---|---|
| GET | `/cart` | get-or-create |
| POST | `/cart/items` | `{ productId, quantity≥1 }` increment |
| PUT | `/cart/items/:item_id` | `{ quantity≥0 }` (0 = remove) |
| DELETE | `/cart/items/:item_id` | 204 |
| DELETE | `/cart` | 204 clear |

### Orders (`/orders`)
| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/orders` | C | 201 PENDING/UNPAID |
| GET | `/orders` | C, A | own history: status, search, page, limit |
| GET | `/orders/:id` | C, A | own detail |
| PATCH | `/orders/:id/cancel` | C | `{ reason, note? }` PENDING/CONFIRMED only |
| GET | `/orders/admin` | A | status, paymentStatus, paymentMethod, dateFrom, dateTo, search, sortBy(date/amount/status), sortOrder |
| GET | `/orders/admin/summary` | A | counts by status |
| GET | `/orders/admin/export` | A | CSV page |
| GET | `/orders/admin/:id` | A | |
| PATCH | `/orders/admin/:id/status` | A | `{ status }` transition map |
| PATCH | `/orders/admin/:id/cancel` | A | `{ reason, note? }` |

### Payments
| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/payments/initiate` | C | `{ orderId }` → `{ clientSecret, paymentIntentId }` throttle 5/min |
| POST | `/webhooks/payments/stripe` | Stripe signature | queue; events succeeded/failed/canceled/charge.refunded |

### Reviews (`/reviews`)
| Method | Path | Auth |
|---|---|---|
| GET | `/reviews/my` | C |
| GET | `/reviews/product/:productId` | P (rating, sort newest/highest/lowest) |
| POST | `/reviews` | C (`{ orderItemId, rating 1-5, comment ≤1000 }`) |
| GET/PATCH/DELETE | `/reviews/:id` | C own |
| POST | `/reviews/:id/images`, DELETE `/reviews/:id/images/:imageId` | C own (≤5) |
| GET | `/reviews/admin`, `/reviews/admin/:id` | A |
| PATCH | `/reviews/admin/:id/status` (APPROVED/REJECTED), `/reviews/admin/:id/reply` | A |
| DELETE | `/reviews/admin/:id` | A |

### Others
| Method | Path | Auth |
|---|---|---|
| GET | `/notifications`, `/notifications/unread-count`, `/notifications/stream` (SSE) | C, A |
| PATCH | `/notifications/:id/read`, `/notifications/read-all` | C, A |
| GET | `/dashboard`, `/dashboard/export` | A |
| GET | `/audit-logs` | A |

---

## Part 2 — Student project target endpoints

| Method | Path | Auth | Body / Query | Success | Main errors | Retry safe |
|---|---|---|---|---|---|---|
| GET | `/health` | P | — | 200 | — | ✅ |
| POST | `/auth/register` | P | `{ name, email, password(8-72), phone? }` | 201 user | 409 email | ✅ (409) |
| POST | `/auth/login` | P | `{ email, password }` | 200 `{ accessToken, user }` | 401, 403 inactive | ✅ |
| GET | `/auth/me` | Any | — | 200 user | 401 | ✅ |
| GET | `/categories` | P | page, limit, parentId?, search? (active only) | 200 list | — | ✅ |
| GET | `/products` | P | page, limit, q, categoryId, minPrice, maxPrice, sortBy (`newest`/`price_asc`/`price_desc`/`name_asc`) | 200 list (active only, with stockStatus) | 400 min>max | ✅ |
| GET | `/products/:id` | P | — | 200 | 404 (inactive too) | ✅ |
| GET/POST | `/addresses` | C | `{ addressLine, city, county, postcode, isDefault? }` | 200 / 201 | 400 | POST ⚠️ |
| PATCH/DELETE | `/addresses/:id` | C | partial | 200 / 204 | 404 not own | ✅ |
| PATCH | `/addresses/:id/default` | C | — | 200 | 404 | ✅ |
| GET | `/cart` | C | — | 200 cart with totals | 403 admin | ✅ |
| POST | `/cart/items` | C | `{ productId, quantity≥1 }` | 200 cart | 400 stock/limits, 404 | ⚠️ increments |
| PATCH | `/cart/items/:id` | C | `{ quantity≥0 }` | 200 cart | 400, 404 | ✅ |
| DELETE | `/cart/items/:id`, `/cart` | C | — | 204 | 404 | ✅ |
| POST | `/orders` | C | `{ deliveryType, addressId? \| shippingAddress?, pickupScheduledAt?, customerNotes? }` | 201 order | 400, 404 | ⚠️ cart khali → 400 |
| GET | `/orders/me` | C | page, limit, status | 200 list | — | ✅ |
| GET | `/orders/me/:id` | C | — | 200 | 404 | ✅ |
| PATCH | `/orders/me/:id/cancel` | C | `{ reason, note? }` | 200 order | 400, 404, 409 | ✅ |
| POST | `/payments/initiate` | C | `{ orderId }` | 200 `{ paymentId, gatewayRef, amount }` | 404, 400 | ✅ existing UNPAID reuse |
| POST | `/payments/:id/mock-complete` | C | `{ outcome: "succeeded" \| "failed" }` | 200 `{ status }` | 404 | ✅ |
| POST | `/webhooks/payments/mock` | Signature (`x-signature` HMAC-SHA256) | `{ id, type, gatewayRef }` | 200 | 400 bad signature | ✅ |
| GET/POST | `/admin/categories` | A | `{ name, description?, parentId?, isActive? }` | 200/201 | 409, 400 depth | |
| PATCH/DELETE | `/admin/categories/:id` | A | partial | 200/204 | 409 has children/products | |
| GET/POST | `/admin/products` | A | list incl. inactive / create | 200/201 | 409, 400 | |
| PATCH | `/admin/products/:id` | A | partial | 200 | 409, 400 | |
| GET | `/admin/inventory` | A | page, limit, stockStatus, search | 200 | | |
| POST | `/admin/inventory` | A | `{ productId, qtyOnHand≥0, lowStockThreshold? }` | 201 | 409 exists | |
| POST | `/admin/inventory/adjustments` | A | `{ inventoryId, quantity≠0, reason, note? }` | 201 | 400 negative/reason | ⚠️ |
| GET | `/admin/inventory/:id/transactions` | A | page, limit | 200 | 404 | |
| GET | `/admin/orders` | A | page, limit, status, paymentStatus, search, dateFrom, dateTo | 200 | | |
| GET | `/admin/orders/:id` | A | — | 200 | 404 | |
| PATCH | `/admin/orders/:id/status` | A | `{ status }` | 200 | 400 transition, 409 race | ✅ |
| PATCH | `/admin/orders/:id/cancel` | A | `{ reason, note? }` | 200 | 400, 409 | ✅ |
| GET | `/admin/customers` | A | page, limit, search, isActive | 200 | | |
| PATCH | `/admin/customers/:id/status` | A | `{ isActive }` | 200 | 400 self/admin, 404 | ✅ |

Customer cancel reasons: `CHANGED_MIND, ORDERED_BY_MISTAKE, FOUND_BETTER_PRICE, DELIVERY_TOO_LONG, OTHER`. Admin: `CUSTOMER_REQUEST, OUT_OF_STOCK, PAYMENT_ISSUE, OTHER`. System: `PAYMENT_TIMEOUT`.
