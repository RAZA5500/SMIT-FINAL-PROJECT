"use client";

import { CircleAlert, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCartItemQuantity } from "@/hooks/useCartItemQuantity";
import { formatMoney } from "@/lib/format";
import { publicRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import type { ICartItem } from "@/services/cart/types";
import { ProductImage } from "@/components/shared/ProductImage";
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

export function CartLine({ item, compact = false, onNavigate, className }: CartLineProps) {
  const { quantity, atMinimum, canIncrease, increase, decrease, remove, isRemoving } = useCartItemQuantity(item);
  const issue = cartItemIssue(item);

  return (
    <div className={cn("flex gap-3 py-4", isRemoving && "opacity-50", className)}>
      <Link
        href={publicRoutes.product(item.productId)}
        onClick={onNavigate}
        className="shrink-0 overflow-hidden rounded-xl ring-1 ring-border"
        tabIndex={-1}
        aria-hidden="true"
      >
        <ProductImage
          name={item.name}
          sizes="96px"
          className={compact ? "size-16" : "size-20 sm:size-24"}
          imageClassName="p-1.5"
          muted={!item.isAvailable}
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={publicRoutes.product(item.productId)}
              onClick={onNavigate}
              className="line-clamp-2 text-sm leading-5 font-semibold text-foreground hover:text-brand"
            >
              {item.name}
            </Link>
            <p className="mt-0.5 text-xs text-muted-foreground">
              <span className="numeric">{formatMoney(item.price)}</span> each
              {item.minimumOrderQuantity > 1 && ` · Min. ${item.minimumOrderQuantity}`}
            </p>
          </div>
          <p className="numeric shrink-0 font-heading text-base font-bold text-foreground">
            {formatMoney(item.lineTotal)}
          </p>
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
            onDecrease={decrease}
            onIncrease={increase}
          />
          {!compact && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive"
              disabled={isRemoving}
              onClick={remove}
            >
              <Trash2 aria-hidden="true" />
              Remove
              <span className="sr-only">{item.name}</span>
            </Button>
          )}
        </div>

        {issue && (
          <p role="alert" className="flex items-center gap-1.5 text-xs font-medium text-destructive">
            <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
            {issue}
          </p>
        )}
      </div>
    </div>
  );
}
