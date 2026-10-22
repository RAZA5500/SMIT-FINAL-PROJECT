"use client";

import { ArrowRight, CheckCircle2, Clock, Sparkles, Store, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { STORE } from "@/constants/store";
import { packshotUrl } from "@/lib/merchandising";
import { publicRoutes, shopUrl } from "@/lib/routes/routes";

const POPULAR_SEARCHES = ["Apples", "Milk", "Chicken", "Sourdough", "Spinach", "Cheese"];

const PERKS = [
  { icon: Truck, title: "Free Delivery", text: "Every order, £0 minimum" },
  { icon: Store, title: "Click & Collect", text: "Ready in 1 hour" },
  { icon: Clock, title: "Pay In Minutes", text: `${STORE.paymentWindowMinutes} min guaranteed hold` },
  { icon: CheckCircle2, title: "100% Fresh", text: "Stall-to-fridge cold chain" },
];

const CRATE_PREVIEW = [
  { name: "Royal Gala Apples", image: "royal-gala-apples", price: "£2.40", badge: "Crisp & sweet" },
  { name: "Organic Baby Spinach", image: "organic-baby-spinach", price: "£1.85", badge: "Farm picked" },
  { name: "Fresh Whole Milk", image: "fresh-whole-milk-1l", price: "£1.50", badge: "Cold-chain" },
  { name: "Whole Wheat Bread", image: "whole-wheat-bread-loaf", price: "£1.95", badge: "Baked today" },
];

export function HomeHero() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(shopUrl({ q: trimmed }));
    } else {
      router.push(publicRoutes.shop);
    }
  };

  return (
    <section aria-labelledby="home-hero-heading" className="relative isolate overflow-hidden rounded-3xl bg-brand-soft">
      <div aria-hidden="true" className="texture-dots absolute inset-0 -z-10 text-brand-green/10" />
      <div aria-hidden="true" className="absolute -top-32 -right-32 -z-10 size-96 rounded-full bg-brand-green-light/20 blur-3xl pointer-events-none" />
      <div aria-hidden="true" className="absolute -bottom-32 -left-32 -z-10 size-96 rounded-full bg-brand-mint/40 blur-3xl pointer-events-none" />

      <div className="grid items-center gap-10 p-6 sm:p-10 lg:grid-cols-12 lg:gap-10 lg:p-14">
        {/* Left Column: Headlines & Interaction */}
        <div className="flex flex-col gap-6 lg:col-span-7">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-green/20 bg-card px-3.5 py-1 text-fs-12 font-semibold text-brand-green-dark shadow-soft">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              Open today · Farm fresh dispatch in 15 mins
            </span>
          </div>

          <h1 id="home-hero-heading" className="animate-fade-up font-heading text-fs-48 leading-tight font-extrabold tracking-tight text-foreground sm:text-fs-64">
            The freshest market,{" "}
            <span className="bg-brand-gradient bg-clip-text text-transparent">
              delivered straight to your door.
            </span>
          </h1>

          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            Organic fruit &amp; veg, butchery cuts, artisan bakes, and daily essentials sourced directly from local neighbourhood stalls. Free delivery on every order, or collect in 60 minutes.
          </p>

          {/* Interactive Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex max-w-xl items-center rounded-2xl border border-border bg-card p-1.5 shadow-lift transition-all focus-within:border-brand-green focus-within:ring-3 focus-within:ring-brand-green/20">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search apples, sourdough, chicken fillets, milk…"
              aria-label="Search grocery items"
              className="flex-1 bg-transparent px-4 py-2.5 text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none"
            />
            <Button type="submit" variant="cta" size="lg" className="rounded-xl px-5">
              <span>Find fresh</span>
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          </form>

          {/* Popular Tag Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-fs-12 text-muted-foreground">
            <span className="font-semibold text-foreground">Trending searches:</span>
            {POPULAR_SEARCHES.map((item) => (
              <Link
                key={item}
                href={shopUrl({ q: item })}
                className="rounded-full border border-border bg-card px-3 py-1 font-medium transition-colors hover:border-brand-green hover:bg-brand-soft hover:text-brand-green-dark"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <ButtonLink href={publicRoutes.shop} variant="cta" size="xl">
              <span>Shop full catalogue</span>
              <ArrowRight aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="#deals" variant="outline" size="xl" className="rounded-full bg-card">
              <Sparkles aria-hidden="true" className="text-amber-500" />
              <span>Today&apos;s flash deals</span>
            </ButtonLink>
          </div>

          {/* Key Value Perks Ticker */}
          <ul className="grid gap-4 border-t border-brand-green/10 pt-6 sm:grid-cols-2 xl:grid-cols-4">
            {PERKS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-card text-brand-green shadow-soft"
                >
                  <Icon className="size-4" />
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">{title}</span>
                  <span className="text-fs-12 text-muted-foreground">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column: Visual Interactive "Today's Harvest Crate" */}
        <div className="relative lg:col-span-5">
          <div className="relative mx-auto max-w-md rounded-3xl border border-border/80 bg-card p-5 shadow-lift sm:p-6">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Sparkles aria-hidden="true" className="size-4 text-brand-green" />
                <span className="text-fs-13 font-bold tracking-wider text-brand-green uppercase">
                  Today&apos;s Harvest Spotlight
                </span>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-fs-11 font-bold text-emerald-700">
                Freshly stocked
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {CRATE_PREVIEW.map((item) => (
                <Link
                  key={item.name}
                  href={shopUrl({ q: item.name })}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-brand-green/30 hover:shadow-lift"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-brand-soft/60">
                    <Image
                      src={packshotUrl(item.image)}
                      alt={item.name}
                      fill
                      priority
                      sizes="(min-width: 1024px) 180px, 40vw"
                      className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute top-2 left-2 rounded-md bg-card/90 px-1.5 py-0.5 text-fs-10 font-bold text-foreground backdrop-blur">
                      {item.badge}
                    </span>
                  </div>
                  <div className="mt-2.5 flex flex-col">
                    <span className="truncate text-fs-13 font-bold text-foreground group-hover:text-brand-green">
                      {item.name}
                    </span>
                    <span className="text-fs-12 font-extrabold text-brand-green-dark">
                      {item.price}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Bottom Guarantee Capsule */}
            <div className="mt-4 flex items-center justify-between rounded-xl bg-brand-soft p-3">
              <div className="flex items-center gap-2.5">
                <span className="flex size-7 items-center justify-center rounded-full bg-brand-green text-white">
                  <Truck className="size-3.5" />
                </span>
                <span className="text-fs-12 font-semibold text-foreground">
                  Free delivery on this crate
                </span>
              </div>
              <ButtonLink href={publicRoutes.shop} variant="ghost" size="sm" className="h-7 text-fs-11 font-bold text-brand-green hover:text-brand-green-dark">
                Shop all →
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
