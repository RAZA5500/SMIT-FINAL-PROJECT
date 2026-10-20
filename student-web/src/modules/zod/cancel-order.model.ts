import * as z from "zod";
import { ADMIN_CANCEL_REASONS, CUSTOMER_CANCEL_REASONS } from "@/constants/enums";
import { emptyToUndefined } from "./helpers";

const note = z.preprocess(
  emptyToUndefined,
  z.string().trim().max(500, "Note cannot exceed 500 characters").optional(),
);

/** `OTHER` reason par note zaroori (FLOW-MD 01 §18) */
function requireNoteForOther(data: { reason: string; note?: string }, ctx: z.RefinementCtx) {
  if (data.reason === "OTHER" && !data.note) {
    ctx.addIssue({
      code: "custom",
      path: ["note"],
      message: "Please tell us the reason",
    });
  }
}

export const customerCancelOrderSchema = z
  .object({
    reason: z.enum(CUSTOMER_CANCEL_REASONS, { error: "Please choose a reason" }),
    note,
  })
  .superRefine(requireNoteForOther);

export const adminCancelOrderSchema = z
  .object({
    reason: z.enum(ADMIN_CANCEL_REASONS, { error: "Please choose a reason" }),
    note,
  })
  .superRefine(requireNoteForOther);

export type CustomerCancelOrderInput = z.input<typeof customerCancelOrderSchema>;
export type CustomerCancelOrderValues = z.infer<typeof customerCancelOrderSchema>;
export type AdminCancelOrderInput = z.input<typeof adminCancelOrderSchema>;
export type AdminCancelOrderValues = z.infer<typeof adminCancelOrderSchema>;
