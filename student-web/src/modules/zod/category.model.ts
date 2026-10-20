import * as z from "zod";
import { emptyToUndefined } from "./helpers";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Category name is required")
    .max(100, "Cannot exceed 100 characters"),
  description: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(500, "Cannot exceed 500 characters").optional(),
  ),
  /** null = top-level category (max 2 levels — backend enforce karta hai) */
  parentId: z.string().nullable(),
  isActive: z.boolean(),
});

export type CategoryFormInput = z.input<typeof categorySchema>;
export type CategoryFormValues = z.infer<typeof categorySchema>;
