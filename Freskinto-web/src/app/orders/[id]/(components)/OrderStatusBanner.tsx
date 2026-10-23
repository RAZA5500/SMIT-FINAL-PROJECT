import { CircleCheck, CircleX, Clock, CreditCard, PackageCheck, type LucideIcon } from "lucide-react";
import type { VariantProps } from "class-variance-authority";
import { Alert, AlertBody, AlertDescription, AlertTitle, type alertVariants } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Confetti } from "@/components/ui/confetti";
import { cn, formatDateTime } from "@/lib/utils";
import type { IOrder } from "@/services/orders/types";

type Tone = NonNullable<VariantProps<typeof alertVariants>["variant"]>;

/** Itni der tak "Paid & confirmed" par confetti — payment ke foran baad order page khulte hi */
const CELEBRATE_FOR_MS = 90_000;

function remaining(expiresAt: string, now: number): string {
  const seconds = Math.max(0, Math.floor((new Date(expiresAt).getTime() - now) / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

interface OrderStatusBannerProps {
  order: IOrder;
  now: number;
  canPay: boolean;
  onPay: () => void;
}

/** Order ka "ab kya" — payment window countdown, refund, delivered waghera */
export function OrderStatusBanner({ order, now, canPay, onPay }: OrderStatusBannerProps) {
  let tone: Tone = "default";
  let Icon: LucideIcon = Clock;
  let title = "";
  let text = "";

  switch (order.status) {
    case "PENDING":
      if (canPay) {
        tone = "warning";
        title = `Pay within ${remaining(order.paymentExpiresAt, now)} to confirm your order`;
        text = "Unpaid orders are cancelled automatically and the items go back on the shelf.";
      } else {
        title = "The payment window has closed";
        text = "This order will be cancelled shortly — you haven't been charged.";
      }
      break;
    case "CONFIRMED":
      tone = "success";
      Icon = CircleCheck;
      title = "Paid & confirmed";
      text = "We'll start preparing your order soon. You can still cancel until we do.";
      break;
    case "PROCESSING":
      tone = "info";
      Icon = PackageCheck;
      title = "We're preparing your order";
      text = "Your items are being picked and packed.";
      break;
    case "READY_FOR_PICKUP":
      tone = "brand";
      Icon = PackageCheck;
      title = "Ready to collect";
      text = `Collection time: ${formatDateTime(order.pickupScheduledAt)}.`;
      break;
    case "READY_FOR_DELIVERY":
      tone = "brand";
      Icon = PackageCheck;
      title = "On its way";
      text = "Your order is ready and heading to you.";
      break;
    case "DELIVERED":
      tone = "success";
      Icon = CircleCheck;
      title = order.deliveryType === "PICKUP" ? "Collected — enjoy!" : "Delivered — enjoy!";
      text = `Completed ${formatDateTime(order.deliveredAt)}.`;
      break;
    case "REFUND_PENDING":
      tone = "info";
      Icon = CreditCard;
      title = "Your refund is being processed";
      text = "The order is cancelled and your payment is on its way back to you.";
      break;
    case "CANCELLED":
      tone = "destructive";
      Icon = CircleX;
      title = "This order was cancelled";
      text = order.paymentStatus === "REFUNDED" ? "Your payment has been refunded." : "You haven't been charged.";
      break;
  }

  const justPaid =
    order.status === "CONFIRMED" &&
    order.confirmedAt !== null &&
    now - new Date(order.confirmedAt).getTime() < CELEBRATE_FOR_MS;

  return (
    // role="status" nahi — countdown har second badalta hai, screen reader shor na kare
    <Alert
      variant={tone}
      role="note"
      className={cn(
        "flex-wrap items-center gap-4 rounded-[1.75rem] px-5 py-5 sm:flex-nowrap",
        justPaid && "animate-pop-in border-brand/30 bg-brand-soft/60 dark:bg-brand/10",
      )}
    >
      {justPaid && <Confetti className="top-1/2 left-12 size-0" />}
      <Icon aria-hidden="true" className="size-7" />
      <AlertBody>
        <AlertTitle className="numeric text-lg">{title}</AlertTitle>
        <AlertDescription>{text}</AlertDescription>
      </AlertBody>
      {canPay && (
        <Button variant="fresh" onClick={onPay} className="w-full sm:w-auto">
          <CreditCard aria-hidden="true" />
          Pay now
        </Button>
      )}
    </Alert>
  );
}
