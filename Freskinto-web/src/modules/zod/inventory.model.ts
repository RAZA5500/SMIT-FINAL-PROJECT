import * as z from "zod";
import { toNum } from "./helpers";

/** Add inventory — har product ki ek hi inventory row (backend 409 deta hai) */
export const inventorySchema = z.object({
  productId: z.string().min(1, "Product is required"),
  qtyOnHand: z.preprocess(
    toNum,
    z
      .number({ error: "Opening stock is required" })
      .int("Must be a whole number")
      .min(0, "Cannot be negative"),
  ),
  lowStockThreshold: z.preprocess(
    toNum,
    z.number().int("Must be a whole number").min(0, "Cannot be negative").optional(),
  ),
});

export type InventoryFormInput = z.input<typeof inventorySchema>;
export type InventoryFormValues = z.infer<typeof inventorySchema>;
