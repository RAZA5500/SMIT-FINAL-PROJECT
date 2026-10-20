import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// FLOW-MD 12 §2: frontend unit/component tests — Vitest + Testing Library + MSW
export default defineConfig({
  plugins: [react()],
  // `@/*` alias tsconfig se — Vite 8 khud resolve karta hai (vite-tsconfig-paths ki zaroorat nahi)
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    css: false,
  },
});
