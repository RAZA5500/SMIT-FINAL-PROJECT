import { CalendarClock, CircleX, MapPin, NotebookPen, Store, Truck, UserRound } from "lucide-react";
import { Alert, AlertBody, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Stack } from "@/components/ui/flex";
import { formatDateTime } from "@/lib/utils";
import { InfoRow } from "../InfoRow";

interface OrderInfoProps {
  pickup: boolean;
  /** `pickupScheduledAt` (ISO) */
  pickupAt: string | null;
  addressText: string | null;
  customer?: { name: string; email: string };
  notes: string | null;
  cancellation?: { reason: string; note: string | null } | null;
}

/** Delivery/pickup, customer, notes aur cancellation ki wajah — customer aur admin dono order detail mein */
export function OrderInfo({ pickup, pickupAt, addressText, customer, notes, cancellation }: OrderInfoProps) {
  const TypeIcon = pickup ? Store : Truck;

  return (
    <Stack gap="4">
      <InfoRow icon={<TypeIcon aria-hidden="true" />} label="Fulfilment">
        {pickup ? "Click & collect" : "Home delivery"}
      </InfoRow>
      {customer && (
        <InfoRow icon={<UserRound aria-hidden="true" />} label="Customer">
          {customer.name} · {customer.email}
        </InfoRow>
      )}
      {pickup ? (
        <InfoRow icon={<CalendarClock aria-hidden="true" />} label="Collection time">
          {formatDateTime(pickupAt)}
        </InfoRow>
      ) : (
        addressText && (
          <InfoRow icon={<MapPin aria-hidden="true" />} label="Delivery address">
            {addressText}
          </InfoRow>
        )
      )}
      {notes && (
        <InfoRow icon={<NotebookPen aria-hidden="true" />} label="Notes">
          {notes}
        </InfoRow>
      )}
      {cancellation && (
        <Alert variant="destructive">
          <CircleX aria-hidden="true" />
          <AlertBody>
            <AlertTitle>Cancelled: {cancellation.reason}</AlertTitle>
            {cancellation.note && <AlertDescription>{cancellation.note}</AlertDescription>}
          </AlertBody>
        </Alert>
      )}
    </Stack>
  );
}
