import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime, formatMoney } from "@/lib/format";
import type { IOrder } from "@/services/orders/types";
import { StatusBadge } from "../StatusBadge";

/** Har payment attempt (retry par naya attempt) — status, amount, gateway ref */
export function OrderPaymentsCard({ order }: { order: IOrder }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-gray-900">Payments</CardTitle>
      </CardHeader>
      <CardContent>
        {order.payments.length === 0 ? (
          <p className="text-sm text-gray-500">No payment attempts yet.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-gray-100">
            {order.payments.map((payment) => (
              <li key={payment.id} className="flex flex-col gap-1 py-3 text-sm first:pt-0 last:pb-0">
                <div className="flex items-center justify-between gap-2">
                  <StatusBadge status={payment.status} />
                  <span className="font-medium text-gray-900">{formatMoney(payment.amount)}</span>
                </div>
                <p className="truncate text-xs text-gray-500">Ref: {payment.gatewayRef}</p>
                <p className="text-xs text-gray-500">
                  {payment.refundedAt
                    ? `Refunded ${formatDateTime(payment.refundedAt)}`
                    : payment.paidAt
                      ? `Paid ${formatDateTime(payment.paidAt)}`
                      : `Started ${formatDateTime(payment.createdAt)}`}
                </p>
                {payment.failureReason && <p className="text-xs text-destructive">{payment.failureReason}</p>}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
