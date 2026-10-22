import { CalendarClock, MapPin, NotebookPen, Pencil, Store, Truck } from "lucide-react";
import type { ReactNode } from "react";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Flex, Stack } from "@/components/ui/flex";
import { Heading, Text } from "@/components/ui/typography";
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
    <Stack as="section" gap="3" className="rounded-xl border border-border bg-muted/40 p-4">
      <Flex align="center" justify="between" gap="3">
        <Heading as="h3" size="5">
          {title}
        </Heading>
        <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(tab)}>
          <Pencil aria-hidden="true" />
          Edit
          <Text as="span" className="sr-only">
            {" "}
            {title.toLowerCase()}
          </Text>
        </Button>
      </Flex>
      <Stack gap="3">{children}</Stack>
    </Stack>
  );
}

/** Checkout ka aakhri tab: jo chuna hai uska saaf khulasa — payment se pehle ek nazar */
export function OrderReview({ deliveryType, addressText, pickupAt, notes, onEdit }: OrderReviewProps) {
  const pickup = deliveryType === "PICKUP";
  const TypeIcon = pickup ? Store : Truck;

  return (
    <Stack gap="4">
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
          {notes ? notes : (
            <Text as="span" tone="muted">
              No notes added
            </Text>
          )}
        </InfoRow>
      </ReviewSection>

      <Box>
        <Text tone="muted" className="text-fs-13">
          Your order is placed when you pay on the next step — the totals on the right are the final ones.
        </Text>
      </Box>
    </Stack>
  );
}
