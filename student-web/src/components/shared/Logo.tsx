import { cn } from "@/lib/utils";

type LogoVariant = "default" | "inverse";

const MARK_COLORS: Record<LogoVariant, { tile: string; leaf: string; vein: string; spark: string }> = {
  default: { tile: "fill-brand", leaf: "fill-white", vein: "stroke-brand", spark: "fill-white" },
  // Dark or coloured surfaces: white tile so the mark still pops
  inverse: { tile: "fill-white", leaf: "fill-brand", vein: "stroke-white", spark: "fill-brand" },
};

const SIZES = {
  sm: { mark: "size-7", word: "text-lg" },
  md: { mark: "size-9", word: "text-2xl" },
  lg: { mark: "size-11", word: "text-3xl" },
} as const;

/** Freskinto leaf mark — same artwork as app/icon.svg */
export function LogoMark({ variant = "default", className }: { variant?: LogoVariant; className?: string }) {
  const colors = MARK_COLORS[variant];
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={cn("shrink-0", className)}>
      <rect width="48" height="48" rx="14" className={colors.tile} />
      <path d="M13.5 36.5c0-13.4 8.8-22.6 22.6-24 0 13.8-8.8 23-22.6 24Z" className={colors.leaf} />
      <path d="M16.6 33.4c3.6-6 8.6-11 14.6-14.8" strokeWidth="2.6" strokeLinecap="round" className={colors.vein} />
      <path d="M12 9.5l1.2 2.8 2.8 1.2-2.8 1.2-1.2 2.8-1.2-2.8-2.8-1.2 2.8-1.2z" className={colors.spark} />
    </svg>
  );
}

interface LogoProps {
  variant?: LogoVariant;
  size?: keyof typeof SIZES;
  /** Sirf mark (collapsed sidebar, chhoti jagah) */
  markOnly?: boolean;
  className?: string;
}

export function Logo({ variant = "default", size = "md", markOnly = false, className }: LogoProps) {
  const s = SIZES[size];
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark variant={variant} className={s.mark} />
      {!markOnly && (
        <span
          className={cn(
            "font-display leading-none font-bold tracking-tight",
            variant === "inverse" ? "text-white" : "text-foreground",
            s.word,
          )}
        >
          Freskinto
        </span>
      )}
    </span>
  );
}
