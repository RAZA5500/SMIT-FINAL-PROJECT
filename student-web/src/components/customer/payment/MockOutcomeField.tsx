"use client";

import { CircleCheck, CircleX, FlaskConical } from "lucide-react";
import { Controller, type Control } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { MOCK_PAYMENT_OUTCOMES, type MockPaymentFormValues } from "@/modules/zod/payment.model";

const OUTCOMES: Record<MockPaymentFormValues["outcome"], { label: string; hint: string; icon: typeof CircleCheck }> = {
  succeeded: { label: "Approve payment", hint: "Simulates a successful card payment", icon: CircleCheck },
  failed: { label: "Decline payment", hint: "Simulates a declined card", icon: CircleX },
};

/** Student mock gateway — card form ki jagah outcome (FLOW-MD 08 §16) */
export function MockOutcomeField({
  control,
  disabled,
}: {
  control: Control<MockPaymentFormValues>;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="flex items-center gap-2 rounded-10 bg-amber-50 px-3 py-2 text-xs text-amber-700">
        <FlaskConical className="size-4 shrink-0" aria-hidden="true" />
        Test payment — no real card is charged.
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
                  <label
                    key={outcome}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-15 border p-4 transition-colors",
                      field.value === outcome ? "border-brand-green bg-accent" : "border-gray-200 hover:border-gray-300",
                    )}
                  >
                    <RadioGroupItem value={outcome} />
                    <Icon
                      className={cn("size-5", outcome === "succeeded" ? "text-brand-green" : "text-destructive")}
                      aria-hidden="true"
                    />
                    <span className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">{label}</span>
                      <span className="text-xs text-gray-500">{hint}</span>
                    </span>
                  </label>
                );
              })}
            </RadioGroup>
            {fieldState.error && (
              <p role="alert" className="text-xs text-destructive">
                {fieldState.error.message}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
}
