import { describe, expect, it } from "vitest";
import { categoryTheme, isNewProduct, productPackshot } from "./merchandising";

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
  it("maps aisles to a tint and falls back to the basket", () => {
    expect(categoryTheme("Fresh Fruits").tone).toBe("red");
    expect(categoryTheme("Frozen").tone).toBe("cyan");
    expect(categoryTheme("Household cleaning").tone).toBe("violet");
    expect(categoryTheme(undefined).tone).toBe("green");
  });
});

describe("isNewProduct", () => {
  it("is new for 14 days after creation", () => {
    const now = Date.parse("2026-10-21T12:00:00Z");
    expect(isNewProduct(new Date(now - 13 * DAY).toISOString(), now)).toBe(true);
    expect(isNewProduct(new Date(now - 15 * DAY).toISOString(), now)).toBe(false);
  });
});
