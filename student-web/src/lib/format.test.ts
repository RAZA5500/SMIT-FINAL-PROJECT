import { describe, expect, it } from "vitest";
import { formatMoney, initials, pluralize } from "./format";

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
