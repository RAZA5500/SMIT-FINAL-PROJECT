import { CircleCheck, CircleX, Clock, CreditCard, Info, PackageCheck, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { IOrder } from "@/services/orders/types";

type Tone = "warning" | "success" | "info" | "danger" | "neutral";

const TONES: Record<Tone, string> = {
  warning: "bg-saffron-soft text-warning ring-saffron/40",
  success: "bg-lime-soft text-brand ring-lime/60",
  info: "bg-sky-50 text-sky-800 ring-sky-200",
  danger: "bg-tomato-soft text-destructive ring-tomato/30",
  neutral: "bg-muted text-muted-foreground ring-border",
};

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
  let tone: Tone = "neutral";
  let Icon: LucideIcon = Info;
  let title = "";
  let text = "";

  switch (order.status) {
    case "PENDING":
      if (canPay) {
        tone = "warning";
        Icon = Clock;
        title = `Pay within ${remaining(order.paymentExpiresAt, now)} to confirm your order`;
        text = "Unpaid orders are cancelled automatically and the items go back on the shelf.";
      } else {
        tone = "neutral";
        Icon = Clock;
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
      tone = "success";
      Icon = PackageCheck;
      title = "Ready to collect";
      text = `Collection time: ${formatDateTime(order.pickupScheduledAt)}.`;
      break;
    case "READY_FOR_DELIVERY":
      tone = "success";
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
      tone = "danger";
      Icon = CircleX;
      title = "This order was cancelled";
      text = order.paymentStatus === "REFUNDED" ? "Your payment has been refunded." : "You haven't been charged.";
      break;
  }

  return (
    // Live region nahi — countdown har second badalta hai, screen reader shor na kare
    <div className={cn("flex flex-col gap-3 rounded-2xl px-4 py-4 ring-1 sm:flex-row sm:items-center sm:px-5", TONES[tone])}>
      <Icon className="size-6 shrink-0" aria-hidden="true" />
      <div className="flex flex-1 flex-col gap-0.5">
        <p className="numeric font-semibold">{title}</p>
        <p className="text-sm opacity-85">{text}</p>
      </div>
      {canPay && (
        <Button onClick={onPay} className="shrink-0">
          <CreditCard aria-hidden="true" />
          Pay now
        </Button>
      )}
    </div>
  );
}
