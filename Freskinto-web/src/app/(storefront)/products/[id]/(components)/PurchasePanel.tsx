"use client";

import { ShoppingBasket } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Flex, Stack } from "@/components/ui/flex";
import { Text } from "@/components/ui/typography";
import { QuantityStepper } from "@/components/customer/product/QuantityStepper";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { useCartItemQuantity } from "@/hooks/useCartItemQuantity";
import { formatMoney } from "@/lib/format";
import { loginUrl } from "@/lib/routes/routes";
import { toastError } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { useAddCartItem } from "@/services/cart/mutations";
import { useGetCart } from "@/services/cart/queries";
import type { ICartItem } from "@/services/cart/types";
import type { IProduct } from "@/services/products/types";
import { useAuthStore } from "@/stores/auth-store";
import { useUiStore } from "@/stores/ui-store";

/**
 * Product page ka buy box: pehle quantity chuno (min..max), phir add. Basket mein
 * aa jaye to wahi live stepper jo card par hai (debounced PATCH).
 */
export function PurchasePanel({ product }: { product: IProduct }) {
  const { data: cart } = useGetCart();
  const line = cart?.items.find((item) => item.productId === product.id);

  if (product.stockStatus === "OUT_OF_STOCK" && !line) {
    return (
      <Alert variant="default">
        <AlertTitle>Sold out for now</AlertTitle>
        <AlertDescription>We&apos;re restocking this one — check back soon.</AlertDescription>
      </Alert>
    );
  }

  return line ? <InBasket item={line} /> : <AddToBasket product={product} />;
}

function AddToBasket({ product }: { product: IProduct }) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const setCartOpen = useUiStore((state) => state.setCartOpen);
  const addItem = useAddCartItem({ silent: true });
  const [quantity, setQuantity] = useState(product.minimumOrderQuantity);

  const add = () => {
    if (!token || !user) {
      router.push(loginUrl(pathname));
      return;
    }
    if (user.role !== "CUSTOMER") {
      toastError("Shopping is for customers", "Admin accounts can't add items to a basket.");
      return;
    }
    addItem.mutate(
      { productId: product.id, quantity },
      {
        onSuccess: () =>
          toast.success("Added to basket", {
            description: `${quantity} × ${product.name}`,
            action: { label: "View basket", onClick: () => setCartOpen(true) },
          }),
        onError: (error) => toastError("Couldn't add to basket", error.message),
      },
    );
  };

  return (
    <Stack gap="3">
      <Flex direction="col" gap="3" className={cn("sm:flex-row")}>
        <QuantityStepper
          size="lg"
          label={product.name}
          quantity={quantity}
          canDecrease={quantity > product.minimumOrderQuantity}
          canIncrease={quantity < product.maximumOrderQuantity}
          onDecrease={() => setQuantity((q) => Math.max(product.minimumOrderQuantity, q - 1))}
          onIncrease={() => setQuantity((q) => Math.min(product.maximumOrderQuantity, q + 1))}
          className={cn("w-full sm:w-40")}
        />
        <LoadingButton size="xl" className={cn("flex-1")} isLoading={addItem.isPending} loadingText="Adding…" onClick={add}>
          <ShoppingBasket data-icon="inline-start" aria-hidden="true" />
          Add to basket
        </LoadingButton>
      </Flex>
      <Text variant="small" tone="muted">
        Order between {product.minimumOrderQuantity} and {product.maximumOrderQuantity} per order.
      </Text>
    </Stack>
  );
}

function InBasket({ item }: { item: ICartItem }) {
  const setCartOpen = useUiStore((state) => state.setCartOpen);
  const { quantity, atMinimum, canIncrease, increase, decrease, isRemoving } = useCartItemQuantity(item);

  return (
    <Card size="sm" className={cn("bg-muted ring-0")}>
      <CardContent className={cn("flex flex-col gap-3")}>
        <Text weight="semibold" tone="brand">
          In your basket ·{" "}
          <Text as="span" numeric>
            {formatMoney(item.lineTotal)}
          </Text>
        </Text>
        <Flex direction="col" gap="3" className={cn("sm:flex-row")}>
          <QuantityStepper
            size="lg"
            variant="solid"
            label={item.name}
            quantity={quantity}
            removeAtMinimum
            atMinimum={atMinimum}
            canIncrease={canIncrease}
            disabled={isRemoving}
            onDecrease={decrease}
            onIncrease={increase}
            className={cn("w-full sm:w-44")}
          />
          <Button size="xl" variant="outline" className={cn("flex-1")} onClick={() => setCartOpen(true)}>
            View basket
          </Button>
        </Flex>
      </CardContent>
    </Card>
  );
}
