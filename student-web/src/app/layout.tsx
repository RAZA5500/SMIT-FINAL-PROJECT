import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
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

const bricolage = localFont({
  src: "./fonts/bricolage-grotesque-latin.woff2",
  variable: "--font-bricolage",
  weight: "200 800",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Freskinto — Fresh groceries, delivered",
    template: "%s · Freskinto",
  },
  description:
    "Fresh produce, poultry, dairy and everyday essentials — delivered free to your door or ready to collect.",
  applicationName: "Freskinto",
};

export const viewport: Viewport = {
  themeColor: "#0a3f25",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      data-scroll-behavior="smooth"
      className={cn(inter.variable, bricolage.variable)}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
