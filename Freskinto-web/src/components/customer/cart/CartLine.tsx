"use client";

import { CircleAlert, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
    <div className={cn("flex gap-3 py-4 sm:gap-4", isRemoving && "opacity-50", className)}>
      <Link
        href={publicRoutes.product(item.productId)}
        onClick={onNavigate}
        tabIndex={-1}
        aria-hidden="true"
        className="shrink-0 self-start overflow-hidden rounded-xl border border-border"
      >
        <ProductImage
          name={item.name}
          sizes="96px"
          className={compact ? "size-16" : "size-20 sm:size-24"}
          imageClassName="p-1.5"
          muted={!item.isAvailable}
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-0.5">
            <TextLink
              href={publicRoutes.product(item.productId)}
              onClick={onNavigate}
              tone="default"
              className="line-clamp-2 text-sm leading-5 font-semibold"
            >
              {item.name}
            </TextLink>
            <p className="text-fs-13 text-muted-foreground">
              <span className="numeric">{formatMoney(item.price)}</span> each
              {item.minimumOrderQuantity > 1 && ` · Min. ${item.minimumOrderQuantity}`}
            </p>
          </div>
          <Price amount={item.lineTotal} size="md" className="shrink-0" />
        </div>

        <div className="flex items-center justify-between gap-2">
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
              className="text-muted-foreground hover:text-destructive"
              disabled={isRemoving}
              onClick={() => setConfirmOpen(true)}
            >
              <Trash2 aria-hidden="true" />
              Remove
              <span className="sr-only">{item.name}</span>
            </Button>
          )}
        </div>

        {issue && (
          <p role="alert" className="flex items-center gap-1.5 text-fs-13 font-medium text-destructive">
            <CircleAlert aria-hidden="true" className="size-3.5 shrink-0" />
            {issue}
          </p>
        )}
      </div>

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
    </div>
  );
}
