import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { STORE } from "@/constants/store";
import { THEME_INIT_SCRIPT } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import "./globals.css";
import { Providers } from "./providers/providers";

/* Self-hosted variable fonts (latin, SIL OFL 1.1) — build bina network ke chalta hai */
const manrope = localFont({
  src: "./fonts/manrope-latin.woff2",
  variable: "--font-manrope",
  weight: "200 800",
  display: "swap",
});

/* Display headlines — Unbounded */
const unbounded = localFont({
  src: "./fonts/unbounded-latin.woff2",
  variable: "--font-unbounded",
  weight: "200 900",
  display: "swap",
});

/* Accent words inside headlines — Instrument Serif italic */
const instrumentSerif = localFont({
  src: "./fonts/instrument-serif-latin-italic.woff2",
  variable: "--font-instrument",
  weight: "400",
  style: "italic",
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
    { media: "(prefers-color-scheme: light)", color: "#f3f6f1" },
    { media: "(prefers-color-scheme: dark)", color: "#060a08" },
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
      className={cn(manrope.variable, unbounded.variable, instrumentSerif.variable, jetbrains.variable)}
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
