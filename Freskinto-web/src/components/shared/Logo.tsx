import { Leaf } from "lucide-react";
import { STORE } from "@/constants/store";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: { mark: "size-7 rounded-lg [&_svg]:size-4", word: "text-fs-20" },
  md: { mark: "size-9 rounded-xl [&_svg]:size-5", word: "text-fs-24" },
  lg: { mark: "size-12 rounded-2xl [&_svg]:size-6", word: "text-fs-32" },
} as const;

type LogoSize = keyof typeof SIZES;

/** Freskinto leaf mark — deep forest tile, mint leaf */
export function LogoMark({ size = "md", className }: { size?: LogoSize; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 -rotate-6 items-center justify-center bg-brand-green-forest text-brand-green-vivid shadow-soft",
        SIZES[size].mark,
        className,
      )}
    >
      <Leaf strokeWidth={2.2} />
    </span>
  );
}

interface LogoProps {
  size?: LogoSize;
  /** Sirf mark (collapsed sidebar, chhoti jagah) */
  markOnly?: boolean;
  /** Dark background par wordmark safed */
  inverse?: boolean;
  className?: string;
}

/** Mark + serif wordmark with a marigold full stop */
export function Logo({ size = "md", markOnly = false, inverse = false, className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark size={size} className={inverse ? "bg-brand-green-vivid text-brand-green-forest" : undefined} />
      {!markOnly && (
        <span
          className={cn(
            "font-display leading-none font-semibold tracking-tight",
            inverse ? "text-white" : "text-foreground",
            SIZES[size].word,
          )}
        >
          {STORE.name}
          <span aria-hidden="true" className="text-marigold">
            .
          </span>
        </span>
      )}
    </span>
  );
}
