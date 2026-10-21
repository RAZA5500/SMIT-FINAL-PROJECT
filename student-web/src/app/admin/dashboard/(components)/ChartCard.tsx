"use client";

import { ChartColumn, Table2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  /** Chart (visual) */
  chart: ReactNode;
  /** Same data as a table — har chart ka accessible twin */
  table: ReactNode;
  className?: string;
}

/** Chart container: title + chart/table toggle (table view sab values bina hover ke deta hai) */
export function ChartCard({ title, subtitle, chart, table, className }: ChartCardProps) {
  const [view, setView] = useState<"chart" | "table">("chart");

  return (
    <figure className={cn("flex flex-col gap-4 rounded-2xl bg-card p-5 shadow-soft ring-1 ring-border sm:p-6", className)}>
      <figcaption className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 className="font-sans text-base font-semibold">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex shrink-0 rounded-full bg-muted p-0.5" role="group" aria-label={`${title} view`}>
          {(
            [
              { key: "chart", label: "Chart", icon: ChartColumn },
              { key: "table", label: "Table", icon: Table2 },
            ] as const
          ).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              aria-pressed={view === key}
              onClick={() => setView(key)}
              className={cn(
                "inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium transition-colors",
                view === key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-3.5" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </figcaption>
      {view === "chart" ? chart : table}
    </figure>
  );
}
