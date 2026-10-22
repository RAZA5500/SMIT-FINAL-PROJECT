"use client";

import { CircleCheck, CircleX, FlaskConical, Nfc } from "lucide-react";
import { Controller, type Control } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Flex, Stack } from "@/components/ui/flex";
import { Text } from "@/components/ui/typography";
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
    <Card className={cn("relative w-full max-w-xs gap-6 p-5 shadow-soft")} aria-hidden="true">
      <Flex align="center" justify="between">
        <Text as="span" weight="bold" className={cn("font-heading text-lg font-bold text-foreground")}>
          {STORE.name}
        </Text>
        <Nfc className={cn("size-5 text-muted-foreground")} />
      </Flex>
      <Box className={cn("h-7 w-10 rounded-md border border-amber-400/60 bg-amber-200/50")} />
      <Stack gap="1">
        <Text as="span" variant="code" className={cn("text-sm tracking-widest")}>
          4242 4242 4242 4242
        </Text>
        <Flex justify="between">
          <Text as="span" variant="small" className={cn("font-semibold text-brand-green uppercase")}>
            Test card
          </Text>
          <Text as="span" variant="code" tone="muted">
            12/30
          </Text>
        </Flex>
      </Stack>
    </Card>
  );
}

/** Student mock gateway — card form ki jagah outcome (FLOW-MD 08 §16) */
export function MockOutcomeField({ control, disabled }: { control: Control<MockPaymentFormValues>; disabled?: boolean }) {
  return (
    <Stack gap="5">
      <Alert variant="warning">
        <FlaskConical aria-hidden="true" />
        <AlertTitle>Test payment</AlertTitle>
        <AlertDescription>This store uses a demo gateway — no real card is charged.</AlertDescription>
      </Alert>
      <TestCardFace />
      <Controller
        control={control}
        name="outcome"
        render={({ field, fieldState }) => (
          <Stack gap="2">
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
                  icon: (
                    <Icon
                      aria-hidden="true"
                      className={cn(outcome === "succeeded" ? "text-success" : "text-destructive")}
                    />
                  ),
                };
              })}
            />
            <FieldMessage id="outcome" error={fieldState.error?.message} />
          </Stack>
        )}
      />
    </Stack>
  );
}
