"use client";

import { CircleCheck, CircleX, FlaskConical, Nfc } from "lucide-react";
import { Controller, type Control } from "react-hook-form";
import { Alert, AlertBody, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ChoiceCards } from "@/components/shared/ChoiceCards";
import { FieldMessage } from "@/components/shared/FieldMessage";
import { STORE } from "@/constants/store";
import { cn } from "@/lib/utils";
import { MOCK_PAYMENT_OUTCOMES, type MockPaymentFormValues } from "@/modules/zod/payment.model";

const OUTCOMES: Record<MockPaymentFormValues["outcome"], { label: string; hint: string; icon: typeof CircleCheck }> = {
  succeeded: { label: "Test card — approve", hint: "Simulates a successful payment", icon: CircleCheck },
  failed: { label: "Test card — decline", hint: "Simulates a declined card", icon: CircleX },
};

/** Decorative test card (no real card data anywhere — the gateway is a mock) */
function TestCardFace() {
  return (
    <div
      aria-hidden="true"
      className="relative flex w-full max-w-xs flex-col gap-6 overflow-hidden rounded-2xl bg-forest-gradient p-5 text-white shadow-lift"
    >
      <div className="flex items-center justify-between">
        <span className="font-sans text-fs-18 font-semibold">{STORE.name}</span>
        <Nfc className="size-5 text-white/70" />
      </div>
      <span className="h-7 w-10 rounded-md bg-marigold/80" />
      <div className="flex flex-col gap-1.5">
        <span className="font-mono text-sm tracking-widest">4242 4242 4242 4242</span>
        <div className="flex justify-between text-fs-11 font-semibold tracking-wider text-white/70 uppercase">
          <span>Test card</span>
          <span className="font-mono">12/30</span>
        </div>
      </div>
    </div>
  );
}

/** Mock gateway — card form ki jagah outcome (FLOW-MD 08 §16) */
export function MockOutcomeField({ control, disabled }: { control: Control<MockPaymentFormValues>; disabled?: boolean }) {
  return (
    <div className="flex flex-col gap-5">
      <Alert variant="warning">
        <FlaskConical aria-hidden="true" />
        <AlertBody>
          <AlertTitle>Test payment</AlertTitle>
          <AlertDescription>This store uses a demo gateway — no real card is charged.</AlertDescription>
        </AlertBody>
      </Alert>
      <TestCardFace />
      <Controller
        control={control}
        name="outcome"
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-2">
            <ChoiceCards
              id="payment-outcome"
              aria-label="Payment outcome"
              value={field.value}
              onValueChange={field.onChange}
              disabled={disabled}
              invalid={Boolean(fieldState.error)}
              aria-describedby={fieldState.error ? "outcome-error" : undefined}
              options={MOCK_PAYMENT_OUTCOMES.map((outcome) => {
                const { label, hint, icon: Icon } = OUTCOMES[outcome];
                return {
                  value: outcome,
                  title: label,
                  description: hint,
                  icon: <Icon aria-hidden="true" className={cn(outcome === "succeeded" ? "text-success" : "text-destructive")} />,
                };
              })}
            />
            <FieldMessage id="outcome" error={fieldState.error?.message} />
          </div>
        )}
      />
    </div>
  );
}
