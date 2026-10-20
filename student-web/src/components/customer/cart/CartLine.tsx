"use client";

import { CircleAlert } from "lucide-react";
import { useCartItemQuantity } from "@/hooks/useCartItemQuantity";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ICartItem } from "@/services/cart/types";
import { QuantityStepper } from "../QuantityStepper";
import { cartItemIssue } from "./cart-availability";

interface CartLineProps {
  item: ICartItem;
  /** Hover preview: sirf summary, stepper nahi */
  readOnly?: boolean;
  className?: string;
}

export function CartLine({ item, readOnly = false, className }: CartLineProps) {
  const { quantity, atMinimum, canIncrease, increase, decrease, isRemoving } =
    useCartItemQuantity(item);
  const issue = cartItemIssue(item);

  return (
    <div className={cn("flex flex-col gap-2 border-b border-gray-100 px-4 py-3", className)}>
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-gray-900">{item.name}</p>
          <p className="text-xs text-gray-500">
            {quantity} × {formatMoney(item.price)}
          </p>
        </div>
        <span className="text-sm font-medium text-price-text">{formatMoney(item.lineTotal)}</span>
      </div>

      {!readOnly && (
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
      )}

      {issue && (
        <p role="alert" className="flex items-center gap-1.5 text-xs text-destructive">
          <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
          {issue}
        </p>
      )}
    </div>
  );
}
