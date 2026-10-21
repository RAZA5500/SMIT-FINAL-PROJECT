import { CreditCard } from "lucide-react";
import { formatDateTime, formatMoney } from "@/lib/format";
import type { IOrder } from "@/services/orders/types";
import { StatusBadge } from "../StatusBadge";

/** Har payment attempt (retry par naya attempt) — status, amount, gateway ref */
export function OrderPaymentsCard({ order }: { order: IOrder }) {
  return (
    <section className="flex flex-col gap-4 rounded-3xl bg-card p-5 shadow-soft ring-1 ring-border sm:p-6">
      <h2 className="flex items-center gap-2 text-lg font-bold">
        <CreditCard className="size-5 text-brand" aria-hidden="true" />
        Payments
      </h2>
      {order.payments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No payment attempts yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {order.payments.map((payment) => (
            <li key={payment.id} className="flex flex-col gap-1.5 rounded-xl bg-muted/50 p-3.5 text-sm">
              <div className="flex items-center justify-between gap-2">
                <StatusBadge status={payment.status} />
                <span className="numeric font-semibold">{formatMoney(payment.amount)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {payment.refundedAt
                  ? `Refunded ${formatDateTime(payment.refundedAt)}`
                  : payment.paidAt
                    ? `Paid ${formatDateTime(payment.paidAt)}`
                    : `Started ${formatDateTime(payment.createdAt)}`}
              </p>
              <p className="truncate font-mono text-xs text-muted-foreground">Ref {payment.gatewayRef}</p>
              {payment.failureReason && <p className="text-xs font-medium text-destructive">{payment.failureReason}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
