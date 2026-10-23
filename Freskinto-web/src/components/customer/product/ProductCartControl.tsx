"use client";

import { PackageX, Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/typography";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { useCartItemQuantity } from "@/hooks/useCartItemQuantity";
import { flyToBasket } from "@/lib/fly-to-basket";
import { loginUrl } from "@/lib/routes/routes";
import { toastError } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { useAddCartItem } from "@/services/cart/mutations";
import { useGetCart } from "@/services/cart/queries";
import type { ICartItem } from "@/services/cart/types";
import type { IProduct } from "@/services/products/types";
import { useAuthStore } from "@/stores/auth-store";
import { QuantityStepper } from "./QuantityStepper";

type ControlSize = "sm" | "md" | "lg";

/** Button aur stepper ki height barabar — basket mein jaate waqt layout na hile */
const BUTTON_SIZE: Record<ControlSize, "default" | "lg" | "xl"> = {
  sm: "default",
  md: "lg",
  lg: "xl",
};

interface ProductCartControlProps {
  product: IProduct;
  size?: ControlSize;
  /** `compact`: card ka gol "+" button jo basket mein aate hi chhote stepper mein badalta hai */
  variant?: "block" | "compact";
  className?: string;
}

/** Click wale card/panel ki photo — wahi basket tak udti hai */
function flightSource(event: MouseEvent<HTMLElement>) {
  return event.currentTarget.closest("[data-product-card]")?.querySelector("[data-product-image]");
}

/**
 * "Add to basket" → basket mein aate hi live stepper (cart line se). Pehli dafa
 * `minimumOrderQuantity` add hoti hai (FLOW-MD 01 §13); +/- debounced PATCH, UI foran
 * optimistic (shop-store). Add karte hi product ki photo basket tak udti hai.
 */
export function ProductCartControl({ product, size = "sm", variant = "block", className }: ProductCartControlProps) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const { data: cart } = useGetCart();
  // Card khud feedback deta hai (stepper + udti photo) — har add par toast shor hota
  const addItem = useAddCartItem({ silent: true });
  const compact = variant === "compact";

  const line = cart?.items.find((item) => item.productId === product.id);
  if (line) return <BasketLineStepper item={line} size={size} compact={compact} className={className} />;

  const handleAdd = (event: MouseEvent<HTMLButtonElement>) => {
    if (!token || !user) {
      router.push(loginUrl(pathname));
      return;
    }
    if (user.role !== "CUSTOMER") {
      toastError("Shopping is for customers", "Admin accounts can't add items to a basket.");
      return;
    }
    flyToBasket(flightSource(event));
    addItem.mutate(
      { productId: product.id, quantity: product.minimumOrderQuantity },
      { onError: (error) => toastError("Couldn't add to basket", error.message) },
    );
  };

  if (product.stockStatus === "OUT_OF_STOCK") {
    // Compact: "+" ki jagah wahi gol button, band — photo par "Sold out" badge pehle se hai
    return compact ? (
      <Button variant="secondary" size="icon-lg" disabled aria-label={`${product.name} is sold out`} className={cn("size-11", className)}>
        <PackageX aria-hidden="true" />
      </Button>
    ) : (
      <Button variant="secondary" size={BUTTON_SIZE[size]} disabled className={cn("w-full", className)}>
        Out of stock
      </Button>
    );
  }

  if (compact) {
    return (
      <Button
        variant="fresh"
        size="icon-lg"
        disabled={addItem.isPending}
        aria-busy={addItem.isPending || undefined}
        onClick={handleAdd}
        aria-label={addItem.isPending ? `Adding ${product.name}…` : `Add to basket: ${product.name}`}
        className={cn("size-11", className)}
      >
        {addItem.isPending ? (
          <Spinner aria-hidden="true" />
        ) : (
          <Plus aria-hidden="true" strokeWidth={2.6} className="transition-transform duration-500 ease-spring group-hover/button:rotate-90" />
        )}
      </Button>
    );
  }

  return (
    <LoadingButton
      variant="fresh"
      size={BUTTON_SIZE[size]}
      isLoading={addItem.isPending}
      loadingText="Adding…"
      onClick={handleAdd}
      className={cn("w-full", className)}
    >
      <Plus aria-hidden="true" strokeWidth={2.6} className="transition-transform duration-500 ease-spring group-hover/button:rotate-90" />
      Add to basket
      <Text as="span" className="sr-only">
        : {product.name}
      </Text>
    </LoadingButton>
  );
}

function BasketLineStepper({
  item,
  size,
  compact,
  className,
}: {
  item: ICartItem;
  size: ControlSize;
  compact: boolean;
  className?: string;
}) {
  const { quantity, atMinimum, canIncrease, increase, decrease, isRemoving } = useCartItemQuantity(item);
  return (
    <QuantityStepper
      variant="solid"
      size={compact ? "sm" : size}
      label={item.name}
      quantity={quantity}
      removeAtMinimum
      atMinimum={atMinimum}
      canIncrease={canIncrease}
      disabled={isRemoving}
      onDecrease={decrease}
      onIncrease={increase}
      className={cn("animate-pop-in", compact ? "h-11" : "w-full", className)}
    />
  );
}
