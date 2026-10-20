# 10 — Security Best Practices

## 1. Original mein kya achha hai [VERIFIED]

| Control | Kahan |
|---|---|
| `helmet` (frameguard deny, noSniff, referrer no-referrer, HSTS + CSP production mein) | `api/src/main.ts` |
| CORS allow-list + specific headers | `main.ts` |
| JWT verify (signature + expiry) + DB `isActive` har request | `jwt-auth.guard.ts` |
| Passwords bcrypt hash, generic login error | `auth.service.ts` |
| Mass assignment block (`forbidNonWhitelisted`) | `main.ts` |
| Ownership scoping (orders, addresses, cart, reviews) | db services |
| Rate limiting (payment 5/min, order 20/min) | `rate-limit.config.ts` |
| Upload validation by **magic bytes** (file-type), size limits (image 5 MB, video 10 MB) | `common/pipes/*` |
| Stripe webhook signature (raw body) | `stripe-webhook.controller.ts` |
| Server prices (client amount trust nahi) | `order.db.service.ts`, `payment.service.ts` |
| Server-only secrets (`import "server-only"`) | `web-app/src/modules/config/server-config.ts` |
| Generic 500 errors | exception filter |
| Account deletion = anonymize (PII hata kar) | `user.db.service.ts` |

## 2. Risks jo review mein mile

| # | Risk | Severity | Fix |
|---|---|---|---|
| R1 | Public product endpoints inactive products bhi return karte hain (filter frontend par) | Medium | Server-side `isActive/isVisible` force |
| R2 | Auth opt-in (`@Auth()` per route) — naya route bhool se public | Medium | Global guard + `@Public()` |
| R3 | Throttler in-memory | Low/Med | Redis storage multi-instance par |
| R4 | `$executeRawUnsafe` (batch ids DB se aate hain, user input nahi) | Low | Parameterized query / `Prisma.join` |
| R5 | Stripe debug `console.log` webhook secret ka prefix print karta hai (`webhookSecretPrefix`) | Medium | Secrets ka koi hissa log na karein |
| R6 | Local `.env` files mein real keys (service account private key, Stripe secret) maujood hain | High agar commit hon | `.gitignore` verify karein, keys rotate karein, `.env.example` sirf placeholders |
| R7 | Customer email-verification cutoff date frontend mein hardcoded | Low | Backend rule (already enforce hota hai) |
| R8 | Redis TLS `rejectUnauthorized: false` | Medium | Proper CA verify |

> Is documentation mein koi real secret value copy nahi ki gayi.

## 3. Student project security checklist

### Authentication
- [ ] bcrypt (cost ≥12), password max 72 chars.
- [ ] Generic login error ("Invalid email or password").
- [ ] Login/register rate limit (10/min per IP).
- [ ] `JWT_SECRET` ≥32 random chars, env se; expiry set.
- [ ] Har request par DB se user + `isActive` + role.

### Authorization
- [ ] Global JWT guard, `@Public()` sirf catalog + auth + webhook.
- [ ] `@Roles('ADMIN')` saare `/admin/*` par.
- [ ] Har customer query `userId` scoped; doosre user ka id → 404.
- [ ] Single admin: DB partial unique index + register mein role field nahi.

### Input
- [ ] Har DTO, `whitelist` + `forbidNonWhitelisted`.
- [ ] UUID params validate.
- [ ] Sort/filter fields whitelist (`@IsIn`).
- [ ] Raw SQL sirf tagged templates.

### Money & orders
- [ ] Prices aur totals server calculate kare.
- [ ] Payment amount server ka `order.total`.
- [ ] Webhook signature verify (HMAC-SHA256, `timingSafeEqual`).

### Data exposure
- [ ] Mappers `passwordHash` kabhi return na karein (unit test likhein).
- [ ] Errors mein stack/SQL nahi.
- [ ] Logs mein password/token/full card data nahi.

### Configuration
- [ ] `.env` gitignored; `.env.example` placeholders ke saath.
- [ ] CORS sirf frontend origin.
- [ ] `helmet` on.
- [ ] Swagger production mein off.

### Frontend
- [ ] Secrets kabhi `NEXT_PUBLIC_*` mein nahi.
- [ ] `dangerouslySetInnerHTML` avoid (XSS).
- [ ] Token storage trade-off samjhein: localStorage XSS se chori ho sakta hai; httpOnly cookie behtar lekin CSRF protection chahiye. Student scope: localStorage + short expiry + strict CSP **[RECOMMENDED]** production ke liye httpOnly cookie.

## 4. File uploads (agar optional feature banayein)

1. Size limit Multer level par (`limits.fileSize`).
2. MIME extension se nahi, **content (magic bytes)** se check.
3. Random file name (`randomBytes`), user ka filename path mein nahi.
4. Upload → DB persist; DB fail ho to uploaded file delete (`FileUploadService.uploadAndPersist`).
5. Private files ke liye signed URLs.

## 5. Common vulnerabilities aur bachao

| Vulnerability | Bachao |
|---|---|
| SQL injection | Prisma parameterized queries |
| IDOR | `userId` scoping |
| Mass assignment | Whitelisted DTOs |
| Brute force / enumeration | Rate limits, generic errors |
| XSS | React escaping, no raw HTML, CSP |
| CSRF | Bearer header auth (cookie use karein to SameSite + CSRF token) |
| Replay / double charge | Webhook signature + status guards |
| Privilege escalation | Role server-side, single-admin constraint |
