import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DataTableCardProps {
  /** Search + filters + actions row */
  toolbar?: ReactNode;
  /** Table, ya loading/empty/error state */
  children: ReactNode;
  /** Pagination (khali list par mat bhejo) */
  footer?: ReactNode;
  /** Data refetch ho raha ho (keepPreviousData) — halka fade */
  busy?: boolean;
  className?: string;
}

/** Admin list screens ka card: toolbar → table → pagination */
export function DataTableCard({ toolbar, children, footer, busy = false, className }: DataTableCardProps) {
  return (
    <section
      aria-busy={busy || undefined}
      className={cn("flex min-w-0 flex-col overflow-hidden rounded-2xl bg-card shadow-soft ring-1 ring-border", className)}
    >
      {toolbar && <div className="flex flex-wrap items-center gap-3 border-b p-4">{toolbar}</div>}
      <div className={cn("min-w-0 overflow-x-auto", busy && "opacity-60 transition-opacity")}>{children}</div>
      {footer && <div className="border-t bg-muted/30 px-4 py-3">{footer}</div>}
    </section>
  );
}

/** Toolbar filters ka group — chhoti screen par wrap */
export function ToolbarFilters({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-2 md:ml-auto">{children}</div>;
}
