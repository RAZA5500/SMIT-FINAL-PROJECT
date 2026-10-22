import * as z from "zod";
import { DELIVERY_TYPES } from "@/constants/enums";
import { addressSchema } from "./address.model";
import { emptyToUndefined } from "./helpers";

/**
 * FLOW-MD 09 §1.3. Yeh rules backend ke `OrderCreationService` mein DOBARA check
 * hote hain — frontend sirf achha UX deta hai.
 */
export const checkoutSchema = z
  .object({
    deliveryType: z.enum(DELIVERY_TYPES, { error: "Delivery type is required" }),
    addressId: z.preprocess(emptyToUndefined, z.string().uuid().optional()),
    shippingAddress: addressSchema.optional(),
    pickupScheduledAt: z.preprocess(emptyToUndefined, z.string().optional()),
    customerNotes: z.preprocess(
      emptyToUndefined,
      z.string().trim().max(500, "Notes cannot exceed 500 characters").optional(),
    ),
  })
  .superRefine((data, ctx) => {
    if (data.deliveryType === "DELIVERY") {
      if (!data.addressId && !data.shippingAddress) {
        ctx.addIssue({
          code: "custom",
          path: ["addressId"],
          message: "Select or enter a delivery address",
        });
      }
      if (data.addressId && data.shippingAddress) {
        ctx.addIssue({
          code: "custom",
          path: ["addressId"],
          message: "Choose either a saved address or a new address, not both",
        });
      }
    }
    if (data.deliveryType === "PICKUP") {
      if (!data.pickupScheduledAt) {
        ctx.addIssue({
          code: "custom",
          path: ["pickupScheduledAt"],
          message: "Choose a pickup time",
        });
      } else if (new Date(data.pickupScheduledAt).getTime() <= Date.now()) {
        ctx.addIssue({
          code: "custom",
          path: ["pickupScheduledAt"],
          message: "Pickup time must be in the future",
        });
      }
    }
  });

export type CheckoutFormInput = z.input<typeof checkoutSchema>;
export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
