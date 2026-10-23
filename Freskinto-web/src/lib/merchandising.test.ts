import { describe, expect, it } from "vitest";
import { Apple, ShoppingBasket, Snowflake, SprayCan } from "lucide-react";
import { categoryTheme, isNewProduct, productPackshot, productVisual } from "./merchandising";

/** Sirf file ka naam — path badle to test na toote */
const shot = (name: string) => productPackshot(name)?.split("/").pop() ?? null;

const DAY = 24 * 60 * 60 * 1000;

describe("productPackshot", () => {
  it("picks the most specific photo", () => {
    expect(shot("Chicken Wings")).toBe("chicken-wings.webp");
    expect(shot("Fresh Chicken Breast")).toBe("fresh-chicken-breast.webp");
    expect(shot("Frozen Chicken Nuggets")).toBe("frozen-chicken-nuggets.webp");
    expect(shot("Multigrain Sandwich Bread")).toBe("multigrain-sandwich-bread.webp");
    expect(shot("Sourdough Loaf")).toBe("whole-wheat-bread-loaf.webp");
  });

  it("shows no photo rather than a misleading one", () => {
    expect(shot("Coconut Milk")).toBeNull();
    expect(shot("Black Pepper")).toBeNull();
    expect(shot("Vanilla Ice Cream")).toBeNull();
    expect(shot("Seasonal Plums")).toBeNull();
  });
});

describe("categoryTheme", () => {
  it("maps aisles to an icon and falls back to the basket", () => {
    expect(categoryTheme("Fresh Fruits").icon).toBe(Apple);
    expect(categoryTheme("Frozen").icon).toBe(Snowflake);
    expect(categoryTheme("Household cleaning").icon).toBe(SprayCan);
    expect(categoryTheme(undefined).icon).toBe(ShoppingBasket);
  });
});

describe("productVisual", () => {
  it("serves background-free cutouts with the food's own glow", () => {
    const apples = productVisual("Royal Gala Apples", "Fresh Fruits");
    expect(apples.image).toBe("/images/cutouts/royal-gala-apples.webp");
    expect(apples.aura).toBe("#ff5a4f");
    // milk glows sky blue even though the aisle default would also be sky
    expect(productVisual("Fresh Whole Milk 1L", "Dairy & Eggs").aura).toBe("#5fb9ff");
  });

  it("falls back to the aisle's glow when no photo fits", () => {
    const plums = productVisual("Seasonal Plums", "Fresh Fruits");
    expect(plums.image).toBeNull();
    expect(plums.aura).toBe(categoryTheme("Fresh Fruits").aura);
  });
});

describe("isNewProduct", () => {
  it("is new for 14 days after creation", () => {
    const now = Date.parse("2026-10-21T12:00:00Z");
    expect(isNewProduct(new Date(now - 13 * DAY).toISOString(), now)).toBe(true);
    expect(isNewProduct(new Date(now - 15 * DAY).toISOString(), now)).toBe(false);
  });
});
