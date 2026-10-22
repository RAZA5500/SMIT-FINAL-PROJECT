"use client";

import { CircleAlert, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Flex, Stack } from "@/components/ui/flex";
import { Text } from "@/components/ui/typography";
import { Price } from "@/components/shared/Price";
import { ProductImage } from "@/components/shared/ProductImage";
import { TextLink } from "@/components/shared/TextLink";
import { useCartItemQuantity } from "@/hooks/useCartItemQuantity";
import { formatMoney } from "@/lib/format";
import { publicRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import type { ICartItem } from "@/services/cart/types";
import { QuantityStepper } from "../product/QuantityStepper";
import { cartItemIssue } from "./cart-availability";

interface CartLineProps {
  item: ICartItem;
  /** Drawer: chhoti thumbnail aur stepper */
  compact?: boolean;
  /** Line ka link (drawer band karne ke liye) */
  onNavigate?: () => void;
  className?: string;
}

/** Basket line — thumbnail, name, unit price, stepper (debounced PATCH), line total, availability issue */
export function CartLine({ item, compact = false, onNavigate, className }: CartLineProps) {
  const { quantity, atMinimum, canIncrease, increase, decrease, remove, isRemoving } = useCartItemQuantity(item);
  const issue = cartItemIssue(item);

  return (
    <Flex gap="3" className={cn("py-4 sm:gap-4", isRemoving && "opacity-50", className)}>
      <Link
        href={publicRoutes.product(item.productId)}
        onClick={onNavigate}
        tabIndex={-1}
        aria-hidden="true"
        className={cn("shrink-0 overflow-hidden rounded-xl border")}
      >
        <ProductImage
          name={item.name}
          sizes="96px"
          className={cn(compact ? "size-16" : "size-20 sm:size-24")}
          imageClassName={cn("p-1.5")}
          muted={!item.isAvailable}
        />
      </Link>

      <Stack gap="2" className={cn("min-w-0 flex-1")}>
        <Flex align="start" justify="between" gap="3">
          <Stack gap="0.5" className={cn("min-w-0")}>
            <TextLink
              href={publicRoutes.product(item.productId)}
              onClick={onNavigate}
              tone="default"
              className={cn("line-clamp-2 text-sm leading-5 font-semibold")}
            >
              {item.name}
            </TextLink>
            <Text variant="small" tone="muted">
              <Text as="span" numeric>
                {formatMoney(item.price)}
              </Text>{" "}
              each
              {item.minimumOrderQuantity > 1 && ` · Min. ${item.minimumOrderQuantity}`}
            </Text>
          </Stack>
          <Price amount={item.lineTotal} size="md" tone="default" className={cn("shrink-0")} />
        </Flex>

        <Flex align="center" justify="between" gap="2">
          <QuantityStepper
            size="sm"
            label={item.name}
            quantity={quantity}
            removeAtMinimum
            atMinimum={atMinimum}
            canIncrease={canIncrease}
            disabled={isRemoving}
            onDecrease={decrease}
            onIncrease={increase}
          />
          {!compact && (
            <Button
              variant="ghost"
              size="sm"
              className={cn("text-muted-foreground hover:text-destructive")}
              disabled={isRemoving}
              onClick={remove}
            >
              <Trash2 data-icon="inline-start" aria-hidden="true" />
              Remove
              <Text as="span" className={cn("sr-only")}>
                {item.name}
              </Text>
            </Button>
          )}
        </Flex>

        {issue && (
          <Text role="alert" variant="small" tone="destructive" weight="medium" className={cn("flex items-center gap-1.5")}>
            <CircleAlert aria-hidden="true" className={cn("size-3.5 shrink-0")} />
            {issue}
          </Text>
        )}
      </Stack>
    </Flex>
  );
}
