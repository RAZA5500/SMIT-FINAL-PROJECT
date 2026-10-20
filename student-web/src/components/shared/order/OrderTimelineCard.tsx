import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { IOrder } from "@/services/orders/types";

/** Har status change ka timestamp backend rakhta hai (confirmedAt, processedAt, ...) */
export function OrderTimelineCard({ order }: { order: IOrder }) {
  const steps = [
    { label: "Placed", at: order.createdAt },
    { label: "Confirmed (paid)", at: order.confirmedAt },
    { label: "Processing", at: order.processedAt },
    { label: order.deliveryType === "PICKUP" ? "Ready for pickup" : "Ready for delivery", at: order.readyAt },
    { label: order.deliveryType === "PICKUP" ? "Collected" : "Delivered", at: order.deliveredAt },
  ];
  if (order.cancelledAt) steps.push({ label: "Cancelled", at: order.cancelledAt });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-gray-900">Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="flex flex-col gap-3">
          {steps.map((step) => (
            <li key={step.label} className="flex items-center gap-3 text-sm">
              <span
                className={cn(
                  "size-2.5 shrink-0 rounded-full",
                  step.at ? (step.label === "Cancelled" ? "bg-destructive" : "bg-brand-green") : "bg-gray-200",
                )}
                aria-hidden="true"
              />
              <span className={cn("flex-1", step.at ? "text-gray-900" : "text-gray-400")}>{step.label}</span>
              <span className="text-xs text-gray-500">{step.at ? formatDateTime(step.at) : "—"}</span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
