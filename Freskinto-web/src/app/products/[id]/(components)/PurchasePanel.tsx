"use client";

import { CircleCheck, ShoppingBasket } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, AlertBody, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Flex, Stack } from "@/components/ui/flex";
import { Text } from "@/components/ui/typography";
import { QuantityStepper } from "@/components/customer/product/QuantityStepper";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { useCartItemQuantity } from "@/hooks/useCartItemQuantity";
import { flyToBasket } from "@/lib/fly-to-basket";
import { loginUrl } from "@/lib/routes/routes";
import { toastError, toastSuccess } from "@/lib/toast";
import { formatMoney } from "@/lib/utils";
import { useAddCartItem } from "@/services/cart/mutations";
import { useGetCart } from "@/services/cart/queries";
import type { ICartItem } from "@/services/cart/types";
import type { IProduct } from "@/services/products/types";
import { useAuthStore } from "@/stores/auth-store";
import { useShopStore } from "@/stores/shop-store";
import { PRODUCT_STAGE_SELECTOR } from "./ProductStage";

/**
 * Product page ka buy box: pehle quantity chuno (min..max), phir add. Basket mein aa jaye to wahi
 * live stepper jo card par hai (optimistic UI, debounced PATCH).
 */
export function PurchasePanel({ product }: { product: IProduct }) {
  const { data: cart } = useGetCart();
  const line = cart?.items.find((item) => item.productId === product.id);

  if (product.stockStatus === "OUT_OF_STOCK" && !line) {
    return (
      <Alert variant="default">
        <AlertBody>
          <AlertTitle>Sold out for now</AlertTitle>
          <AlertDescription>We&apos;re restocking this one — check back soon.</AlertDescription>
        </AlertBody>
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
    flyToBasket(document.querySelector(PRODUCT_STAGE_SELECTOR));
    addItem.mutate(
      { productId: product.id, quantity },
      {
        onSuccess: () => toastSuccess("Added to basket", `${quantity} × ${product.name}`),
        onError: (error) => toastError("Couldn't add to basket", error.message),
      },
    );
  };

  return (
    <Stack gap="3">
      <Flex direction="col" gap="3" className="sm:flex-row">
        <QuantityStepper
          size="lg"
          label={product.name}
          quantity={quantity}
          canDecrease={quantity > product.minimumOrderQuantity}
          canIncrease={quantity < product.maximumOrderQuantity}
          onDecrease={() => setQuantity((q) => Math.max(product.minimumOrderQuantity, q - 1))}
          onIncrease={() => setQuantity((q) => Math.min(product.maximumOrderQuantity, q + 1))}
          className="w-full sm:w-44"
        />
        <LoadingButton
          variant="fresh"
          size="xl"
          className="w-full sm:w-auto sm:flex-1"
          isLoading={addItem.isPending}
          loadingText="Adding…"
          onClick={add}
        >
          <ShoppingBasket aria-hidden="true" className="transition-transform duration-500 ease-spring group-hover/button:-rotate-12" />
          Add to basket
        </LoadingButton>
      </Flex>
      <Text tone="muted" className="text-fs-13">
        Order between {product.minimumOrderQuantity} and {product.maximumOrderQuantity} per order.
      </Text>
    </Stack>
  );
}

function InBasket({ item }: { item: ICartItem }) {
  const setCartOpen = useShopStore((state) => state.setCartOpen);
  const { quantity, atMinimum, canIncrease, increase, decrease, isRemoving } = useCartItemQuantity(item);

  return (
    <Stack gap="3" className="animate-pop-in rounded-[1.75rem] border border-brand/25 bg-brand-soft/60 p-4 dark:bg-brand/10">
      <Flex align="center" gap="2">
        <CircleCheck aria-hidden="true" className="size-4.5 text-brand-ink dark:text-brand" />
        <Text weight="semibold">
          In your basket ·{" "}
          <Text as="span" tone="inherit" numeric>
            {formatMoney(item.lineTotal)}
          </Text>
        </Text>
      </Flex>
      <Flex direction="col" gap="3" className="sm:flex-row">
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
          className="w-full sm:w-44"
        />
        <Button size="xl" variant="outline" className="w-full sm:w-auto sm:flex-1" onClick={() => setCartOpen(true)}>
          View basket
        </Button>
      </Flex>
    </Stack>
  );
}
