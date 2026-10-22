"use client";

import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { ProductListing } from "@/components/customer/ProductListing";
import { useAisles } from "@/components/customer/shop/use-aisles";
import { publicRoutes, shopUrl } from "@/lib/routes/routes";
import { useGetProducts } from "@/services/products/queries";

const TABS = [
  { id: "all", label: "🔥 All Favourites", matcher: null },
  { id: "veg", label: "🥬 Fresh Vegetables", matcher: /veg|produce|salad|green/i },
  { id: "bakery", label: "🥖 Artisan Bakery", matcher: /bak|bread|pastr/i },
  { id: "meat", label: "🥩 Butcher Cuts", matcher: /meat|poultry|chicken|beef/i },
  { id: "dairy", label: "🥛 Dairy & Eggs", matcher: /dairy|milk|chees|egg/i },
];

export function HomeFeaturedProducts() {
  const [activeTab, setActiveTab] = useState("all");
  const { aisles } = useAisles();

  const selectedCategory = useMemo(() => {
    const current = TABS.find((t) => t.id === activeTab);
    if (!current?.matcher) return undefined;
    return aisles.find((a) => current.matcher!.test(a.name));
  }, [activeTab, aisles]);

  const { data, isLoading, isFetching } = useGetProducts({
    limit: 8,
    categoryId: selectedCategory?.id,
  });

  const products = data?.data ?? [];

  return (
    <section aria-labelledby="featured-heading" className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-fs-12 font-bold tracking-wider text-brand-green uppercase">
            Curated For Your Table
          </span>
          <h2 id="featured-heading" className="font-heading text-fs-28 font-bold tracking-tight text-foreground sm:text-fs-36">
            Seasonal Bestsellers
          </h2>
          <p className="text-fs-14 text-muted-foreground">
            Top-rated fresh goods ordered by your neighbours this week.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-4 py-2 text-fs-13 font-semibold transition-all outline-none ${
                  isActive
                    ? "bg-brand-green text-white shadow-soft"
                    : "border border-border bg-card text-foreground hover:border-brand-green/30 hover:bg-brand-soft"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid */}
      <ProductListing
        products={products}
        layout="grid"
        isLoading={isLoading}
        isFetching={isFetching}
        eagerCount={4}
      />

      <div className="flex justify-center pt-2">
        <ButtonLink
          href={selectedCategory ? shopUrl({ category: selectedCategory.id }) : publicRoutes.shop}
          variant="cta"
          size="lg"
          className="rounded-full px-8 shadow-soft"
        >
          <span>Explore all {selectedCategory?.name ?? "products"}</span>
          <ArrowRight aria-hidden="true" className="size-4" />
        </ButtonLink>
      </div>
    </section>
  );
}
