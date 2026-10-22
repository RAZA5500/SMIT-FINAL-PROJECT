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
    return <p className="text-sm text-muted-foreground">No payment attempts yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {payments.map((payment) => (
        <li key={payment.id} className="flex flex-col gap-2 rounded-xl border border-border bg-muted/40 p-3.5">
          <div className="flex items-center justify-between gap-3">
            <StatusBadge status={payment.status} />
            <span className="numeric text-sm font-semibold text-foreground">{formatMoney(payment.amount)}</span>
          </div>
          <p className="text-fs-13 text-muted-foreground">
            {payment.refundedAt
              ? `Refunded ${formatDateTime(payment.refundedAt)}`
              : payment.paidAt
                ? `Paid ${formatDateTime(payment.paidAt)}`
                : `Started ${formatDateTime(payment.createdAt)}`}
          </p>
          <p className="truncate font-mono text-fs-12 text-muted-foreground">Ref {payment.gatewayRef}</p>
          {payment.failureReason && <p className="text-fs-13 font-medium text-destructive">{payment.failureReason}</p>}
        </li>
      ))}
    </ul>
  );
}
