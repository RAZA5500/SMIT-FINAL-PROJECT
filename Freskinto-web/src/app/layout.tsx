import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { STORE } from "@/constants/store";
import { THEME_INIT_SCRIPT } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import "./globals.css";
import { Providers } from "./providers/providers";

/* Self-hosted variable fonts (latin) — build bina network ke chalta hai */
const inter = localFont({
  src: "./fonts/inter-latin.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const jetbrains = localFont({
  src: "./fonts/jetbrains-mono-latin.woff2",
  variable: "--font-jetbrains",
  weight: "100 800",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${STORE.name} — ${STORE.tagline}`,
    template: `%s · ${STORE.name}`,
  },
  description:
    "Fresh produce, poultry, dairy and everyday essentials from your neighbourhood market — delivered free or ready to collect.",
  applicationName: STORE.name,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

/* Document shell — `<html>`/`<body>` Next.js root layout ki zaroorat hain */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      data-scroll-behavior="smooth"
      className={cn(inter.variable, jetbrains.variable)}
      suppressHydrationWarning
    >
      <body className={cn("flex min-h-dvh flex-col")} suppressHydrationWarning>
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
