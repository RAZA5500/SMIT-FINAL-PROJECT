"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { MockOutcomeField } from "@/components/customer/checkout/MockOutcomeField";
import { AppModal } from "@/components/shared/AppModal";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { notifyPaymentResult, PaymentStartError, usePayOrder } from "@/hooks/usePayOrder";
import { toastError } from "@/lib/toast";
import { formatDateTime, formatMoney, scrollToFirstError } from "@/lib/utils";
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
  const { pay, isPending } = usePayOrder();

  const onPay = async ({ outcome }: MockPaymentFormValues) => {
    try {
      notifyPaymentResult(await pay(order.id, outcome), order.orderNumber);
      onOpenChange(false);
    } catch (error) {
      toastError(
        error instanceof PaymentStartError ? "Payment could not be started" : "Payment failed",
        (error as Error).message,
      );
    }
  };

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      title={`Pay for ${order.orderNumber}`}
      description={`Pay ${formatMoney(order.total)} by ${formatDateTime(order.paymentExpiresAt)} or the order will be cancelled automatically.`}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Not now
          </Button>
          <LoadingButton type="submit" form={FORM_ID} isLoading={isPending} loadingText="Processing payment…">
            <Lock aria-hidden="true" />
            Pay {formatMoney(order.total)}
          </LoadingButton>
        </>
      }
    >
      {/* Band hone par unmount — har dafa naya form */}
      <PayNowForm disabled={isPending} onPay={onPay} />
    </AppModal>
  );
}

function PayNowForm({ disabled, onPay }: { disabled: boolean; onPay: (values: MockPaymentFormValues) => void }) {
  const { control, handleSubmit } = useForm<MockPaymentFormValues>({
    resolver: zodResolver(mockPaymentSchema),
    mode: "onChange",
    defaultValues: { outcome: "succeeded" },
  });

  return (
    <Form id={FORM_ID} onSubmit={handleSubmit(onPay, () => scrollToFirstError(FORM_ID))}>
      <MockOutcomeField control={control} disabled={disabled} />
    </Form>
  );
}
