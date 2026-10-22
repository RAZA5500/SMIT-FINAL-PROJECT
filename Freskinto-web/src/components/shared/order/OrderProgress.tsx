import { Box } from "@/components/ui/box";
import { Flex } from "@/components/ui/flex";
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

/** Patli segmented bar (list cards) — cancelled/refund par poori bar halki laal (status badge saath hota hai) */
export function OrderProgress({ status, className }: { status: OrderStatus; className?: string }) {
  const current = STATUS_STEP[status];
  const stopped = current < 0;

  return (
    <Flex aria-hidden="true" gap="1" className={cn(className)}>
      {Array.from({ length: STEPS }, (_, index) => (
        <Box
          as="span"
          key={index}
          className={cn(
            "h-1.5 flex-1 rounded-full transition-colors",
            stopped
              ? "bg-destructive/25"
              : index < current
                ? "bg-primary"
                : index === current
                  ? "bg-tangerine"
                  : "bg-muted",
          )}
        />
      ))}
    </Flex>
  );
}
