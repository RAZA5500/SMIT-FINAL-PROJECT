import * as z from "zod";

/** FLOW-MD 09 §1.3 — backend limits ke mutabiq */
export const addressSchema = z.object({
  addressLine: z
    .string()
    .trim()
    .min(1, "Address is required")
    .max(100, "Address cannot exceed 100 characters"),
  city: z.string().trim().min(1, "City is required").max(30, "City cannot exceed 30 characters"),
  county: z
    .string()
    .trim()
    .min(1, "County is required")
    .max(30, "County cannot exceed 30 characters"),
  postcode: z
    .string()
    .trim()
    .min(1, "Postcode is required")
    .max(20, "Postcode cannot exceed 20 characters"),
});

/** Address book form — naya address default bhi ho sakta hai */
export const addressFormSchema = addressSchema.extend({
  isDefault: z.boolean(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
export type AddressBookFormValues = z.infer<typeof addressFormSchema>;
