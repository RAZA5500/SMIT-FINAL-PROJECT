import { CircleX } from "lucide-react";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { IOrder } from "@/services/orders/types";
import { orderSteps } from "./order-steps";

/** Har status change ka timestamp backend rakhta hai (confirmedAt, processedAt, ...) */
export function OrderTimelineCard({ order }: { order: IOrder }) {
  const steps = orderSteps(order);
  const cancelled = Boolean(order.cancelledAt);
  // Cancel hua to sirf woh steps jo ho chuke the, phir "Cancelled"
  const visible = cancelled ? steps.filter((step) => step.at) : steps;
  const nextIndex = visible.findIndex((step) => !step.at);

  return (
    <section className="flex flex-col gap-5 rounded-3xl bg-card p-5 shadow-soft ring-1 ring-border sm:p-6">
      <h2 className="text-lg font-bold">Order tracking</h2>
      <ol className="relative flex flex-col">
        {visible.map((step, index) => {
          const Icon = step.icon;
          const done = Boolean(step.at);
          const isNext = index === nextIndex;
          const last = index === visible.length - 1 && !cancelled;
          return (
            <li key={step.key} className="relative flex gap-4 pb-6 last:pb-0">
              {!last && (
                <span
                  aria-hidden="true"
                  className={cn("absolute top-10 bottom-0 left-5 w-0.5 -translate-x-1/2", done ? "bg-primary" : "bg-border")}
                />
              )}
              <span
                className={cn(
                  "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full",
                  done && "bg-primary text-primary-foreground",
                  isNext && "bg-primary text-primary-foreground ring-4 ring-muted",
                  !done && !isNext && "bg-muted text-muted-foreground",
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div className="flex flex-col pt-2">
                <span className={cn("text-sm font-semibold", !done && !isNext && "text-muted-foreground")}>
                  {step.label}
                  {isNext && <span className="ml-2 text-xs font-medium text-brand">Up next</span>}
                </span>
                <span className="text-xs text-muted-foreground">{done ? formatDateTime(step.at) : "Pending"}</span>
              </div>
            </li>
          );
        })}
        {cancelled && (
          <li className="relative flex gap-4">
            <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive text-white">
              <CircleX className="size-5" aria-hidden="true" />
            </span>
            <div className="flex flex-col pt-2">
              <span className="text-sm font-semibold text-destructive">Cancelled</span>
              <span className="text-xs text-muted-foreground">{formatDateTime(order.cancelledAt)}</span>
            </div>
          </li>
        )}
      </ol>
    </section>
  );
}
