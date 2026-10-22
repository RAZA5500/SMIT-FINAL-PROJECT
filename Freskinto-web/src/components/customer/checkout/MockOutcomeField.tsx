"use client";

import { CircleCheck, CircleX, FlaskConical, Nfc } from "lucide-react";
import { Controller, type Control } from "react-hook-form";
import { Alert, AlertBody, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Box } from "@/components/ui/box";
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
    <Stack
      aria-hidden="true"
      gap="6"
      className="relative w-full max-w-xs -rotate-2 overflow-hidden rounded-2xl bg-night p-5 text-night-foreground shadow-lift transition-transform hover:rotate-0"
    >
      <Box className="absolute -top-10 -right-10 size-32 rounded-full bg-primary/50 blur-2xl" />
      <Flex align="center" justify="between" className="relative">
        <Text as="span" family="heading" weight="extrabold" tone="inherit" className="text-lg">
          {STORE.name.toLowerCase()}
          <Text as="span" tone="inherit" className="text-tangerine">
            .
          </Text>
        </Text>
        <Nfc className="size-5 text-night-muted" />
      </Flex>
      <Box className="relative h-7 w-10 rounded-md bg-lime" />
      <Stack gap="1.5" className="relative">
        <Text as="span" tone="inherit" family="mono" className="tracking-widest">
          4242 4242 4242 4242
        </Text>
        <Flex justify="between" className="text-fs-11 font-semibold tracking-wider text-night-muted uppercase">
          <Text as="span" tone="inherit" className="text-fs-11">
            Test card
          </Text>
          <Text as="span" tone="inherit" family="mono" className="text-fs-11">
            12/30
          </Text>
        </Flex>
      </Stack>
    </Stack>
  );
}

/** Mock gateway — card form ki jagah outcome (FLOW-MD 08 §16) */
export function MockOutcomeField({ control, disabled }: { control: Control<MockPaymentFormValues>; disabled?: boolean }) {
  return (
    <Stack gap="5">
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
                  icon: <Icon aria-hidden="true" className={cn(outcome === "succeeded" ? "text-success" : "text-destructive")} />,
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
