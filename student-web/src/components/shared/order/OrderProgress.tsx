import type { OrderStatus } from "@/constants/enums";
import { cn } from "@/lib/utils";

/** Status → kitne steps mukammal (Placed, Confirmed, Preparing, Ready, Delivered) */
const STATUS_STEP: Record<OrderStatus, number> = {
  PENDING: 0,
  CONFIRMED: 1,
  PROCESSING: 2,
  READY_FOR_PICKUP: 3,
  READY_FOR_DELIVERY: 3,
  DELIVERED: 4,
  CANCELLED: -1,
  REFUND_PENDING: -1,
};

const STEPS = 5;

/** Patli progress bar (list cards) — cancelled/refund par poori bar dhundli laal */
export function OrderProgress({ status, className }: { status: OrderStatus; className?: string }) {
  const current = STATUS_STEP[status];
  const stopped = current < 0;

  return (
    <div className={cn("flex gap-1", className)} aria-hidden="true">
      {Array.from({ length: STEPS }, (_, index) => (
        <span
          key={index}
          className={cn(
            "h-1.5 flex-1 rounded-full",
            stopped ? "bg-destructive/25" : index <= current ? "bg-primary" : "bg-muted",
          )}
        />
      ))}
    </div>
  );
}
