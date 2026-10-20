"use client";

import { useCart } from "@/context/CartContext";
import { PRODUCTS, formatPrice } from "@/data/products";

const CHECKOUT_BUTTON_CLASS =
  "group/button inline-flex shrink-0 items-center justify-center rounded-5 border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all duration-200 outline-none select-none disabled:pointer-events-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 cursor-pointer hover:-translate-y-0.5 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:shrink-0 hover:bg-primary/80 gap-1 px-2.5 text-xs/relaxed has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-4 bg-brand-green hover:opacity-90 disabled:opacity-50 mt-1 w-full h-11 text-white";

export default function CartPanel() {
  const { cart } = useCart();

  const lines = Object.entries(cart)
    .map(([id, qty]) => {
      const product = PRODUCTS.find((p) => p.id === id);
      return product ? { product, qty } : null;
    })
    .filter(Boolean) as { product: (typeof PRODUCTS)[number]; qty: number }[];

  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3.5 flex justify-between items-center border-gray-100 border-b shrink-0">
        <h3 className="font-medium text-gray-900">
          Your Cart <span className="text-brand-green">({lines.length})</span>
        </h3>
        <div className="flex items-center gap-3" />
      </div>

      <div className="flex flex-col scrollbar-thin lg:flex-1 lg:min-h-0 lg:overflow-y-auto">
        {lines.map(({ product, qty }) => (
          <div key={product.id} className="flex items-center gap-3 px-4 py-3 border-gray-100 border-b">
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm text-gray-900">{product.name}</p>
              <p className="text-xs text-gray-500">
                {qty} × £{formatPrice(product.price)}
              </p>
            </div>
            <span className="font-medium text-price-text text-sm">
              £{formatPrice(product.price * qty)}
            </span>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 border-gray-100 border-b shrink-0">
        <div className="">
          <button
            type="button"
            className="flex items-center gap-1.5 font-inter text-xs font-medium text-gray-500 hover:text-brand-green transition-colors cursor-pointer"
          >
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
              className="lucide lucide-tag w-3.5 h-3.5"
              aria-hidden="true"
            >
              <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
              <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
            </svg>
            Have a promo code?
          </button>
        </div>
      </div>

      <div className="px-4 py-4 border-gray-100 border-t shrink-0 space-y-2.5">
        <div className="flex justify-between items-center">
          <span className="text-summary-label text-sm">Subtotal</span>
          <span className="font-medium text-price-text text-sm">£{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center pt-2.5 border-summary-divider border-t">
          <span className="font-semibold text-summary-label text-sm">Total</span>
          <span className="font-bold text-brand-green text-base">£{formatPrice(subtotal)}</span>
        </div>
        <button
          type="button"
          tabIndex={0}
          disabled={lines.length === 0}
          data-slot="button"
          className={CHECKOUT_BUTTON_CLASS}
        >
          <span className="flex items-center gap-2">
            Checkout
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
              className="lucide lucide-arrow-right w-4 h-4"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}
