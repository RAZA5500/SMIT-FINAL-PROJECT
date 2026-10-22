import { CalendarClock, MapPin, NotebookPen, Pencil, Store, Truck } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { InfoRow } from "@/components/shared/InfoRow";
import { DELIVERY_TYPE_LABELS } from "@/constants/labels";
import type { DeliveryType } from "@/constants/enums";
import { formatDateTime } from "@/lib/utils";
import type { CheckoutTab } from "@/modules/zod/checkout.model";

interface OrderReviewProps {
  deliveryType: DeliveryType | undefined;
  /** Delivery ke liye: poora address ek line mein */
  addressText: string | null;
  /** Pickup ke liye: `datetime-local` string */
  pickupAt: string | null;
  notes: string | null;
  onEdit: (tab: CheckoutTab) => void;
}

function ReviewSection({
  title,
  tab,
  onEdit,
  children,
}: {
  title: string;
  tab: CheckoutTab;
  onEdit: (tab: CheckoutTab) => void;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/40 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-heading text-fs-16 font-semibold">{title}</h3>
        <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(tab)}>
          <Pencil aria-hidden="true" />
          Edit
          <span className="sr-only"> {title.toLowerCase()}</span>
        </Button>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}

/** Checkout ka aakhri tab: jo chuna hai uska saaf khulasa — payment se pehle ek nazar */
export function OrderReview({ deliveryType, addressText, pickupAt, notes, onEdit }: OrderReviewProps) {
  const pickup = deliveryType === "PICKUP";
  const TypeIcon = pickup ? Store : Truck;

  return (
    <div className="flex flex-col gap-4">
      <ReviewSection title="Delivery method" tab="delivery" onEdit={onEdit}>
        <InfoRow icon={<TypeIcon aria-hidden="true" />} label="Method">
          {deliveryType ? DELIVERY_TYPE_LABELS[deliveryType] : "—"} · Free
        </InfoRow>
        {pickup ? (
          <InfoRow icon={<CalendarClock aria-hidden="true" />} label="Collection time">
            {pickupAt ? formatDateTime(pickupAt) : "—"}
          </InfoRow>
        ) : (
          <InfoRow icon={<MapPin aria-hidden="true" />} label="Delivery address">
            {addressText ?? "—"}
          </InfoRow>
        )}
      </ReviewSection>

      <ReviewSection title="Notes" tab="notes" onEdit={onEdit}>
        <InfoRow icon={<NotebookPen aria-hidden="true" />} label="Order notes">
          {notes ? notes : <span className="text-muted-foreground">No notes added</span>}
        </InfoRow>
      </ReviewSection>

      <p className="text-fs-13 text-muted-foreground">
        Your order is placed when you pay on the next step — the totals on the right are the final ones.
      </p>
    </div>
  );
}
