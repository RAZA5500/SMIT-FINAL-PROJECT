import * as z from "zod";
import { toNum } from "./helpers";

const quantity = (label: string) =>
  z.preprocess(
    toNum,
    z
      .number({ error: `${label} is required` })
      .int(`${label} must be a whole number`)
      .min(1, `${label} must be at least 1`),
  );

export const productSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Product name is required")
      .max(100, "Cannot exceed 100 characters"),
    categoryId: z.string().min(1, "Category is required"),
    price: z.preprocess(
      toNum,
      z
        .number({ error: "Price is required" })
        .min(0.01, "Price must be at least 0.01")
        .max(99999999.99, "Price is too large")
        .refine((value) => Number.isInteger(Math.round(value * 100 * 1e6) / 1e6), {
          message: "Price can have at most 2 decimal places",
        }),
    ),
    minimumOrderQuantity: quantity("Minimum order quantity"),
    maximumOrderQuantity: quantity("Maximum order quantity"),
    isActive: z.boolean(),
  })
  .refine((data) => data.maximumOrderQuantity >= data.minimumOrderQuantity, {
    message: "Maximum order quantity must be greater than or equal to the minimum",
    path: ["maximumOrderQuantity"],
  });

export type ProductFormInput = z.input<typeof productSchema>;
export type ProductFormValues = z.infer<typeof productSchema>;

/** Multi-step form: har tab ke fields — tab badalne se pehle `trigger(TAB_FIELDS[tab])` (FLOW-MD 07 §6) */
export const PRODUCT_FORM_TABS = ["basic", "pricing", "review"] as const;
export type ProductFormTab = (typeof PRODUCT_FORM_TABS)[number];

export const TAB_FIELDS: Record<ProductFormTab, (keyof ProductFormValues)[]> = {
  basic: ["name", "categoryId", "isActive"],
  pricing: ["price", "minimumOrderQuantity", "maximumOrderQuantity"],
  review: [],
};
