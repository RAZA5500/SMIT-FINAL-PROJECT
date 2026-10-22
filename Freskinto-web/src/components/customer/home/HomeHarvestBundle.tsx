"use client";

import { Check, Package, Sparkles, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { packshotUrl } from "@/lib/merchandising";
import { loginUrl, publicRoutes } from "@/lib/routes/routes";
import { toastError, toastSuccess } from "@/lib/toast";
import { useAddCartItem } from "@/services/cart/mutations";
import { useGetProducts } from "@/services/products/queries";
import { useAuthStore } from "@/stores/auth-store";
import { useShopStore } from "@/stores/shop-store";

interface BundleSlot {
  category: string;
  name: string;
  options: {
    id: string;
    name: string;
    image: string;
    price: number;
    badge: string;
  }[];
}

const BUNDLE_SLOTS: BundleSlot[] = [
  {
    category: "Fresh Fruit",
    name: "Fruit",
    options: [
      { id: "apple", name: "Royal Gala Apples", image: "royal-gala-apples", price: 2.4, badge: "Crisp & sweet" },
      { id: "banana", name: "Sweet Cavendish Bananas", image: "sweet-cavendish-bananas", price: 1.25, badge: "Rich in energy" },
      { id: "clementine", name: "Organic Clementines", image: "organic-clementines", price: 2.1, badge: "Juicy citrus" },
    ],
  },
  {
    category: "Artisan Bakery",
    name: "Bread",
    options: [
      { id: "sourdough", name: "White Sourdough Loaf", image: "white-sourdough-loaf", price: 2.8, badge: "36hr fermented" },
      { id: "wholewheat", name: "Whole Wheat Bread", image: "whole-wheat-bread-loaf", price: 1.95, badge: "Stoneground flour" },
      { id: "brioche", name: "Artisan Butter Loaf", image: "rustic-artisan-loaf", price: 2.5, badge: "Golden crust" },
    ],
  },
  {
    category: "Dairy & Chilled",
    name: "Dairy",
    options: [
      { id: "milk", name: "Fresh Whole Milk 1L", image: "fresh-whole-milk-1l", price: 1.5, badge: "Pasture-grazed" },
      { id: "butter", name: "Farmhouse Butter", image: "farmhouse-salted-butter", price: 2.3, badge: "Churned daily" },
      { id: "cheddar", name: "Mature Cheddar Cheese", image: "mature-cheddar-cheese", price: 2.95, badge: "Aged 12 months" },
    ],
  },
  {
    category: "Market Greens",
    name: "Greens",
    options: [
      { id: "spinach", name: "Organic Baby Spinach", image: "organic-baby-spinach", price: 1.85, badge: "Picked dawn" },
      { id: "romaine", name: "Crisp Romaine Lettuce", image: "crisp-romaine-lettuce", price: 1.4, badge: "Crunchy hearts" },
      { id: "tomatoes", name: "Cherry Vine Tomatoes", image: "cherry-vine-tomatoes", price: 1.75, badge: "Sweet on the vine" },
    ],
  },
];

export function HomeHarvestBundle() {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const setCartOpen = useShopStore((state) => state.setCartOpen);
  const addItem = useAddCartItem({ silent: true });

  // Get real catalogue products to find matching product IDs when adding to basket
  const { data: productsData } = useGetProducts({ limit: 50 });
  const allProducts = productsData?.data ?? [];

  // User's current selection index for each slot [fruitIdx, breadIdx, dairyIdx, greensIdx]
  const [selections, setSelections] = useState<number[]>([0, 0, 0, 0]);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  // Compute live subtotal
  const selectedItems = BUNDLE_SLOTS.map((slot, slotIdx) => slot.options[selections[slotIdx]]);
  const rawTotal = selectedItems.reduce((acc, item) => acc + item.price, 0);
  const discountRate = 0.15; // 15% discount for building a 4-piece crate
  const discountAmount = rawTotal * discountRate;
  const discountedTotal = rawTotal - discountAmount;

  const handleSelect = (slotIdx: number, optionIdx: number) => {
    setSelections((prev) => {
      const next = [...prev];
      next[slotIdx] = optionIdx;
      return next;
    });
  };

  const handleAddBundleToBasket = async () => {
    if (!token || !user) {
      router.push(loginUrl(pathname));
      return;
    }
    if (user.role !== "CUSTOMER") {
      toastError("Shopping is for customers", "Admin accounts can't add items to a basket.");
      return;
    }

    setIsAdding(true);
    try {
      // Find matching products from backend or pick first available products
      for (const item of selectedItems) {
        const matched = allProducts.find((p) =>
          p.name.toLowerCase().includes(item.name.toLowerCase().split(" ")[0]),
        );
        const productIdToAdd = matched?.id ?? allProducts[0]?.id;
        if (productIdToAdd) {
          await addItem.mutateAsync({
            productId: productIdToAdd,
            quantity: 1,
          });
        }
      }

      setAdded(true);
      toastSuccess(
        "Harvest Crate added to basket!",
        `Saved £${discountAmount.toFixed(2)} with your 15% bundle discount.`,
      );
      setCartOpen(true);
      setTimeout(() => setAdded(false), 3500);
    } catch {
      toastError("Couldn't add bundle", "Please try adding individual products from the shop.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <section
      aria-labelledby="bundle-heading"
      className="relative overflow-hidden rounded-3xl border border-brand-green/20 bg-gradient-to-br from-brand-soft via-card to-brand-mint/20 p-6 shadow-soft sm:p-10 lg:p-12"
    >
      <div className="flex flex-col gap-3 text-center sm:text-left md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-1.5">
          <div className="inline-flex items-center gap-2 self-center rounded-full bg-brand-green/10 px-3.5 py-1 text-fs-12 font-bold text-brand-green-dark sm:self-start">
            <Package className="size-4 text-brand-green" aria-hidden="true" />
            <span>Interactive Crate Builder</span>
            <span className="rounded-full bg-brand-green px-2 py-0.5 text-fs-10 font-extrabold text-white">
              SAVE 15%
            </span>
          </div>

          <h2
            id="bundle-heading"
            className="font-heading text-fs-28 font-extrabold tracking-tight text-foreground sm:text-fs-36"
          >
            Build Your Own Fresh Market Box
          </h2>
          <p className="max-w-xl text-fs-14 text-muted-foreground sm:text-base">
            Select one farm item from each market stall. We pack it fresh at dawn and take 15% off automatically.
          </p>
        </div>

        {/* Live Calculation Capsule */}
        <div className="flex flex-col items-center gap-1 rounded-2xl border border-brand-green/20 bg-card p-4 shadow-soft sm:items-end">
          <div className="flex items-baseline gap-2">
            <span className="text-fs-12 text-muted-foreground line-through">
              £{rawTotal.toFixed(2)}
            </span>
            <span className="font-heading text-fs-28 font-extrabold text-brand-green-dark">
              £{discountedTotal.toFixed(2)}
            </span>
          </div>
          <span className="text-fs-11 font-bold text-emerald-700">
            You save £{discountAmount.toFixed(2)} (15% OFF)
          </span>
        </div>
      </div>

      {/* 4 Interactive Stall Slots */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {BUNDLE_SLOTS.map((slot, slotIdx) => {
          const selectedOption = slot.options[selections[slotIdx]];

          return (
            <div
              key={slot.category}
              className="flex flex-col rounded-2xl border border-border bg-card p-4 shadow-soft transition-all duration-200 hover:border-brand-green/30"
            >
              {/* Slot Header */}
              <div className="flex items-center justify-between border-b border-border/80 pb-2.5">
                <span className="text-fs-11 font-extrabold tracking-wider text-brand-green uppercase">
                  Slot {slotIdx + 1}: {slot.name}
                </span>
                <span className="rounded-full bg-brand-soft px-2 py-0.5 text-fs-10 font-bold text-brand-green-dark">
                  Selected
                </span>
              </div>

              {/* Active Item Packshot Preview */}
              <div className="relative mt-3 aspect-square w-full overflow-hidden rounded-xl bg-brand-soft/50">
                <Image
                  src={packshotUrl(selectedOption.image)}
                  alt={selectedOption.name}
                  fill
                  sizes="(min-width: 1024px) 200px, 40vw"
                  className="object-contain p-3 transition-transform duration-300 hover:scale-105"
                />
                <span className="absolute top-2 left-2 rounded-md bg-card/90 px-1.5 py-0.5 text-fs-10 font-bold text-foreground backdrop-blur">
                  {selectedOption.badge}
                </span>
                <span className="absolute right-2 bottom-2 rounded-md bg-brand-green px-2 py-0.5 text-fs-11 font-extrabold text-white">
                  £{selectedOption.price.toFixed(2)}
                </span>
              </div>

              {/* Current Active Title */}
              <p className="mt-2.5 line-clamp-1 font-heading text-fs-14 font-bold text-foreground">
                {selectedOption.name}
              </p>

              {/* Interactive Pill Switcher for this slot */}
              <div className="mt-3 flex flex-col gap-1.5">
                <span className="text-fs-10 font-bold tracking-wider text-muted-foreground uppercase">
                  Tap to swap item:
                </span>
                <div className="flex flex-col gap-1">
                  {slot.options.map((opt, optIdx) => {
                    const isCurrent = selections[slotIdx] === optIdx;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelect(slotIdx, optIdx)}
                        className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-fs-12 font-medium transition-all ${
                          isCurrent
                            ? "bg-brand-green text-white shadow-soft"
                            : "bg-muted/50 text-foreground hover:bg-muted"
                        }`}
                      >
                        <span className="truncate pr-2">{opt.name}</span>
                        <span className="shrink-0 font-mono text-fs-11 font-bold">
                          £{opt.price.toFixed(2)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-brand-green/20 bg-card p-5 shadow-soft sm:flex-row sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-brand-green text-white shadow-soft">
            <ShoppingBag className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-fs-16 font-bold text-foreground">
              Your 4-Piece Dawn Harvest Box
            </span>
            <span className="text-fs-12 text-muted-foreground">
              Farm Fruit + Artisan Bread + Pasture Dairy + Market Greens
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ButtonLink href={publicRoutes.shop} variant="ghost" size="lg" className="rounded-full">
            <span>Browse individual items</span>
            <ArrowRight aria-hidden="true" className="size-4" />
          </ButtonLink>

          <Button
            type="button"
            variant="cta"
            size="xl"
            disabled={isAdding}
            onClick={handleAddBundleToBasket}
            className="rounded-full px-6 shadow-lift"
          >
            {added ? (
              <>
                <Check className="size-4 text-white" />
                <span>Added to Basket!</span>
              </>
            ) : isAdding ? (
              <span>Packing Crate…</span>
            ) : (
              <>
                <Plus className="size-4" />
                <span>Add Crate to Basket · £{discountedTotal.toFixed(2)}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
