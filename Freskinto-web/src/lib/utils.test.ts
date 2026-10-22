import { describe, expect, it } from "vitest";
import { cn, formatMoney, initials, pluralize } from "./utils";

describe("format helpers", () => {
  it("pluralizes together with the count", () => {
    expect(pluralize(1, "item")).toBe("1 item");
    expect(pluralize(0, "item")).toBe("0 items");
    expect(pluralize(3, "category", "categories")).toBe("3 categories");
  });

  it("formats API money strings without doing maths", () => {
    expect(formatMoney("12.5")).toBe("£12.50");
    expect(formatMoney(3)).toBe("£3.00");
    expect(formatMoney("not-a-number")).toBe("£0.00");
  });

  it("builds avatar initials", () => {
    expect(initials("Ayesha Khan")).toBe("AK");
    expect(initials("  cher ")).toBe("C");
    expect(initials(null)).toBe("?");
  });
});

describe("cn()", () => {
  it("drops falsy conditionals", () => {
    expect(cn("p-4", false && "p-8", undefined, "text-sm")).toBe("p-4 text-sm");
  });

  it("knows the custom design tokens", () => {
    // font-size token + colour must not cancel each other
    expect(cn("text-fs-13", "text-muted-foreground")).toBe("text-fs-13 text-muted-foreground");
    // two font-size tokens → last wins
    expect(cn("text-fs-13", "text-fs-15")).toBe("text-fs-15");
    // custom shadow token conflicts with the default scale
    expect(cn("shadow-soft", "shadow-md")).toBe("shadow-md");
    expect(cn("shadow-lg", "shadow-soft")).toBe("shadow-soft");
  });
});
