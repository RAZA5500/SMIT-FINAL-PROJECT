"use client";

import { Clock, FlaskConical, Mail, RotateCcw, Store, Truck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { Logo } from "@/components/shared/Logo";
import { customerRoutes, publicRoutes, shopUrl } from "@/lib/routes/routes";
import { useGetCategories } from "@/services/categories/queries";
import { useAuthStore } from "@/stores/auth-store";
import { buildCategoryTree } from "../shop/category-tree";
import { CATEGORY_LIST_LIMIT } from "./CategoryBar";
import { isCheckoutPath } from "./SiteHeader";

const CONTACT_EMAIL = "hello@freskinto.co.uk";
const YEAR = new Date().getFullYear();

/** Store ke asli rules (FLOW-MD 01): free shipping, pickup slot, 5 min payment window, cancel before packing */
const PROMISES = [
  { icon: Truck, title: "Free delivery", text: "On every order, no minimum spend." },
  { icon: Store, title: "Click & collect", text: "Pick a collection time at checkout." },
  { icon: Clock, title: "Quick to confirm", text: "Pay within 5 minutes to lock in your order." },
  { icon: RotateCcw, title: "Changed your mind?", text: "Cancel any time before we start packing." },
];

const LINK_CLASS = "text-sm text-muted-foreground transition-colors hover:text-brand";

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-sans text-xs font-semibold tracking-widest text-foreground uppercase">{title}</h2>
      <ul className="flex flex-col gap-2.5">{children}</ul>
    </div>
  );
}

export function SiteFooter() {
  const pathname = usePathname();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const { data } = useGetCategories({ limit: CATEGORY_LIST_LIMIT });
  const roots = useMemo(() => buildCategoryTree(data?.data ?? []).slice(0, 5), [data]);

  if (isCheckoutPath(pathname)) {
    return (
      <footer className="border-t bg-card py-6 text-center text-xs text-muted-foreground">
        © {YEAR} Freskinto · Need help? <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-brand hover:underline">{CONTACT_EMAIL}</a>
      </footer>
    );
  }

  const isCustomer = Boolean(token) && user?.role === "CUSTOMER";

  return (
    <footer className="border-t bg-muted text-foreground">
      <div className="border-b">
        <ul className="container-page grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {PROMISES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-start gap-3.5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white text-brand ring-1 ring-border">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="font-heading text-base font-semibold">{title}</span>
                <span className="text-sm text-muted-foreground">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="container-page grid gap-10 py-12 md:grid-cols-12">
        <div className="flex flex-col gap-4 md:col-span-5">
          <Link href={publicRoutes.home} aria-label="Freskinto home" className="w-fit rounded-lg">
            <Logo />
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Your neighbourhood market, online. Fresh produce, poultry, dairy and everyday essentials — delivered free
            or ready to collect.
          </p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex w-fit items-center gap-2 text-sm font-medium text-brand underline-offset-4 hover:underline">
            <Mail className="size-4" aria-hidden="true" />
            {CONTACT_EMAIL}
          </a>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:col-span-7 md:grid-cols-3">
          <FooterColumn title="Shop">
            <li>
              <Link href={shopUrl()} className={LINK_CLASS}>
                All products
              </Link>
            </li>
            {roots.map((root) => (
              <li key={root.id}>
                <Link href={shopUrl({ category: root.id })} className={LINK_CLASS}>
                  {root.name}
                </Link>
              </li>
            ))}
          </FooterColumn>
          <FooterColumn title="Your account">
            {isCustomer ? (
              <>
                <li>
                  <Link href={customerRoutes.orders} className={LINK_CLASS}>
                    My orders
                  </Link>
                </li>
                <li>
                  <Link href={customerRoutes.addresses} className={LINK_CLASS}>
                    Addresses
                  </Link>
                </li>
                <li>
                  <Link href={customerRoutes.cart} className={LINK_CLASS}>
                    Basket
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href={publicRoutes.login} className={LINK_CLASS}>
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link href={publicRoutes.register} className={LINK_CLASS}>
                    Create an account
                  </Link>
                </li>
              </>
            )}
          </FooterColumn>
          <FooterColumn title="Help">
            <li>
              <Link href={`${publicRoutes.home}#how-it-works`} className={LINK_CLASS}>
                How it works
              </Link>
            </li>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className={LINK_CLASS}>
                Contact us
              </a>
            </li>
          </FooterColumn>
        </nav>
      </div>

      <div className="border-t">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {YEAR} Freskinto. Prices in GBP.</p>
          <p className="inline-flex items-center gap-1.5">
            <FlaskConical className="size-3.5" aria-hidden="true" />
            Demo store — checkout uses a test payment gateway; no real cards are charged.
          </p>
        </div>
      </div>
    </footer>
  );
}
