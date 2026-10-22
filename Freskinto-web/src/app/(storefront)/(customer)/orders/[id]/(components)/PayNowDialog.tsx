"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { MockOutcomeField } from "@/components/customer/checkout/MockOutcomeField";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { notifyPaymentResult, PaymentStartError, usePayOrder } from "@/hooks/usePayOrder";
import { formatDateTime, formatMoney } from "@/lib/format";
import { toastError } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { mockPaymentSchema, type MockPaymentFormValues } from "@/modules/zod/payment.model";
import type { IOrder } from "@/services/orders/types";

const FORM_ID = "pay-now-form";

interface PayNowDialogProps {
  order: IOrder;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** PENDING order ki payment retry — backend existing UNPAID payment reuse karta hai */
export function PayNowDialog({ order, open, onOpenChange }: PayNowDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-lg")}>
        {/* Band hone par unmount — har dafa naya form */}
        <PayNowForm order={order} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function PayNowForm({ order, onDone }: { order: IOrder; onDone: () => void }) {
  const { pay, isPending } = usePayOrder();
  const { control, handleSubmit } = useForm<MockPaymentFormValues>({
    resolver: zodResolver(mockPaymentSchema),
    defaultValues: { outcome: "succeeded" },
  });

  const onSubmit = async ({ outcome }: MockPaymentFormValues) => {
    try {
      notifyPaymentResult(await pay(order.id, outcome), order.orderNumber);
      onDone();
    } catch (error) {
      toastError(
        error instanceof PaymentStartError ? "Payment could not be started" : "Payment failed",
        (error as Error).message,
      );
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Pay for {order.orderNumber}</DialogTitle>
        <DialogDescription>
          Pay {formatMoney(order.total)} by {formatDateTime(order.paymentExpiresAt)} or the order will be cancelled
          automatically.
        </DialogDescription>
      </DialogHeader>
      <Form id={FORM_ID} onSubmit={handleSubmit(onSubmit)}>
        <MockOutcomeField control={control} disabled={isPending} />
      </Form>
      <DialogFooter>
        <Button variant="outline" onClick={onDone} disabled={isPending}>
          Not now
        </Button>
        <LoadingButton type="submit" form={FORM_ID} isLoading={isPending} loadingText="Processing payment…">
          <Lock data-icon="inline-start" aria-hidden="true" />
          Pay {formatMoney(order.total)}
        </LoadingButton>
      </DialogFooter>
    </>
  );
}
