"use client";

import { Package } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { STOCK_STATUS_LABELS } from "@/constants/labels";
import { formatMoney } from "@/lib/format";
import { loginUrl } from "@/lib/routes/routes";
import { toastError } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { useAddCartItem } from "@/services/cart/mutations";
import type { IProduct } from "@/services/products/types";
import { useAuthStore } from "@/stores/auth-store";
import { QuantityStepper } from "./QuantityStepper";

interface ProductCardProps {
  product: IProduct;
  /** The shop grid uses a more compact card than the storefront grid. */
  variant?: "storefront" | "shop";
}

const CARD_CLASS =
  "group/card relative flex h-full w-full flex-col overflow-hidden rounded-10 bg-white p-0 text-xs/relaxed text-card-foreground shadow-product after:pointer-events-none after:absolute after:inset-0 after:z-10 after:rounded-10 after:border after:border-table-row-border after:transition-colors after:duration-300 after:ease-in-out after:content-empty hover:after:border-card-hover-border";

const VARIANTS = {
  storefront: {
    card: "lg:pb-5",
    image: "h-36 w-36 sm:aspect-square sm:h-auto sm:w-full md:h-56 xl:h-product-card-image",
    title: "text-fs-10 md:text-xl",
    price: "text-fs-10 md:text-lg",
    stepper: "md" as const,
  },
  shop: {
    card: "",
    image: "h-36 w-36 sm:aspect-square sm:h-auto sm:w-full md:h-56",
    title: "text-fs-10 md:text-lg",
    price: "text-fs-10 md:text-base",
    stepper: "sm" as const,
  },
};

export default function ProductCard({ product, variant = "storefront" }: ProductCardProps) {
  const v = VARIANTS[variant];
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const addItem = useAddCartItem();
  // Kitni quantity add karni hai — pehli dafa kam az kam minimumOrderQuantity (FLOW-MD 01 §13)
  const [quantity, setQuantity] = useState(product.minimumOrderQuantity);

  const outOfStock = product.stockStatus === "OUT_OF_STOCK";

  const handleAddToCart = () => {
    if (!token || !user) {
      router.push(loginUrl(pathname));
      return;
    }
    if (user.role !== "CUSTOMER") {
      toastError("Shopping is for customers", "Admin accounts can't add items to a cart.");
      return;
    }
    addItem.mutate({ productId: product.id, quantity });
  };

  return (
    <div className="relative h-full hover:z-10">
      <div data-slot="card" className={cn(CARD_CLASS, v.card)}>
        <div data-slot="card-content" className="flex h-full flex-row p-0 sm:flex-col">
          <div
            className={cn(
              "relative flex shrink-0 items-center justify-center overflow-hidden bg-gray-100",
              v.image,
            )}
          >
            {product.stockStatus === "LOW_STOCK" && (
              <span className="pointer-events-none absolute top-1.5 left-2 z-20 inline-flex items-center rounded bg-brand-orange px-1 py-1.5 text-fs-8 leading-none text-white md:top-3 md:left-4 md:px-2 md:py-sale-badge md:text-sm md:leading-normal">
                {STOCK_STATUS_LABELS.LOW_STOCK}
              </span>
            )}
            {/* Product images scope mein nahi — placeholder */}
            <Package className="size-12 text-gray-300 md:size-16" aria-hidden="true" />
          </div>

          <div className="relative flex min-w-0 flex-1 flex-col gap-0 px-3 py-2.5 sm:px-4 sm:py-2 md:px-7.5">
            <div>
              <div className="flex flex-row items-center justify-between gap-2">
                <h3 className={cn("line-clamp-2 font-inter leading-normal font-normal text-ink", v.title)}>
                  {product.name}
                </h3>
                <span
                  className={cn("shrink-0 font-inter leading-none font-semibold text-gray-900", v.price)}
                >
                  {formatMoney(product.price)}
                </span>
              </div>
              <p className="line-clamp-2 w-full font-inter text-fs-8 leading-snug font-normal text-cart-icon-dark opacity-60 md:text-sm lg:pt-2.5">
                {product.category.name}
              </p>
            </div>

            <div className="mt-auto pt-2 sm:pt-1 lg:pt-2.5">
              {outOfStock ? (
                <div className="mt-0 flex h-7 w-full cursor-not-allowed items-center justify-center rounded-5 border border-gray-200 bg-gray-100 px-2 text-center font-inter text-fs-8 font-semibold md:mt-2 md:h-7.5 md:px-6 md:text-fs-10">
                  {STOCK_STATUS_LABELS.OUT_OF_STOCK}
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <QuantityStepper
                    size={v.stepper}
                    label={product.name}
                    quantity={quantity}
                    canDecrease={quantity > product.minimumOrderQuantity}
                    canIncrease={quantity < product.maximumOrderQuantity}
                    onDecrease={() => setQuantity((q) => Math.max(product.minimumOrderQuantity, q - 1))}
                    onIncrease={() => setQuantity((q) => Math.min(product.maximumOrderQuantity, q + 1))}
                  />
                  {/* Add quantity increment karta hai — pending mein disabled taa ke double add na ho */}
                  <button
                    type="button"
                    className="flex h-7 min-w-16 flex-1 cursor-pointer items-center justify-center rounded-5 bg-brand-green-light text-fs-10 font-semibold text-white transition-all hover:bg-brand-green-light/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs"
                    disabled={addItem.isPending}
                    aria-busy={addItem.isPending || undefined}
                    onClick={handleAddToCart}
                  >
                    {addItem.isPending ? "Adding…" : "Add to Cart"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
