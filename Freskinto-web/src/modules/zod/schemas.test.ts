import { describe, expect, it } from "vitest";
import { customerCancelOrderSchema } from "./cancel-order.model";
import { checkoutSchema } from "./checkout.model";
import { inventoryAdjustmentSchema } from "./inventory-adjustment.model";
import { productSchema } from "./product.model";
import { registerSchema } from "./register.model";

const issuePaths = (result: { success: boolean; error?: { issues: { path: PropertyKey[] }[] } }) =>
  result.error?.issues.map((issue) => issue.path.join(".")) ?? [];

const address = { addressLine: "1 High Street", city: "London", county: "Greater London", postcode: "SW1A 1AA" };

describe("registerSchema", () => {
  it("reports a password mismatch on confirmPassword", () => {
    const result = registerSchema.safeParse({
      fullName: "Jane Doe",
      email: "jane@example.com",
      password: "Password1!",
      confirmPassword: "Password2!",
      terms: true,
    });
    expect(result.success).toBe(false);
    expect(issuePaths(result)).toContain("confirmPassword");
  });
});

describe("checkoutSchema", () => {
  it("requires a pickup time for PICKUP", () => {
    const result = checkoutSchema.safeParse({ deliveryType: "PICKUP" });
    expect(issuePaths(result)).toEqual(["pickupScheduledAt"]);
  });

  it("rejects a pickup time in the past", () => {
    const result = checkoutSchema.safeParse({
      deliveryType: "PICKUP",
      pickupScheduledAt: new Date(Date.now() - 60_000).toISOString(),
    });
    expect(issuePaths(result)).toEqual(["pickupScheduledAt"]);
  });

  it("requires a saved or new address for DELIVERY", () => {
    const result = checkoutSchema.safeParse({ deliveryType: "DELIVERY", addressId: "" });
    expect(issuePaths(result)).toEqual(["addressId"]);
  });

  it("accepts DELIVERY with an inline address", () => {
    expect(checkoutSchema.safeParse({ deliveryType: "DELIVERY", shippingAddress: address }).success).toBe(true);
  });
});

describe("productSchema", () => {
  const valid = {
    name: "Apples",
    categoryId: "cat-1",
    price: "2.50",
    minimumOrderQuantity: "1",
    maximumOrderQuantity: "10",
    isActive: true,
  };

  it("converts number inputs from strings", () => {
    const result = productSchema.safeParse(valid);
    expect(result.success && result.data.price).toBe(2.5);
  });

  it("reports an empty price as required", () => {
    const result = productSchema.safeParse({ ...valid, price: "" });
    expect(result.error?.issues[0]?.message).toBe("Price is required");
  });

  it("rejects max quantity below min quantity", () => {
    const result = productSchema.safeParse({ ...valid, minimumOrderQuantity: "5", maximumOrderQuantity: "2" });
    expect(issuePaths(result)).toEqual(["maximumOrderQuantity"]);
  });
});

describe("inventoryAdjustmentSchema", () => {
  it("rejects a zero quantity", () => {
    expect(inventoryAdjustmentSchema.safeParse({ quantity: "0", reason: "RECOUNT" }).success).toBe(false);
  });

  it("only allows negative quantities for DAMAGE", () => {
    expect(issuePaths(inventoryAdjustmentSchema.safeParse({ quantity: "3", reason: "DAMAGE" }))).toEqual([
      "quantity",
    ]);
    expect(inventoryAdjustmentSchema.safeParse({ quantity: "-3", reason: "DAMAGE" }).success).toBe(true);
  });
});

describe("customerCancelOrderSchema", () => {
  it("requires a note when the reason is OTHER", () => {
    expect(issuePaths(customerCancelOrderSchema.safeParse({ reason: "OTHER", note: "  " }))).toEqual(["note"]);
    expect(customerCancelOrderSchema.safeParse({ reason: "CHANGED_MIND" }).success).toBe(true);
  });
});
