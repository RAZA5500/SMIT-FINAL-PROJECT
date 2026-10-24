import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // UI rule: pages aur feature components sirf shadcn/ui components compose karte hain —
    // raw HTML tags (div, span, button, a, img …) sirf `src/components/ui` ke primitives mein.
    files: ["src/**/*.tsx"],
    ignores: ["src/components/ui/**", "src/app/layout.tsx", "src/**/*.test.tsx", "src/test/**"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXOpeningElement[name.type='JSXIdentifier'][name.name=/^[a-z]/]",
          message:
            "No raw HTML elements outside src/components/ui — compose shadcn/ui components (Box, Flex, Grid, Text, Heading, Card, Button, Item …) instead.",
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "scripts/**",
  ]),
]);

export default eslintConfig;
