import { Item, ItemContent, ItemDescription, ItemGroup, ItemHeader } from "@/components/ui/item";
import { Text } from "@/components/ui/typography";
import { formatDateTime, formatMoney } from "@/lib/utils";
import { StatusBadge } from "../StatusBadge";

export interface PaymentAttempt {
  id: string;
  status: string;
  amount: string;
  gatewayRef: string;
  failureReason: string | null;
  paidAt: string | null;
  refundedAt: string | null;
  createdAt: string;
}

/** Har payment attempt (retry par naya attempt) — status, amount, gateway ref */
export function PaymentAttempts({ payments }: { payments: PaymentAttempt[] }) {
  if (payments.length === 0) {
    return <Text tone="muted">No payment attempts yet.</Text>;
  }

  return (
    <ItemGroup className="gap-2.5">
      {payments.map((payment) => (
        <Item key={payment.id} role="listitem" variant="muted" className="flex-col items-stretch gap-2 rounded-xl p-3.5">
          <ItemHeader>
            <StatusBadge status={payment.status} />
            <Text as="span" weight="semibold" numeric>
              {formatMoney(payment.amount)}
            </Text>
          </ItemHeader>
          <ItemContent className="gap-1">
            <ItemDescription className="text-fs-13">
              {payment.refundedAt
                ? `Refunded ${formatDateTime(payment.refundedAt)}`
                : payment.paidAt
                  ? `Paid ${formatDateTime(payment.paidAt)}`
                  : `Started ${formatDateTime(payment.createdAt)}`}
            </ItemDescription>
            <Text tone="muted" family="mono" className="truncate text-fs-12">
              Ref {payment.gatewayRef}
            </Text>
            {payment.failureReason && (
              <Text tone="destructive" weight="medium" className="text-fs-13">
                {payment.failureReason}
              </Text>
            )}
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  );
}
