# Freskinto Web

Next.js 16 storefront + admin panel for Freskinto (the OnlineMart project). Setup, scripts, scope and deviations are
documented in the [root README](../README.md).

```bash
cp .env.example .env.local   # NEXT_PUBLIC_BASE_URL=http://localhost:4000/v1
bun install
bun run dev                  # http://localhost:3000
```

Folder conventions follow [FLOW-MD/07](../FLOW-MD/07-frontend-development-guide.md): pages compose views from their
colocated `(components)/` folder, API calls live in `src/services/<domain>/{index,types,queries,mutations}.ts`, form
schemas in `src/modules/zod/`, shared UI in `src/components/{ui,shared}`.

UI rules:

- **No raw HTML elements outside `src/components/ui`** — `bun run lint` fails on them (`no-restricted-syntax` in
  `eslint.config.mjs`). Pages and feature components compose shadcn/ui components plus the layout and type
  primitives in `components/ui` — `Box`, `Flex`/`Stack`, `Grid`, `Container`, `Heading`, `Text`, `Form`. Only the
  root layout renders `<html>` and `<body>`.
- **Every `className` goes through `cn()`** from `@/lib/utils` (tailwind-merge, aware of the custom shadow and
  animation tokens).
- Design tokens (clean & minimal: white surfaces, zinc-grey text and borders, one indigo `#4f46e5` accent, with a
  `.dark` set; Inter / JetBrains Mono) live in `src/app/globals.css`; brand name and support email in
  `src/constants/store.ts`. The theme toggle (`hooks/useTheme.ts`) puts `.dark` on `<html>`.
