"use client";

import { CircleCheck, CircleX, FlaskConical } from "lucide-react";
import { Controller, type Control } from "react-hook-form";
import { FieldMessage } from "@/components/shared/FieldMessage";
import { RadioGroup } from "@/components/ui/radio-group";
import { MOCK_PAYMENT_OUTCOMES, type MockPaymentFormValues } from "@/modules/zod/payment.model";
import { ChoiceCard } from "../checkout/ChoiceCard";

const OUTCOMES: Record<MockPaymentFormValues["outcome"], { label: string; hint: string; icon: typeof CircleCheck }> = {
  succeeded: { label: "Test card — approve", hint: "Simulates a successful payment", icon: CircleCheck },
  failed: { label: "Test card — decline", hint: "Simulates a declined card", icon: CircleX },
};

/** Student mock gateway — card form ki jagah outcome (FLOW-MD 08 §16) */
export function MockOutcomeField({ control, disabled }: { control: Control<MockPaymentFormValues>; disabled?: boolean }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="flex items-start gap-2.5 rounded-xl bg-saffron-soft px-3.5 py-3 text-sm text-warning">
        <FlaskConical className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <span>
          <span className="font-semibold">Test payment.</span> This store uses a demo gateway — no real card is charged.
        </span>
      </p>
      <Controller
        control={control}
        name="outcome"
        render={({ field, fieldState }) => (
          <>
            <RadioGroup
              aria-label="Payment outcome"
              value={field.value}
              onValueChange={(value) => field.onChange(value)}
              disabled={disabled}
              className="grid gap-3 sm:grid-cols-2"
            >
              {MOCK_PAYMENT_OUTCOMES.map((outcome) => {
                const { label, hint, icon: Icon } = OUTCOMES[outcome];
                return (
                  <ChoiceCard
                    key={outcome}
                    value={outcome}
                    title={label}
                    description={hint}
                    icon={<Icon className={outcome === "succeeded" ? "text-success" : "text-destructive"} aria-hidden="true" />}
                  />
                );
              })}
            </RadioGroup>
            <FieldMessage id="outcome" error={fieldState.error?.message} />
          </>
        )}
      />
    </div>
  );
}
