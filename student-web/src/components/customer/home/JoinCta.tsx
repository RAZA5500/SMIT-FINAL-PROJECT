"use client";

import { ArrowRight, Package } from "lucide-react";
import Link from "next/link";
import { LogoMark } from "@/components/shared/Logo";
import { buttonVariants } from "@/components/ui/button";
import { adminRoutes, customerRoutes, publicRoutes, shopUrl } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

/** Aakhri CTA — guest ko account, customer ko shop/orders, admin ko dashboard */
export function JoinCta() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const role = token ? user?.role : undefined;

  const content =
    role === "CUSTOMER"
      ? {
          title: `Ready for your next shop${user?.name ? `, ${user.name.split(" ")[0]}` : ""}?`,
          text: "Pick up where you left off — your basket is saved to your account.",
          primary: { label: "Continue shopping", href: shopUrl() },
          secondary: { label: "My orders", href: customerRoutes.orders },
        }
      : role === "ADMIN"
        ? {
            title: "Signed in as admin",
            text: "Manage the catalogue, stock and orders from your dashboard.",
            primary: { label: "Open dashboard", href: adminRoutes.dashboard },
            secondary: { label: "Browse the shop", href: shopUrl() },
          }
        : {
            title: "New to Freskinto?",
            text: "Create a free account in under a minute and start filling your first basket.",
            primary: { label: "Create a free account", href: publicRoutes.register },
            secondary: { label: "Sign in", href: publicRoutes.login },
          };

  return (
    <section className="container-page">
      <div className="relative isolate flex flex-col items-start gap-6 overflow-hidden rounded-3xl bg-brand-strong p-8 text-white sm:p-12 md:flex-row md:items-center md:justify-between">
        <div className="bg-dots absolute inset-0 -z-10 text-white/5" aria-hidden="true" />
        <LogoMark variant="inverse" className="absolute -right-10 -bottom-12 -z-10 size-56 rotate-12 opacity-20" />
        <div className="flex max-w-xl flex-col gap-2">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">{content.title}</h2>
          <p className="text-white/75">{content.text}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href={content.primary.href} className={cn(buttonVariants({ variant: "lime", size: "xl" }))}>
            {content.primary.label}
            <ArrowRight aria-hidden="true" />
          </Link>
          <Link href={content.secondary.href} className={buttonVariants({ variant: "glass", size: "xl" })}>
            {role === "CUSTOMER" && <Package aria-hidden="true" />}
            {content.secondary.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
