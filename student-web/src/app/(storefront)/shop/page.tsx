"use client";

import React, { useMemo, useState } from "react";
import { PRODUCTS } from "@/data/products";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/customer/ProductCard";
import CartPanel from "@/components/customer/shop/CartPanel";
import ShopFilters, {
  PRICE_CEILING,
  PRICE_FLOOR,
  ShopFilterState,
} from "@/components/customer/shop/ShopFilters";
import { CATEGORY_TREE, CategoryNode } from "@/data/products";

const SEARCH_INPUT_CLASS =
  "min-w-0 rounded-md border px-2 py-0.5 transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-xs/relaxed file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30 bg-gray-50 border-t pl-10 pr-3 rounded-10 w-full text-neutral-gray text-xs md:text-sm placeholder:text-xs md:placeholder:text-sm h-12 border-gray-300";

/** Selecting a branch of the tree includes everything filed beneath it. */
function descendantsOf(name: string): string[] {
  const found: string[] = [];
  const walk = (nodes: CategoryNode[], collecting: boolean) => {
    for (const n of nodes) {
      const take = collecting || n.name === name;
      if (take) found.push(n.name);
      if (n.children) walk(n.children, take);
    }
  };
  walk(CATEGORY_TREE, false);
  return found;
}

export default function ShopPage() {
  const { cart, addToCart, removeFromCart } = useCart();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<ShopFilterState>({
    category: null,
    minPrice: PRICE_FLOOR,
    maxPrice: PRICE_CEILING,
    sort: null,
  });

  const handleQuantityChange = (id: string, delta: number) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, (prev[id] || 1) + delta) }));
    if (delta < 0 && cart[id]) removeFromCart(id);
  };

  const handleAddToCart = (id: string) => {
    const qty = quantities[id] || 1;
    for (let i = 0; i < qty; i++) addToCart(id);
  };

  const visible = useMemo(() => {
    const allowed = filters.category ? new Set(descendantsOf(filters.category)) : null;
    const term = search.trim().toLowerCase();

    const list = PRODUCTS.filter((p) => {
      if (allowed && !allowed.has(p.category)) return false;
      if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;
      if (term && !p.name.toLowerCase().includes(term)) return false;
      return true;
    });

    switch (filters.sort) {
      case "price-asc":
        return [...list].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...list].sort((a, b) => b.price - a.price);
      case "name-asc":
        return [...list].sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return [...list].sort((a, b) => b.name.localeCompare(a.name));
      default:
        return list;
    }
  }, [filters, search]);

  const patchFilters = (next: Partial<ShopFilterState>) =>
    setFilters((prev) => ({ ...prev, ...next }));

  return (
    <div className="mt-23">
      <div className="flex bg-white min-h-[calc(100vh-5.75rem)]">
        <main className="flex-1 min-w-0">
          <div className="pt-5 pb-10 pl-6 lg:pl-10 pr-6 shop-container scrollbar-hide">
            <div className="flex items-start gap-6">
              <aside className="w-52 shrink-0 hidden shop:block">
                <ShopFilters state={filters} onChange={patchFilters} />
              </aside>

              <div className="flex flex-col flex-1 gap-5 min-w-0">
                <div className="flex items-center gap-3">
                  <div className="relative flex flex-1 items-center">
                    <div className="left-3 absolute z-10">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-gray-400"
                      >
                        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                        <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <input
                      data-slot="input"
                      type="text"
                      placeholder="Search for products..."
                      className={SEARCH_INPUT_CLASS}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className="shop:hidden inline-flex items-center gap-2 bg-brand-green h-12 px-4 rounded-lg font-inter font-medium text-fs-12 text-white leading-none shrink-0"
                  >
                    Filter
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                    </svg>
                  </button>
                </div>

                <section>
                  <div>
                    <div className="grid shop-product-grid gap-5">
                      {visible.map((p) => (
                        <ProductCard
                          key={p.id}
                          product={p}
                          variant="shop"
                          quantity={quantities[p.id] || 1}
                          onQuantityChange={handleQuantityChange}
                          onAddToCart={handleAddToCart}
                        />
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>

        <aside className="hidden lg:flex flex-col w-100 shrink-0 pr-6 pt-5">
          <div className="sticky top-28 h-[calc(100vh-8.5rem)] flex flex-col overflow-hidden rounded-15 border border-gray-200 bg-white shadow-card">
            <CartPanel />
          </div>
        </aside>
      </div>
    </div>
  );
}
