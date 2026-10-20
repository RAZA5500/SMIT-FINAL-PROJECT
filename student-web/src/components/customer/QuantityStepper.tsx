"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const SIZES = {
  md: {
    stepper: "w-25 p-0.5 md:p-1 h-7 md:h-auto",
    button: "size-6 md:size-7.5",
    icon: "size-3",
  },
  sm: {
    stepper: "w-20 p-0.5 md:p-1 h-7 md:h-auto",
    button: "size-5 md:size-6",
    icon: "size-2.5",
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
  className,
}: QuantityStepperProps) {
  const s = SIZES[size];
  const removes = removeAtMinimum && atMinimum;
  const buttonClass = cn(
    "flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-border-gray transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40",
    s.button,
  );

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-between rounded-full border border-border-gray",
        s.stepper,
        className,
      )}
    >
      <button
        type="button"
        aria-label={removes ? `Remove ${label} from cart` : `Decrease quantity of ${label}`}
        className={buttonClass}
        disabled={disabled || (!removes && !canDecrease)}
        onClick={onDecrease}
      >
        {removes ? (
          <Trash2 className={cn(s.icon, "text-red-500")} aria-hidden="true" />
        ) : (
          <Minus className={cn(s.icon, "text-gray-900")} aria-hidden="true" />
        )}
      </button>
      <span className="text-xs font-medium text-gray-900" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        aria-label={`Increase quantity of ${label}`}
        className={buttonClass}
        disabled={disabled || !canIncrease}
        onClick={onIncrease}
      >
        <Plus className={cn(s.icon, "text-gray-900")} aria-hidden="true" />
      </button>
    </div>
  );
}
