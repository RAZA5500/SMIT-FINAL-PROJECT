"use client";

import { Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/typography";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { useCartItemQuantity } from "@/hooks/useCartItemQuantity";
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
const BUTTON_SIZE: Record<ControlSize, { size: "default" | "lg" | "xl"; className: string }> = {
  sm: { size: "default", className: "" },
  md: { size: "lg", className: "" },
  lg: { size: "xl", className: "" },
};

interface ProductCartControlProps {
  product: IProduct;
  size?: ControlSize;
  className?: string;
}

/**
 * "Add to basket" → basket mein aate hi live stepper (cart line se). Pehli dafa
 * `minimumOrderQuantity` add hoti hai (FLOW-MD 01 §13); +/- debounced PATCH, UI foran
 * optimistic (shop-store).
 */
export function ProductCartControl({ product, size = "sm", className }: ProductCartControlProps) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const { data: cart } = useGetCart();
  // Card khud feedback deta hai (stepper) — har add par toast shor hota
  const addItem = useAddCartItem({ silent: true });

  const line = cart?.items.find((item) => item.productId === product.id);
  if (line) return <BasketLineStepper item={line} size={size} className={className} />;

  const button = BUTTON_SIZE[size];

  const handleAdd = () => {
    if (!token || !user) {
      router.push(loginUrl(pathname));
      return;
    }
    if (user.role !== "CUSTOMER") {
      toastError("Shopping is for customers", "Admin accounts can't add items to a basket.");
      return;
    }
    addItem.mutate(
      { productId: product.id, quantity: product.minimumOrderQuantity },
      { onError: (error) => toastError("Couldn't add to basket", error.message) },
    );
  };

  if (product.stockStatus === "OUT_OF_STOCK") {
    return (
      <Button variant="secondary" size={button.size} disabled className={cn("w-full", button.className, className)}>
        Out of stock
      </Button>
    );
  }

  return (
    <LoadingButton
      variant="outline"
      size={button.size}
      isLoading={addItem.isPending}
      loadingText="Adding…"
      onClick={handleAdd}
      className={cn("w-full", button.className, className)}
    >
      <Plus aria-hidden="true" />
      Add to basket
      <Text as="span" className="sr-only">
        : {product.name}
      </Text>
    </LoadingButton>
  );
}

function BasketLineStepper({ item, size, className }: { item: ICartItem; size: ControlSize; className?: string }) {
  const { quantity, atMinimum, canIncrease, increase, decrease, isRemoving } = useCartItemQuantity(item);
  return (
    <QuantityStepper
      variant="solid"
      size={size}
      label={item.name}
      quantity={quantity}
      removeAtMinimum
      atMinimum={atMinimum}
      canIncrease={canIncrease}
      disabled={isRemoving}
      onDecrease={decrease}
      onIncrease={increase}
      className={cn("w-full", className)}
    />
  );
}
