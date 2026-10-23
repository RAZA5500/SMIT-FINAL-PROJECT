"use client";

import { CircleCheck, CircleX, FlaskConical, Nfc } from "lucide-react";
import { Controller, useWatch, type Control } from "react-hook-form";
import { Alert, AlertBody, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Box } from "@/components/ui/box";
import { Flex, Stack } from "@/components/ui/flex";
import { Tilt } from "@/components/ui/tilt";
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

/**
 * Decorative test card (no real card data anywhere — the gateway is a mock). Mouse ke saath jhukta
 * hai, roshni cursor ke peeche; "decline" chunne par card laal ho jata hai.
 */
function TestCardFace({ declined }: { declined: boolean }) {
  return (
    <Tilt
      max={12}
      aria-hidden="true"
      className="relative isolate aspect-[1.586] w-full max-w-sm overflow-hidden rounded-[1.6rem] bg-fresh p-5 text-[#06100b] shadow-lift sm:p-6"
    >
      <Box
        className={cn(
          "absolute inset-0 -z-10 bg-[linear-gradient(125deg,#ffb199_0%,#ff5a4f_55%,#e0457b_100%)] transition-opacity duration-700",
          declined ? "opacity-100" : "opacity-0",
        )}
      />
      <Box className="absolute -right-1/3 -bottom-2/3 -z-10 size-[120%] rounded-full border-[2.2rem] border-white/15" />
      <Box className="absolute inset-0 -z-10 bg-[radial-gradient(20rem_circle_at_var(--glare-x,25%)_var(--glare-y,10%),rgb(255_255_255/0.55),transparent_45%)]" />
      <Stack justify="between" className="h-full">
        <Flex align="center" justify="between">
          <Text as="span" weight="bold" tone="inherit" className="font-display text-lg tracking-[-0.05em] lowercase">
            {STORE.name}
          </Text>
          <Nfc className="size-6 opacity-70" />
        </Flex>
        <Box className="h-8 w-11 rounded-md bg-[linear-gradient(135deg,#fff6d5,#e9c46a_45%,#c99a2e)] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.12)]" />
        <Stack gap="1.5">
          <Text as="span" family="mono" tone="inherit" className="text-lg tracking-[0.16em]">
            4242 4242 4242 4242
          </Text>
          <Flex justify="between" className="opacity-75">
            <Text as="span" tone="inherit" className="text-fs-11 font-bold tracking-[0.16em] uppercase">
              {declined ? "Test card · decline" : "Test card · approve"}
            </Text>
            <Text as="span" tone="inherit" family="mono" className="text-fs-11">
              12/30
            </Text>
          </Flex>
        </Stack>
      </Stack>
    </Tilt>
  );
}

/** Mock gateway — card form ki jagah outcome (FLOW-MD 08 §16) */
export function MockOutcomeField({ control, disabled }: { control: Control<MockPaymentFormValues>; disabled?: boolean }) {
  const outcome = useWatch({ control, name: "outcome" });
  return (
    <Stack gap="5">
      <Alert variant="warning">
        <FlaskConical aria-hidden="true" />
        <AlertBody>
          <AlertTitle>Test payment</AlertTitle>
          <AlertDescription>This store uses a demo gateway — no real card is charged.</AlertDescription>
        </AlertBody>
      </Alert>
      <TestCardFace declined={outcome === "failed"} />
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
