"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: { root: "h-9 p-0.5", button: "size-8", value: "min-w-7 text-sm" },
  md: { root: "h-10 p-0.5", button: "size-9", value: "min-w-8 text-sm" },
  lg: { root: "h-12 p-1", button: "size-10", value: "min-w-10 text-base" },
} as const;

const VARIANTS = {
  // In-basket state on product cards — deep forest pill
  solid: {
    root: "bg-brand-green-forest text-white shadow-soft",
    button: "text-white hover:bg-white/15 hover:text-white disabled:opacity-40",
  },
  outline: {
    root: "border border-input bg-card text-foreground",
    button: "hover:bg-muted disabled:opacity-35",
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

/** − qty + pill. Quantity live region mein (screen readers ko nayi value sunai de) */
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

  return (
    <div
      role="group"
      aria-label={`Quantity of ${label}`}
      className={cn("inline-flex items-center justify-between rounded-full", s.root, v.root, className)}
    >
      <Button
        variant="ghost"
        size="icon"
        aria-label={removes ? `Remove ${label} from basket` : `Decrease quantity of ${label}`}
        disabled={disabled || (!removes && !canDecrease)}
        onClick={onDecrease}
        className={cn("rounded-full", s.button, v.button)}
      >
        {removes ? <Trash2 aria-hidden="true" /> : <Minus aria-hidden="true" />}
      </Button>
      <span aria-live="polite" className={cn("numeric text-center font-semibold", s.value)}>
        {quantity}
      </span>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Increase quantity of ${label}`}
        disabled={disabled || !canIncrease}
        onClick={onIncrease}
        className={cn("rounded-full", s.button, v.button)}
      >
        <Plus aria-hidden="true" />
      </Button>
    </div>
  );
}
