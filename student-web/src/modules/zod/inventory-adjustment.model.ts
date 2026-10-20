import * as z from "zod";
import { ADJUSTMENT_REASONS, NEGATIVE_ONLY_ADJUSTMENT_REASONS } from "@/constants/enums";
import { emptyToUndefined, toNum } from "./helpers";

export const inventoryAdjustmentSchema = z
  .object({
    /** Negative = stock kam, positive = stock zyada */
    quantity: z.preprocess(
      toNum,
      z
        .number({ error: "Quantity is required" })
        .int("Quantity must be a whole number")
        .refine((value) => value !== 0, { message: "Quantity cannot be 0" }),
    ),
    reason: z.enum(ADJUSTMENT_REASONS, { error: "Reason is required" }),
    note: z.preprocess(
      emptyToUndefined,
      z.string().trim().max(500, "Note cannot exceed 500 characters").optional(),
    ),
  })
  .superRefine((data, ctx) => {
    if (NEGATIVE_ONLY_ADJUSTMENT_REASONS.includes(data.reason) && data.quantity > 0) {
      ctx.addIssue({
        code: "custom",
        path: ["quantity"],
        message: "Damage and returns to supplier must reduce stock (use a negative quantity)",
      });
    }
  });

export type InventoryAdjustmentFormInput = z.input<typeof inventoryAdjustmentSchema>;
export type InventoryAdjustmentFormValues = z.infer<typeof inventoryAdjustmentSchema>;
