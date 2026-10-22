import { ArrowRight, Check, Clock, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { packshotUrl } from "@/lib/merchandising";
import { shopUrl } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";

const POPULAR_SEARCHES = ["Bananas", "Chicken", "Milk", "Bread", "Spinach"];

const TRUST = ["Free delivery on every order", "Click & collect", "Cancel before we pack"];

/** Floating packshot cards — position + size + float delay per card */
const PACKSHOTS = [
  { image: "premium-bananas", alt: "Bananas", className: "top-1/16 left-1/12 w-1/3 -rotate-6", delay: "0s" },
  { image: "fresh-whole-milk-1l", alt: "Fresh milk", className: "top-0 right-1/10 w-2/7 rotate-5", delay: "1.2s" },
  { image: "fresh-bell-peppers", alt: "Bell peppers", className: "top-3/8 left-3/10 z-10 w-2/5 rotate-2", delay: "0.6s" },
  { image: "whole-wheat-bread-loaf", alt: "Bread loaf", className: "bottom-1/25 left-1/50 w-3/10 rotate-4", delay: "1.8s" },
  { image: "fresh-chicken-breast", alt: "Chicken breast", className: "right-1/25 bottom-1/12 w-1/3 -rotate-4", delay: "2.4s" },
];

export function HeroSection() {
  return (
    <section className="container-page pt-4 sm:pt-6">
      <div className="relative isolate overflow-hidden rounded-3xl bg-muted text-foreground sm:rounded-4xl">
        <div className="bg-dots absolute inset-0 -z-10 text-foreground/5" aria-hidden="true" />
        <div className="absolute -top-24 -right-24 -z-10 size-96 rounded-full bg-white blur-3xl" aria-hidden="true" />

        <div className="grid items-center gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-6 px-6 pt-10 pb-2 sm:px-10 sm:pt-14 lg:py-20 lg:pr-0 lg:pl-14">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-brand ring-1 ring-border">
              <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />
              Fresh groceries, delivered free
            </span>
            <h1 className="font-display text-4xl leading-none font-bold sm:text-5xl xl:text-6xl">
              Your <span className="text-brand">fresh market</span>, delivered to your door.
            </h1>
            <p className="max-w-lg text-base text-muted-foreground sm:text-lg">
              Fruit &amp; veg, poultry, dairy and everyday essentials. Free delivery on every order — or click &amp;
              collect when it suits you.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link href={shopUrl()} className={cn(buttonVariants({ size: "xl" }), "shadow-glow")}>
                Start shopping
                <ArrowRight aria-hidden="true" />
              </Link>
              <Link href="#how-it-works" className={buttonVariants({ variant: "outline", size: "xl" })}>
                How it works
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Popular:</span>
              {POPULAR_SEARCHES.map((term) => (
                <Link
                  key={term}
                  href={shopUrl({ q: term })}
                  className="rounded-full bg-white px-3 py-1 text-xs font-medium text-foreground ring-1 ring-border transition-colors hover:text-brand hover:ring-brand"
                >
                  {term}
                </Link>
              ))}
            </div>

            <ul className="flex flex-wrap gap-x-5 gap-y-2 border-t border-foreground/10 pt-5">
              {TRUST.map((item) => (
                <li key={item} className="inline-flex items-center gap-2 text-sm text-foreground/80">
                  <span className="flex size-5 items-center justify-center rounded-full bg-brand text-white">
                    <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md lg:max-w-none" aria-hidden="true">
      <div className="absolute inset-1/8 rounded-full bg-white" />
      <div className="absolute inset-2/9 rounded-full border-2 border-dashed border-foreground/10" />
      {PACKSHOTS.map((shot) => (
        <div
          key={shot.image}
          className={cn("absolute aspect-square animate-float", shot.className)}
          style={{ animationDelay: shot.delay }}
        >
          <div className="relative size-full overflow-hidden rounded-3xl bg-white shadow-lift ring-1 ring-black/5">
            <Image
              src={packshotUrl(shot.image)}
              alt={shot.alt}
              fill
              loading="eager"
              sizes="(min-width: 1024px) 200px, 30vw"
              className="object-contain p-2"
            />
          </div>
        </div>
      ))}

      <div className="absolute bottom-3/10 -left-1 hidden items-center gap-2.5 rounded-2xl bg-white px-3.5 py-2.5 text-foreground shadow-lift sm:flex lg:-left-6">
        <span className="flex size-9 items-center justify-center rounded-xl bg-brand-soft text-brand">
          <Truck className="size-5" />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-sm font-semibold">Free delivery</span>
          <span className="text-xs text-muted-foreground">on every order</span>
        </span>
      </div>
      <div className="absolute top-3/10 right-1 hidden items-center gap-2.5 rounded-2xl bg-white px-3.5 py-2.5 text-foreground shadow-lift sm:flex">
        <span className="flex size-9 items-center justify-center rounded-xl bg-saffron-soft text-warning">
          <Clock className="size-5" />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-sm font-semibold">Click &amp; collect</span>
          <span className="text-xs text-muted-foreground">at a time you choose</span>
        </span>
      </div>
    </div>
  );
}
