# student-web

Next.js 16 storefront + admin panel for OnlineMart. Setup, scripts, scope and deviations are documented in the
[root README](../README.md).

```bash
cp .env.example .env.local   # NEXT_PUBLIC_BASE_URL=http://localhost:4000/v1
bun install
bun run dev                  # http://localhost:3000
```

Folder conventions follow [FLOW-MD/07](../FLOW-MD/07-frontend-development-guide.md): pages compose views from their
colocated `(components)/` folder, API calls live in `src/services/<domain>/{index,types,queries,mutations}.ts`, form
schemas in `src/modules/zod/`, shared UI in `src/components/{ui,shared}`.
