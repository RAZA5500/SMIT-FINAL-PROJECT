import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatTileProps {
  label: string;
  value: string | number | undefined;
  hint?: string;
  icon: LucideIcon;
  /** Icon ka rang (text-* token) */
  tone?: string;
  isLoading?: boolean;
  /** Diya ho to tile ek filter button ban jati hai */
  onSelect?: () => void;
  active?: boolean;
}

/** KPI tile: icon chip, uppercase micro label, bada number, ek line hint */
export function StatTile({ label, value, hint, icon: Icon, tone = "text-brand-green", isLoading, onSelect, active }: StatTileProps) {
  const body = (
    <>
      <span aria-hidden="true" className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted [&_svg]:size-5", tone)}>
        <Icon />
      </span>
      <span className="flex min-w-0 flex-col gap-1 text-left">
        <span className="text-fs-11 font-semibold tracking-wider text-muted-foreground uppercase">{label}</span>
        {isLoading ? (
          <Skeleton className="h-7 w-12" />
        ) : (
          <span className="numeric text-fs-28 leading-none font-semibold text-foreground">{value ?? "—"}</span>
        )}
        {hint && <span className="text-fs-12 text-muted-foreground">{hint}</span>}
      </span>
    </>
  );

  const base = "flex items-center gap-4 rounded-15 border bg-card p-4 shadow-soft";

  if (!onSelect) return <div className={cn(base, "border-border")}>{body}</div>;

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      className={cn(
        base,
        "w-full outline-none transition hover:-translate-y-0.5 hover:shadow-lift focus-visible:ring-3 focus-visible:ring-ring/35",
        active ? "border-primary ring-1 ring-primary" : "border-border",
      )}
    >
      {body}
    </button>
  );
}
