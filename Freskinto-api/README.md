# Freskinto API

NestJS 11 REST API (`/v1`) for Freskinto (the OnlineMart project). Setup, environment variables, scripts and
deviations are documented in the [root README](../README.md).

```bash
cp .env.example .env    # fill in JWT_SECRET (32+ chars), PAYMENT_WEBHOOK_SECRET, ADMIN_*
bun install             # runs prisma generate
bun run db:deploy && bun run db:seed
bun run start:dev       # http://localhost:4000/v1 — Swagger at /v1/docs
```

Modules follow [FLOW-MD/04](../FLOW-MD/04-backend-development-guide.md): DTO → controller → service → db service →
mapper, with orders and payments split into focused services (creation, cancellation, status, query, payments,
webhook, refund) and crons for payment timeout and refund retry.
