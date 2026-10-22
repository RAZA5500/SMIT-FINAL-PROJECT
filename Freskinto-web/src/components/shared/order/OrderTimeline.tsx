import { CircleX, type LucideIcon } from "lucide-react";
import { cn, formatDateTime } from "@/lib/utils";

export interface TimelineStep {
  key: string;
  label: string;
  icon: LucideIcon;
  /** Backend timestamp — null = abhi nahi hua */
  at: string | null;
}

interface OrderTimelineProps {
  steps: TimelineStep[];
  /** Cancel hua to sirf wohi steps jo ho chuke the, phir "Cancelled" */
  cancelledAt?: string | null;
  className?: string;
}

/** Vertical order tracking: har step ka timestamp, agla step "Up next" */
export function OrderTimeline({ steps, cancelledAt, className }: OrderTimelineProps) {
  const cancelled = Boolean(cancelledAt);
  const visible = cancelled ? steps.filter((step) => step.at) : steps;
  const nextIndex = visible.findIndex((step) => !step.at);

  return (
    <ol className={cn("flex flex-col", className)}>
      {visible.map((step, index) => {
        const Icon = step.icon;
        const done = Boolean(step.at);
        const isNext = index === nextIndex && !cancelled;
        const last = index === visible.length - 1 && !cancelled;
        return (
          <li key={step.key} className="relative flex gap-4 pb-6 last:pb-0">
            {!last && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-10 bottom-0 left-5 w-px -translate-x-1/2 border-l-2",
                  done ? "border-brand-green" : "border-dashed border-input",
                )}
              />
            )}
            <span
              className={cn(
                "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full [&_svg]:size-5",
                done && "bg-brand-green text-white",
                isNext && "border-2 border-brand-green bg-brand-soft text-brand-green",
                !done && !isNext && "border border-border bg-card text-muted-foreground",
              )}
            >
              <Icon aria-hidden="true" />
            </span>
            <div className="flex flex-col gap-0.5 pt-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <p className={cn("text-sm font-semibold", done || isNext ? "text-foreground" : "text-muted-foreground")}>
                  {step.label}
                </p>
                {isNext && (
                  <span className="rounded-full bg-brand-soft px-2 py-0.5 text-fs-11 font-semibold text-brand-green-dark">
                    Up next
                  </span>
                )}
              </div>
              <p className="numeric text-fs-13 text-muted-foreground">{done ? formatDateTime(step.at) : "Pending"}</p>
            </div>
          </li>
        );
      })}
      {cancelled && (
        <li className="relative flex gap-4">
          <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive text-white [&_svg]:size-5">
            <CircleX aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-0.5 pt-1.5">
            <p className="text-sm font-semibold text-destructive">Cancelled</p>
            <p className="numeric text-fs-13 text-muted-foreground">{formatDateTime(cancelledAt)}</p>
          </div>
        </li>
      )}
    </ol>
  );
}
