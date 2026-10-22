"use client";

import { Flame, Sparkles, Timer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Price } from "@/components/shared/Price";
import { packshotUrl } from "@/lib/merchandising";
import { publicRoutes, shopUrl } from "@/lib/routes/routes";
import { useGetProducts } from "@/services/products/queries";
import { ProductCartControl } from "../product/ProductCartControl";

/** Real-time countdown calculation to midnight */
function getTimeRemaining() {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(23, 59, 59, 999);
  const diff = Math.max(0, midnight.getTime() - now.getTime());

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return {
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

export function HomeFlashDeals() {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining());
  const { data: productsData } = useGetProducts({ limit: 4, sortBy: "price_desc" });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dealProducts = productsData?.data.slice(0, 4) ?? [];

  return (
    <section id="deals" aria-labelledby="deals-heading" className="scroll-mt-header flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-amber-200/60 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent p-6 sm:flex-row sm:items-center sm:p-8">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-fs-12 font-bold tracking-wider text-amber-700 uppercase">
            <Flame aria-hidden="true" className="size-4 fill-amber-500 text-amber-500 animate-bounce" />
            Limited-Time Daily Drop
          </div>
          <h2 id="deals-heading" className="font-heading text-fs-28 font-bold tracking-tight text-foreground sm:text-fs-36">
            Today&apos;s Spotlight Deals
          </h2>
          <p className="text-fs-14 text-muted-foreground">
            Special pricing on market bestsellers — grab before today&apos;s allocation sells out!
          </p>
        </div>

        {/* Live Interactive Ticking Countdown */}
        <div className="flex items-center gap-2 rounded-2xl border border-amber-300/40 bg-card p-3 shadow-soft">
          <Timer aria-hidden="true" className="size-5 text-amber-600" />
          <div className="flex items-center gap-1.5 font-mono text-fs-18 font-bold text-foreground">
            <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-foreground">
              {timeLeft.hours}
            </span>
            <span className="text-muted-foreground">:</span>
            <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-foreground">
              {timeLeft.minutes}
            </span>
            <span className="text-muted-foreground">:</span>
            <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-foreground">
              {timeLeft.seconds}
            </span>
          </div>
          <span className="hidden text-fs-12 font-medium text-muted-foreground sm:inline pl-1">
            left today
          </span>
        </div>
      </div>

      {/* 4 Featured Deals Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {dealProducts.map((product, index) => {
          const discountPercent = [25, 20, 15, 30][index % 4];
          const claimedPercent = [82, 65, 91, 74][index % 4];
          const packshot = packshotUrl(
            product.name.toLowerCase().includes("chicken")
              ? "fresh-chicken-breast"
              : product.name.toLowerCase().includes("bread")
                ? "whole-wheat-bread-loaf"
                : product.name.toLowerCase().includes("cheese")
                  ? "mature-cheddar-cheese"
                  : "royal-gala-apples",
          );

          return (
            <article
              key={product.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-soft transition duration-200 hover:-translate-y-1 hover:border-amber-300 hover:shadow-lift"
            >
              {/* Discount Ribbon */}
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1 rounded-lg bg-amber-500 px-2 py-1 text-fs-11 font-extrabold text-white shadow-soft">
                <Sparkles aria-hidden="true" className="size-3" />
                <span>SAVE {discountPercent}%</span>
              </div>

              {/* Product Packshot */}
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-amber-50/50">
                <Image
                  src={packshot}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1024px) 250px, 50vw"
                  className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="mt-4 flex flex-1 flex-col gap-2">
                <span className="text-fs-11 font-bold tracking-wider text-muted-foreground uppercase">
                  {product.category.name}
                </span>

                <h3 className="line-clamp-1 font-heading text-fs-16 font-semibold">
                  <Link href={publicRoutes.product(product.id)} className="hover:text-brand-green">
                    {product.name}
                  </Link>
                </h3>

                <div className="flex items-baseline gap-2">
                  <Price amount={product.price} size="lg" tone="brand" />
                  <span className="text-fs-12 text-muted-foreground line-through">
                    £{(Number(product.price) * (1 + discountPercent / 100)).toFixed(2)}
                  </span>
                </div>

                {/* Progress bar of claimed stock */}
                <div className="mt-1 flex flex-col gap-1">
                  <div className="flex justify-between text-fs-11 font-medium text-muted-foreground">
                    <span>Claimed: {claimedPercent}%</span>
                    <span className="text-amber-700 font-semibold">Selling fast</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                      style={{ width: `${claimedPercent}%` }}
                    />
                  </div>
                </div>

                {/* Add to Basket */}
                <div className="mt-3 pt-1">
                  <ProductCartControl product={product} />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="flex justify-center pt-2">
        <ButtonLink href={shopUrl({ sort: "price_asc" })} variant="outline" size="lg" className="rounded-full">
          Browse all promotional prices in Shop →
        </ButtonLink>
      </div>
    </section>
  );
}
