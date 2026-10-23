"use client";

import { CircleAlert, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Flex, Stack } from "@/components/ui/flex";
import { Text } from "@/components/ui/typography";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { Price } from "@/components/shared/Price";
import { ProductImage } from "@/components/shared/ProductImage";
import { TextLink } from "@/components/shared/TextLink";
import { useCartItemQuantity } from "@/hooks/useCartItemQuantity";
import { publicRoutes } from "@/lib/routes/routes";
import { cn, formatMoney } from "@/lib/utils";
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

/**
 * Basket line — thumbnail, name, unit price, stepper (optimistic UI, debounced PATCH), line total,
 * availability issue. Hatane se pehle confirmation (Pattern A).
 */
export function CartLine({ item, compact = false, onNavigate, className }: CartLineProps) {
  const { quantity, atMinimum, canIncrease, increase, decrease, remove, isRemoving } = useCartItemQuantity(item);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const issue = cartItemIssue(item);

  return (
    <Flex gap="3" className={cn("py-4 transition-opacity sm:gap-4", isRemoving && "opacity-50", className)}>
      <Button
        variant="ghost"
        nativeButton={false}
        tabIndex={-1}
        aria-hidden="true"
        render={<Link href={publicRoutes.product(item.productId)} onClick={onNavigate} />}
        className="h-auto shrink-0 self-start overflow-hidden rounded-2xl p-0 hover:bg-transparent active:scale-100"
      >
        <ProductImage
          name={item.name}
          sizes="96px"
          className={compact ? "size-18" : "size-20 sm:size-24"}
          imageClassName="p-[10%]"
          muted={!item.isAvailable}
        />
      </Button>

      <Stack gap="2.5" className="min-w-0 flex-1">
        <Flex align="start" justify="between" gap="3">
          <Stack gap="0.5" className="min-w-0">
            <TextLink
              href={publicRoutes.product(item.productId)}
              onClick={onNavigate}
              tone="default"
              className="line-clamp-2 text-sm leading-5 font-bold"
            >
              {item.name}
            </TextLink>
            <Text tone="muted" className="text-fs-13">
              <Text as="span" tone="inherit" numeric className="text-fs-13">
                {formatMoney(item.price)}
              </Text>{" "}
              each
              {item.minimumOrderQuantity > 1 && ` · Min. ${item.minimumOrderQuantity}`}
            </Text>
          </Stack>
          <Price amount={item.lineTotal} size="md" className="shrink-0" />
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
            onDecrease={() => (atMinimum ? setConfirmOpen(true) : decrease())}
            onIncrease={increase}
          />
          {!compact && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:bg-destructive-soft hover:text-destructive"
              disabled={isRemoving}
              onClick={() => setConfirmOpen(true)}
            >
              <Trash2 aria-hidden="true" />
              Remove
              <Text as="span" className="sr-only">
                {item.name}
              </Text>
            </Button>
          )}
        </Flex>

        {issue && (
          <Flex role="alert" align="center" gap="1.5" className="text-fs-13 font-medium text-destructive">
            <CircleAlert aria-hidden="true" className="size-3.5 shrink-0" />
            {issue}
          </Flex>
        )}
      </Stack>

      <DeleteDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Remove from basket?"
        description={`${item.name} will be removed from your basket.`}
        confirmLabel="Remove"
        isLoading={isRemoving}
        onConfirm={() => {
          remove();
          setConfirmOpen(false);
        }}
      />
    </Flex>
  );
}
