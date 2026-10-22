import { initials } from "@/lib/format";
import { categoryTheme, TONE_CLASSES } from "@/lib/merchandising";
import { cn } from "@/lib/utils";

/** Brand "logo" — initials on the aisle's tint (no real logos in the demo) */
export function BrandMonogram({ name, aisle, className }: { name: string; aisle?: string; className?: string }) {
  const tone = TONE_CLASSES[categoryTheme(aisle).tone];
  return (
    <span
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-xl font-display text-sm font-bold ring-1 ring-border",
        tone.tile,
        tone.icon,
        className,
      )}
      aria-hidden="true"
    >
      {initials(name || "?")}
    </span>
  );
}
