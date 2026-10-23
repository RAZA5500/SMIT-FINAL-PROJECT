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
- Design tokens ("Fresh in Motion": mint paper, white cards, ink text, one green → teal → sky gradient for forward
  actions, with a `.dark` set; Unbounded / Manrope / Instrument Serif / JetBrains Mono) live in
  `src/app/globals.css`; brand name and support email in `src/constants/store.ts`. The theme toggle
  (`hooks/useTheme.ts`) puts `.dark` on `<html>` and reveals the new theme in a circle.
- Motion primitives live in `components/ui` — `Reveal` (scroll reveal), `Tilt` (3D hover tilt), `Marquee`,
  `NumberTicker`, `Aurora`, `HoverIndicator`, `CircularText`, `Confetti` and a guarded React `ViewTransition`.
  Content only starts hidden once the init script sets `data-motion="on"` (JavaScript on, no reduced motion).
