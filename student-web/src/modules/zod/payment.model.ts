import * as z from "zod";

/** Student mock gateway: card form ki jagah outcome choose hota hai (FLOW-MD 08 §16) */
export const MOCK_PAYMENT_OUTCOMES = ["succeeded", "failed"] as const;

export const mockPaymentSchema = z.object({
  outcome: z.enum(MOCK_PAYMENT_OUTCOMES, { error: "Choose a payment outcome" }),
});

export type MockPaymentFormValues = z.infer<typeof mockPaymentSchema>;
