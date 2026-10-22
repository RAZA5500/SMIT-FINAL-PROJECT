"use client";

import { Mail } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { STORE } from "@/constants/store";
import { customerRoutes, publicRoutes, shopUrl } from "@/lib/routes/routes";
import { useAisles } from "../shop/use-aisles";

const FOOTER_AISLE_LIMIT = 6;

const COLUMN_TITLE = "text-fs-11 font-semibold tracking-widest text-brand-green-vivid uppercase";
const FOOTER_LINK =
  "text-sm text-white/75 underline-offset-4 transition-colors outline-none hover:text-white hover:underline focus-visible:text-white focus-visible:underline";

/** Editorial footer — deep forest block, serif tagline; checkout par compact */
export function SiteFooter({ compact = false }: { compact?: boolean }) {
  const { aisles } = useAisles();

  if (compact) {
    return (
      <footer className="page-container py-8 text-center text-fs-13 text-muted-foreground">
        Need help with your order?{" "}
        <a href={`mailto:${STORE.supportEmail}`} className="font-medium text-brand-green underline-offset-4 hover:underline">
          {STORE.supportEmail}
        </a>
      </footer>
    );
  }

  return (
    <footer className="mt-20 bg-brand-green-forest text-white">
      <div className="page-container grid gap-12 py-14 md:grid-cols-12">
        <div className="flex flex-col gap-5 md:col-span-5">
          <Logo size="lg" inverse />
          <p className="max-w-sm font-display text-fs-24 leading-snug text-white/85 italic">{STORE.tagline}</p>
          <a
            href={`mailto:${STORE.supportEmail}`}
            className="inline-flex w-fit items-center gap-2 text-sm text-white/75 transition-colors hover:text-white"
          >
            <Mail aria-hidden="true" className="size-4" />
            {STORE.supportEmail}
          </a>
        </div>

        <nav aria-label="Aisles" className="flex flex-col gap-4 md:col-span-3">
          <h2 className={COLUMN_TITLE}>Aisles</h2>
          <ul className="flex flex-col gap-2.5">
            <li>
              <Link href={shopUrl()} className={FOOTER_LINK}>
                All products
              </Link>
            </li>
            {aisles.slice(0, FOOTER_AISLE_LIMIT).map((aisle) => (
              <li key={aisle.id}>
                <Link href={shopUrl({ category: aisle.id })} className={FOOTER_LINK}>
                  {aisle.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Account" className="flex flex-col gap-4 md:col-span-2">
          <h2 className={COLUMN_TITLE}>Account</h2>
          <ul className="flex flex-col gap-2.5">
            <li>
              <Link href={customerRoutes.orders} className={FOOTER_LINK}>
                My orders
              </Link>
            </li>
            <li>
              <Link href={customerRoutes.addresses} className={FOOTER_LINK}>
                Addresses
              </Link>
            </li>
            <li>
              <Link href={customerRoutes.profile} className={FOOTER_LINK}>
                Profile
              </Link>
            </li>
            <li>
              <Link href={publicRoutes.login} className={FOOTER_LINK}>
                Sign in
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex flex-col gap-4 md:col-span-2">
          <h2 className={COLUMN_TITLE}>Good to know</h2>
          <ul className="flex flex-col gap-2.5 text-sm text-white/75">
            <li>Free delivery on every order</li>
            <li>Click &amp; collect in 1 hour</li>
            <li>Pay within {STORE.paymentWindowMinutes} minutes</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="page-container flex flex-col items-start justify-between gap-2 py-5 text-fs-12 text-white/60 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {STORE.name}. All rights reserved.
          </p>
          <p>Demo store — payments are simulated, no real card is charged.</p>
        </div>
      </div>
    </footer>
  );
}
