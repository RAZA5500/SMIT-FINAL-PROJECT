"use client";

import Image from "next/image";
import { Product, formatPrice } from "@/data/products";

interface ProductCardProps {
  product: Product;
  quantity: number;
  onQuantityChange: (productId: string, delta: number) => void;
  onAddToCart: (productId: string) => void;
  /** The shop grid uses a more compact card than the storefront grid. */
  variant?: "storefront" | "shop";
}

const CARD_CLASS =
  "group/card flex flex-col text-xs/relaxed text-card-foreground relative overflow-hidden rounded-(--radius-10) p-0 shadow-[0px_10px_20px_0px_#48484829] hover:shadow-card-hover transition-shadow duration-300 ease-in-out after:content-empty after:absolute after:inset-0 after:z-10 after:border after:border-table-row-border after:rounded-(--radius-10) after:pointer-events-none after:transition-colors after:duration-300 after:ease-in-out hover:after:border-card-hover-border bg-white w-full h-full";

const VARIANTS = {
  storefront: {
    card: `${CARD_CLASS} lg:pb-5`,
    image:
      "relative bg-gray-100 overflow-hidden shrink-0 w-36 h-36 sm:w-full sm:h-auto sm:aspect-square h-40 md:h-56 xl:h-[270px]",
    title: "font-inter font-normal text-fs-10 text-ink md:text-xl line-clamp-2 leading-normal",
    price: "font-inter font-semibold text-fs-10 text-gray-900 md:text-lg leading-none shrink-0",
    stepper:
      "flex items-center justify-between border border-border-gray rounded-full p-0.5 md:p-1 w-25 h-7 md:h-auto shrink-0",
    stepperButton:
      "flex justify-center items-center hover:opacity-70 bg-border-gray rounded-full w-6 h-6 md:w-7.5 md:h-7.5 transition-opacity shrink-0 cursor-pointer",
    icon: "w-3 h-3",
  },
  shop: {
    card: CARD_CLASS,
    image:
      "relative bg-gray-100 overflow-hidden shrink-0 w-36 h-36 sm:w-full sm:h-auto sm:aspect-square md:h-56",
    title: "font-inter font-normal text-fs-10 text-ink md:text-lg line-clamp-2 leading-normal",
    price: "font-inter font-semibold text-fs-10 text-gray-900 md:text-base leading-none shrink-0",
    stepper:
      "flex items-center justify-between border border-border-gray rounded-full p-0.5 md:p-1 w-20 h-7 md:h-auto shrink-0",
    stepperButton:
      "flex justify-center items-center hover:opacity-70 bg-border-gray rounded-full w-5 h-5 md:w-6 md:h-6 transition-opacity shrink-0 cursor-pointer",
    icon: "w-2.5 h-2.5",
  },
} as const;

function TrashIcon({ size }: { size: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide lucide-trash2 lucide-trash-2 ${size} text-red-500`}
      aria-hidden="true"
    >
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function MinusIcon({ size }: { size: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide lucide-minus ${size} text-gray-900`}
      aria-hidden="true"
    >
      <path d="M5 12h14" />
    </svg>
  );
}

function PlusIcon({ size }: { size: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide lucide-plus ${size} text-gray-900`}
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

export default function ProductCard({
  product,
  quantity,
  onQuantityChange,
  onAddToCart,
  variant = "storefront",
}: ProductCardProps) {
  const v = VARIANTS[variant];

  return (
    <div className="hover:z-10 relative h-full cursor-pointer">
      <div data-slot="card" className={v.card}>
        <div data-slot="card-content" className="flex flex-row sm:flex-col p-0 h-full">
          <div className={v.image}>
            {product.saleTag && (
              <span className="inline-flex top-1.5 md:top-3 left-2 md:left-4 z-20 absolute items-center bg-error px-1 md:px-2 py-1.5 md:py-sale-badge rounded md:rounded text-fs-8 text-white md:text-sm leading-none md:leading-normal pointer-events-none">
                {product.saleTag}
              </span>
            )}
            {product.image && (
              <Image
                alt={product.name}
                fill
                sizes="(max-width: 640px) 144px, (max-width: 1280px) 50vw, 300px"
                className="object-cover"
                src={product.image}
              />
            )}
          </div>

          <div className="relative flex flex-col flex-1 gap-0 px-3 sm:px-4 md:px-7.5 py-2.5 sm:py-2 min-w-0">
            <div>
              <div className="flex flex-row justify-between items-center gap-2">
                <h3 className={v.title}>
                  {product.name}
                </h3>
                <span className={v.price}>
                  £{formatPrice(product.price)}
                </span>
              </div>
              <p className="opacity-60 lg:pt-2.5 w-full font-inter font-normal text-cart-icon-dark text-fs-8 md:text-sm line-clamp-2 leading-snug">
                {product.description}
              </p>
            </div>

            <div className="mt-auto pt-2 sm:pt-1 lg:pt-2.5">
              {!product.inStock ? (
                <div className="flex justify-center items-center bg-gray-100 border border-gray-200 rounded-5 w-full font-inter font-semibold text-center cursor-not-allowed mt-0 md:mt-2 px-2 text-fs-8 md:px-6 md:h-7.5 md:text-fs-10 h-7 text-xs">
                  Out of Stock
                </div>
              ) : (
              <div className="flex flex-wrap items-center gap-2">
                <div className={v.stepper}>
                  <button
                    type="button"
                    aria-label={quantity <= 1 ? "Remove from cart" : "Decrease quantity"}
                    className={v.stepperButton}
                    onClick={() => onQuantityChange(product.id, -1)}
                  >
                    {quantity <= 1 ? <TrashIcon size={v.icon} /> : <MinusIcon size={v.icon} />}
                  </button>
                  <span className="font-medium text-gray-900 text-xs">{quantity || 1}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    className={v.stepperButton}
                    onClick={() => onQuantityChange(product.id, 1)}
                  >
                    <PlusIcon size={v.icon} />
                  </button>
                </div>
                <button
                  type="button"
                  className="flex flex-1 justify-center items-center bg-brand-green-light hover:bg-brand-green-light/90 disabled:opacity-50 rounded-5 min-w-16 h-7 font-semibold text-white text-fs-10 sm:text-xs active:scale-95 transition-all cursor-pointer disabled:cursor-not-allowed"
                  onClick={() => onAddToCart(product.id)}
                >
                  Add to Cart
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
