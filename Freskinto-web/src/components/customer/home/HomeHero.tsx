"use client";

import { ArrowRight, Check, CheckCircle2, Clock, LoaderCircle, Plus, Search, Sparkles, Store, Truck, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Price } from "@/components/shared/Price";
import { ProductImage } from "@/components/shared/ProductImage";
import { STORE } from "@/constants/store";
import { useDebounce } from "@/hooks/useDebounce";
import { packshotUrl } from "@/lib/merchandising";
import { loginUrl, publicRoutes, shopUrl } from "@/lib/routes/routes";
import { toastError, toastSuccess } from "@/lib/toast";
import { useAddCartItem } from "@/services/cart/mutations";
import { useGetProducts } from "@/services/products/queries";
import { useAuthStore } from "@/stores/auth-store";
import { useShopStore } from "@/stores/shop-store";

const POPULAR_SEARCHES = ["Apples", "Milk", "Chicken", "Sourdough", "Spinach", "Cheese"];

const PERKS = [
  { icon: Truck, title: "Free Delivery", text: "Every order, £0 minimum" },
  { icon: Store, title: "Click & Collect", text: "Ready in 1 hour" },
  { icon: Clock, title: "Pay In Minutes", text: `${STORE.paymentWindowMinutes} min guaranteed hold` },
  { icon: CheckCircle2, title: "100% Fresh", text: "Stall-to-fridge cold chain" },
];

interface CrateSet {
  id: string;
  tabLabel: string;
  items: {
    name: string;
    image: string;
    price: string;
    badge: string;
  }[];
}

const CRATE_TABS: CrateSet[] = [
  {
    id: "morning",
    tabLabel: "🌅 Morning Harvest",
    items: [
      { name: "Royal Gala Apples", image: "royal-gala-apples", price: "£2.40", badge: "Crisp & sweet" },
      { name: "Organic Baby Spinach", image: "organic-baby-spinach", price: "£1.85", badge: "Farm picked" },
      { name: "Fresh Whole Milk 1L", image: "fresh-whole-milk-1l", price: "£1.50", badge: "Cold-chain" },
      { name: "Whole Wheat Bread", image: "whole-wheat-bread-loaf", price: "£1.95", badge: "Baked today" },
    ],
  },
  {
    id: "bakery",
    tabLabel: "🥖 Artisan Bakes",
    items: [
      { name: "White Sourdough Loaf", image: "white-sourdough-loaf", price: "£2.80", badge: "36hr rise" },
      { name: "Butter Croissants", image: "rustic-artisan-loaf", price: "£2.20", badge: "Flaky & warm" },
      { name: "Whole Wheat Bread", image: "whole-wheat-bread-loaf", price: "£1.95", badge: "Stoneground" },
      { name: "Mature Cheddar Cheese", image: "mature-cheddar-cheese", price: "£2.95", badge: "Aged 12mo" },
    ],
  },
  {
    id: "greens",
    tabLabel: "🥬 Fresh Greens",
    items: [
      { name: "Organic Baby Spinach", image: "organic-baby-spinach", price: "£1.85", badge: "Picked dawn" },
      { name: "Crisp Romaine Lettuce", image: "crisp-romaine-lettuce", price: "£1.40", badge: "Crisp hearts" },
      { name: "Cherry Vine Tomatoes", image: "cherry-vine-tomatoes", price: "£1.75", badge: "Sweet on vine" },
      { name: "Royal Gala Apples", image: "royal-gala-apples", price: "£2.40", badge: "Orchard sweet" },
    ],
  },
];

export function HomeHero() {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const setCartOpen = useShopStore((state) => state.setCartOpen);
  const addItem = useAddCartItem({ silent: true });

  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeCrateTab, setActiveCrateTab] = useState(0);
  const [crateAdded, setCrateAdded] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query.trim(), 250);
  const isSearchEnabled = debouncedQuery.length >= 2;

  const { data: searchResults, isFetching: isSearching } = useGetProducts(
    { q: debouncedQuery, limit: 5 },
    isSearchEnabled,
  );

  const { data: allProductsData } = useGetProducts({ limit: 40 });
  const allProducts = allProductsData?.data ?? [];

  // Close search suggestions on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDropdownOpen(false);
    const trimmed = query.trim();
    if (trimmed) {
      router.push(shopUrl({ q: trimmed }));
    } else {
      router.push(publicRoutes.shop);
    }
  };

  const handleTrendingClick = (tag: string) => {
    setQuery(tag);
    setDropdownOpen(true);
  };

  const currentCrate = CRATE_TABS[activeCrateTab];

  const handleAddWholeCrate = async () => {
    if (!token || !user) {
      router.push(loginUrl(pathname));
      return;
    }
    if (user.role !== "CUSTOMER") {
      toastError("Shopping is for customers", "Admin accounts can't add items to a basket.");
      return;
    }

    try {
      for (const item of currentCrate.items) {
        const matched = allProducts.find((p) =>
          p.name.toLowerCase().includes(item.name.toLowerCase().split(" ")[0]),
        );
        const productIdToAdd = matched?.id ?? allProducts[0]?.id;
        if (productIdToAdd) {
          await addItem.mutateAsync({ productId: productIdToAdd, quantity: 1 });
        }
      }
      setCrateAdded(true);
      toastSuccess(`${currentCrate.tabLabel} added to basket!`, "4 fresh items added with free delivery.");
      setCartOpen(true);
      setTimeout(() => setCrateAdded(false), 3000);
    } catch {
      toastError("Couldn't add crate", "Please try adding individual items from the shop.");
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

          {/* Interactive Search Bar with Live Preview Dropdown */}
          <div ref={searchContainerRef} className="relative max-w-xl">
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center rounded-2xl border border-border bg-card p-1.5 shadow-lift transition-all focus-within:border-brand-green focus-within:ring-3 focus-within:ring-brand-green/20"
            >
              <div className="pl-3 text-muted-foreground">
                <Search className="size-4" aria-hidden="true" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setDropdownOpen(true);
                }}
                onFocus={() => {
                  if (query.trim().length >= 2) setDropdownOpen(true);
                }}
                placeholder="Search apples, sourdough, chicken fillets, milk…"
                aria-label="Search grocery items"
                className="flex-1 bg-transparent px-3 py-2.5 text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setDropdownOpen(false);
                  }}
                  className="p-1 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search query"
                >
                  <X className="size-4" />
                </button>
              )}
              <Button type="submit" variant="cta" size="lg" className="rounded-xl px-5 ml-1">
                {isSearching ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <>
                    <span>Find fresh</span>
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Live Interactive Search Results Dropdown */}
            {dropdownOpen && isSearchEnabled && (
              <div className="absolute top-full left-0 z-50 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-float backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-border/80 px-3 py-2 text-fs-11 font-bold text-muted-foreground uppercase">
                  <span>Matching items ({searchResults?.meta.total ?? 0})</span>
                  {isSearching && <span className="text-brand-green">Searching shelves…</span>}
                </div>

                <div className="flex max-h-72 flex-col divide-y divide-border/50 overflow-y-auto">
                  {searchResults?.data.map((item) => (
                    <div
                      key={item.id}
                      className="group flex items-center justify-between gap-3 p-2.5 transition-colors hover:bg-muted/60 rounded-xl"
                    >
                      <Link
                        href={publicRoutes.product(item.id)}
                        onClick={() => setDropdownOpen(false)}
                        className="flex min-w-0 flex-1 items-center gap-3"
                      >
                        <div className="size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                          <ProductImage name={item.name} categoryName={item.category.name} sizes="40px" />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <span className="truncate text-fs-13 font-bold text-foreground group-hover:text-brand-green">
                            {item.name}
                          </span>
                          <span className="truncate text-fs-11 text-muted-foreground">
                            {item.category.name}
                          </span>
                        </div>
                      </Link>

                      <div className="flex shrink-0 items-center gap-3">
                        <Price amount={item.price} size="sm" tone="brand" />
                        <Link
                          href={publicRoutes.product(item.id)}
                          onClick={() => setDropdownOpen(false)}
                          className="rounded-lg bg-brand-soft px-2.5 py-1 text-fs-11 font-bold text-brand-green hover:bg-brand-green hover:text-white transition-colors"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))}

                  {searchResults?.data.length === 0 && !isSearching && (
                    <div className="p-4 text-center text-fs-13 text-muted-foreground">
                      No matching items found for &ldquo;{debouncedQuery}&rdquo;. Press Enter to explore all shop results.
                    </div>
                  )}
                </div>

                <div className="border-t border-border/80 pt-2 text-center">
                  <ButtonLink
                    href={shopUrl({ q: debouncedQuery })}
                    variant="ghost"
                    size="sm"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full text-fs-12 font-bold text-brand-green hover:text-brand-green-dark"
                  >
                    View all results in Shop catalog →
                  </ButtonLink>
                </div>
              </div>
            )}
          </div>

          {/* Popular Tag Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-fs-12 text-muted-foreground">
            <span className="font-semibold text-foreground">Trending searches:</span>
            {POPULAR_SEARCHES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleTrendingClick(item)}
                className="rounded-full border border-border bg-card px-3 py-1 font-medium transition-colors hover:border-brand-green hover:bg-brand-soft hover:text-brand-green-dark"
              >
                {item}
              </button>
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

        {/* Right Column: Visual Interactive "Today's Harvest Spotlight" Preview Box */}
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

            {/* Interactive Crate Tabs */}
            <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {CRATE_TABS.map((crate, idx) => (
                <button
                  key={crate.id}
                  type="button"
                  onClick={() => setActiveCrateTab(idx)}
                  className={`rounded-full px-3 py-1 text-fs-11 font-bold whitespace-nowrap transition-all ${
                    activeCrateTab === idx
                      ? "bg-brand-green text-white shadow-soft"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {crate.tabLabel}
                </button>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {currentCrate.items.map((item) => (
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

            {/* Bottom 1-Click Crate Action */}
            <div className="mt-4 flex flex-col gap-2 rounded-xl bg-brand-soft p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-full bg-brand-green text-white">
                    <Truck className="size-3" />
                  </span>
                  <span className="text-fs-12 font-semibold text-foreground">
                    Free cold-chain delivery included
                  </span>
                </div>
                <ButtonLink href={publicRoutes.shop} variant="ghost" size="sm" className="h-6 text-fs-11 font-bold text-brand-green hover:text-brand-green-dark">
                  Shop all →
                </ButtonLink>
              </div>

              <Button
                type="button"
                variant="cta"
                size="sm"
                onClick={handleAddWholeCrate}
                className="w-full justify-center rounded-lg text-fs-12 font-bold shadow-soft"
              >
                {crateAdded ? (
                  <>
                    <Check className="size-3.5" />
                    <span>Crate added to basket!</span>
                  </>
                ) : (
                  <>
                    <Plus className="size-3.5" />
                    <span>Add {currentCrate.tabLabel.replace(/^[^\s]+\s*/, "")} to Basket</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
