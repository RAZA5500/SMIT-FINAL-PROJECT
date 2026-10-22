import { CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flex } from "@/components/ui/flex";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemHeader } from "@/components/ui/item";
import { Text } from "@/components/ui/typography";
import { formatDateTime, formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { IOrder } from "@/services/orders/types";
import { StatusBadge } from "../StatusBadge";

/** Har payment attempt (retry par naya attempt) — status, amount, gateway ref */
export function OrderPaymentsCard({ order }: { order: IOrder }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Flex as="span" align="center" gap="2">
            <CreditCard aria-hidden="true" className={cn("size-5 text-brand")} />
            Payments
          </Flex>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {order.payments.length === 0 ? (
          <Text tone="muted">No payment attempts yet.</Text>
        ) : (
          <ItemGroup className={cn("gap-2")}>
            {order.payments.map((payment) => (
              <Item key={payment.id} variant="muted" className={cn("rounded-xl")}>
                <ItemHeader>
                  <StatusBadge status={payment.status} />
                  <Text as="span" weight="semibold" numeric>
                    {formatMoney(payment.amount)}
                  </Text>
                </ItemHeader>
                <ItemContent className={cn("gap-0.5")}>
                  <ItemDescription>
                    {payment.refundedAt
                      ? `Refunded ${formatDateTime(payment.refundedAt)}`
                      : payment.paidAt
                        ? `Paid ${formatDateTime(payment.paidAt)}`
                        : `Started ${formatDateTime(payment.createdAt)}`}
                  </ItemDescription>
                  <Text variant="code" tone="muted" className={cn("truncate")}>
                    Ref {payment.gatewayRef}
                  </Text>
                  {payment.failureReason && (
                    <Text variant="small" tone="destructive" weight="medium">
                      {payment.failureReason}
                    </Text>
                  )}
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  );
}
