"use client";

import { ArrowUpRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAisles } from "@/components/customer/shop/use-aisles";
import { shopUrl } from "@/lib/routes/routes";

interface CuratedAisle {
  title: string;
  tagline: string;
  image: string;
  categoryMatcher: RegExp;
}

const CURATED_AISLES: CuratedAisle[] = [
  {
    title: "Fresh Vegetables",
    tagline: "Farm picked greens, carrots & bell peppers",
    image: "/images/editorial/produce-market.webp",
    categoryMatcher: /veg|produce|salad|green/i,
  },
  {
    title: "Orchard Harvest",
    tagline: "Crisp Gala apples, sweet bananas & berries",
    image: "/images/editorial/fruit-crates.webp",
    categoryMatcher: /fruit|citrus|orchard|appl/i,
  },
  {
    title: "Artisan Bakery",
    tagline: "Warm sourdough, wholemeal & morning pastries",
    image: "/images/editorial/artisan-bread.webp",
    categoryMatcher: /bak|bread|pastr|loaf/i,
  },
  {
    title: "Dairy & Cheeses",
    tagline: "Whole milk, cream, mozzarella & mature cheddar",
    image: "/images/editorial/cheese-board.webp",
    categoryMatcher: /dairy|milk|chees|egg|butter/i,
  },
  {
    title: "Butcher's Counter",
    tagline: "Lean beef steaks, mince & poultry fillets",
    image: "/images/editorial/chicken-packs.webp",
    categoryMatcher: /meat|poultry|chicken|beef|steak/i,
  },
  {
    title: "Pantry & Groceries",
    tagline: "Crisps, staples, olive oil & pantry reserves",
    image: "/images/editorial/produce-aisle.webp",
    categoryMatcher: /pantry|snack|cereal|chip/i,
  },
];

export function HomeAisles() {
  const { aisles } = useAisles();

  return (
    <section aria-labelledby="aisles-heading" className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-fs-12 font-bold tracking-wider text-brand-green uppercase">
            Aisles of Freshness
          </span>
          <h2 id="aisles-heading" className="font-heading text-fs-28 font-bold tracking-tight text-foreground sm:text-fs-36">
            Explore Market Stalls
          </h2>
          <p className="text-fs-14 text-muted-foreground">
            Hand-selected stalls offering produce picked this morning.
          </p>
        </div>
        <Link
          href={shopUrl()}
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green hover:text-brand-green-dark"
        >
          View all 12+ categories
          <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CURATED_AISLES.map((item) => {
          const matchedCategory = aisles.find((a) => item.categoryMatcher.test(a.name));
          const targetHref = matchedCategory ? shopUrl({ category: matchedCategory.id }) : shopUrl();
          const productCount = matchedCategory?.productCount ?? 12;

          return (
            <Link
              key={item.title}
              href={targetHref}
              className="group relative flex h-64 flex-col justify-end overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-lift"
            >
              {/* Background Image with subtle zoom */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Gradient Scrim for high contrast */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10 transition-opacity duration-300 group-hover:from-black/95"
              />

              <div className="relative z-10 flex flex-col gap-1 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-fs-11 font-bold tracking-widest text-emerald-300 uppercase">
                    Market Stall
                  </span>
                  <span className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-fs-10 font-bold backdrop-blur-sm">
                    <Sparkles className="size-3 text-amber-300" />
                    {productCount}+ fresh items
                  </span>
                </div>

                <h3 className="font-heading text-fs-22 font-bold leading-tight drop-shadow-sm">
                  {item.title}
                </h3>
                <p className="text-fs-13 text-white/80 line-clamp-1">
                  {item.tagline}
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 text-fs-12 font-bold text-white group-hover:text-emerald-300">
                  <span>Shop stall</span>
                  <ArrowUpRight aria-hidden="true" className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
