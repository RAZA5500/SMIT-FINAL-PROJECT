import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { STORE } from "@/constants/store";
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

const fraunces = localFont({
  src: [
    { path: "./fonts/fraunces-latin.woff2", weight: "100 900", style: "normal" },
    { path: "./fonts/fraunces-italic-latin.woff2", weight: "100 900", style: "italic" },
  ],
  variable: "--font-fraunces",
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
  themeColor: "#f8f9fc",
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
      className={cn(inter.variable, fraunces.variable, jetbrains.variable)}
      suppressHydrationWarning
    >
      <body className={cn("flex min-h-dvh flex-col")} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
