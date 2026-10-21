"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: { root: "h-9 p-0.5", button: "size-8", icon: "size-3.5", value: "min-w-7 text-sm" },
  md: { root: "h-10 p-0.5", button: "size-9", icon: "size-4", value: "min-w-8 text-sm" },
  lg: { root: "h-12 p-1", button: "size-10", icon: "size-4", value: "min-w-10 text-base" },
} as const;

const VARIANTS = {
  // In-basket state on product cards — solid brand pill
  solid: {
    root: "bg-primary text-primary-foreground shadow-sm",
    button: "hover:bg-white/15 disabled:opacity-40",
    trash: "text-primary-foreground",
  },
  outline: {
    root: "bg-card text-foreground ring-1 ring-border",
    button: "hover:bg-muted disabled:opacity-35",
    trash: "text-destructive",
  },
} as const;

interface QuantityStepperProps {
  quantity: number;
  /** Product ka naam — screen readers ke liye button labels */
  label: string;
  onDecrease: () => void;
  onIncrease: () => void;
  canDecrease?: boolean;
  canIncrease?: boolean;
  /** Cart line: minimum par minus button "remove" ban jata hai (trash icon) */
  removeAtMinimum?: boolean;
  atMinimum?: boolean;
  disabled?: boolean;
  size?: keyof typeof SIZES;
  variant?: keyof typeof VARIANTS;
  className?: string;
}

export function QuantityStepper({
  quantity,
  label,
  onDecrease,
  onIncrease,
  canDecrease = true,
  canIncrease = true,
  removeAtMinimum = false,
  atMinimum = false,
  disabled = false,
  size = "md",
  variant = "outline",
  className,
}: QuantityStepperProps) {
  const s = SIZES[size];
  const v = VARIANTS[variant];
  const removes = removeAtMinimum && atMinimum;
  const buttonClass = cn(
    "flex shrink-0 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed",
    s.button,
    v.button,
  );

  return (
    <div
      role="group"
      aria-label={`Quantity of ${label}`}
      className={cn("inline-flex items-center justify-between rounded-full", s.root, v.root, className)}
    >
      <button
        type="button"
        aria-label={removes ? `Remove ${label} from basket` : `Decrease quantity of ${label}`}
        className={buttonClass}
        disabled={disabled || (!removes && !canDecrease)}
        onClick={onDecrease}
      >
        {removes ? (
          <Trash2 className={cn(s.icon, v.trash)} aria-hidden="true" />
        ) : (
          <Minus className={s.icon} aria-hidden="true" />
        )}
      </button>
      <span className={cn("numeric text-center font-semibold", s.value)} aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        aria-label={`Increase quantity of ${label}`}
        className={buttonClass}
        disabled={disabled || !canIncrease}
        onClick={onIncrease}
      >
        <Plus className={s.icon} aria-hidden="true" />
      </button>
    </div>
  );
}
