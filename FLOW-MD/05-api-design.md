# 05 — REST API Design

## 1. Base URL aur prefix

[VERIFIED] Global prefix env `URL_PREFIX` se (`app.setGlobalPrefix`), deployment mein `v1` — e.g. `https://<host>/v1/orders`. Swagger non-production mein `/v1/openapi`.

## 2. Resource-oriented URLs

| Kaam | Method | URL | Status |
|---|---|---|---|
| List | GET | `/products?page=1&limit=10&q=apple` | 200 |
| Detail | GET | `/products/:id` | 200 / 404 |
| Create | POST | `/products` | 201 |
| Full/partial update | PUT / PATCH | `/products/:id` | 200 |
| Delete | DELETE | `/products/:id` | 204 |
| Sub-resource | POST | `/products/:id/images` | 201 |
| Action on resource | PATCH | `/orders/:id/cancel`, `/admin/customers/:id/status` | 200 |

**Original mein dekhi gayi inconsistencies** (student project mein theek karein):

| Original | Masla | Behtar |
|---|---|---|
| `GET /user/list` | verb-like path | `GET /users` |
| `POST /user/login` | login record | `POST /auth/login` |
| `PUT /products/:id` partial update ke liye | PUT semantics = full replace | `PATCH /products/:id` |
| `/orders/admin/...` aur `/admin/...` dono styles | ek convention | Admin routes ek prefix `/admin/...` ke neeche |

## 3. Status codes

| Code | Kab |
|---|---|
| 200 | Successful read / update / action |
| 201 | Resource create |
| 204 | Delete / koi body nahi (`DELETE /cart`, `POST /user/login`) |
| 400 | Validation fail ya business rule toota (`Not enough stock`) |
| 401 | Token missing / invalid / expired |
| 403 | Authenticated lekin allowed nahi (role, inactive, email unverified) |
| 404 | Resource nahi mila **ya doosre user ka hai** (existence leak na ho) |
| 409 | Unique conflict, concurrent status change |
| 429 | Rate limit |
| 500 | Unexpected — generic message, detail sirf server log |

## 4. Request / response format

- JSON body, `Content-Type: application/json`; file uploads `multipart/form-data`.
- Dates ISO-8601 UTC strings.
- **Money hamesha string** 2 decimals (`"12.50"`) — float rounding se bachne ke liye [VERIFIED mappers].
- Enum values UPPER_SNAKE (`READY_FOR_DELIVERY`).

### Paginated list shape [VERIFIED `common/pagination/pagination.helper.ts`]

```json
{
  "data": [ { "id": "...", "orderNumber": "ORD-2026-000012", "total": "24.90" } ],
  "meta": { "total": 57, "currentPage": 2, "limit": 10, "pages": 6, "hasNextPage": true, "hasPrevPage": true }
}
```

> Original mein list key module ke hisaab se badalti hai (`data`, `products`, `users`, `items`, `transactions`). Student project mein **hamesha `data` + `meta`** rakhein.

### Error shape

```json
{ "statusCode": 400, "message": "Not enough stock. Requested: 3, Available: 1.", "error": "Bad Request" }
```

Validation error mein `message` array hota hai: `["quantity must not be less than 1"]`. Frontend dono handle karta hai (`web-app/src/lib/networking/request.ts extractApiMessage`).

## 5. Query parameters

| Param | Rule |
|---|---|
| `page` | int ≥1, default 1 |
| `limit` | int 1–100, default 10 (kuch admin lists 20) |
| `search` / `q` | trimmed, case-insensitive `contains` |
| filters | enums validated (`status`, `paymentStatus`, `stockStatus`) |
| `sortBy` + `sortOrder` | whitelist (`@IsIn([...])`) — kabhi raw column name mat lo |
| `dateFrom` / `dateTo` | ISO; `dateFrom > dateTo` → 400 |

## 6. Headers

| Header | Kahan |
|---|---|
| `Authorization: Bearer <token>` | Har protected route |
| `stripe-signature` | Webhook (original) / `x-signature` (student mock webhook) |

CORS [VERIFIED `main.ts`]: allowed origins list, `credentials: true`, allowed headers `Content-Type, Authorization, Accept`.

## 7. Endpoint documentation template

Har endpoint ke liye students yeh likhein (example):

```
POST /orders
Auth: CUSTOMER
Body: { deliveryType: "DELIVERY"|"PICKUP", addressId?: uuid, shippingAddress?: {...}, pickupScheduledAt?: ISO, customerNotes?: string ≤500 }
201: { id, orderNumber, status: "PENDING", paymentStatus: "UNPAID", subtotal, total, paymentExpiresAt, ... }
400: Cart is empty | Not enough stock | Delivery orders require an address
404: Address not found
Side effects: stock deduct, cart clear
Safe to retry: YES (same key)
```

Poori list: [api-reference.md](api-reference.md).

## 8. API design rules (checklist)

1. Har collection endpoint paginated.
2. Path params `@IsUUID()` se validate (`ParseUUIDPipe` ya param DTO).
3. Response mein DB internals nahi (`passwordHash`, `lastLoginIp`, raw Decimal objects).
4. POST har kaam ke liye nahi — state change = PATCH, delete = DELETE.
5. Customer-scoped endpoints user id URL se nahi lete (`GET /orders` = "meri orders").
6. Webhooks public lekin signature-verified, aur jaldi 200 return.
