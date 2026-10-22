import { describe, expect, it } from "vitest";
import type { ICategory } from "@/services/categories/types";
import { buildCategoryTree, findCategory, findParent, totalProducts } from "./category-tree";

const category = (id: string, name: string, parentId: string | null, productCount = 0) =>
  ({ id, name, parentId, productCount }) as ICategory;

describe("buildCategoryTree", () => {
  const tree = buildCategoryTree([
    category("veg", "Vegetables", "produce", 2),
    category("produce", "Fruits & Vegetables", null),
    category("bakery", "Bakery", null, 1),
    category("fruit", "Fresh Fruits", "produce", 3),
    // Parent inactive (list mein nahi) — child top-level par
    category("cheese", "Cheese", "hidden-dairy", 4),
  ]);

  it("nests children under their parent and sorts by name", () => {
    expect(tree.map((node) => node.name)).toEqual(["Bakery", "Cheese", "Fruits & Vegetables"]);
    expect(tree[2].children.map((node) => node.name)).toEqual(["Fresh Fruits", "Vegetables"]);
  });

  it("adds children into the parent's total", () => {
    expect(totalProducts(tree[2])).toBe(5);
    expect(totalProducts(tree[0])).toBe(1);
  });

  it("finds a category and its parent", () => {
    expect(findCategory(tree, "fruit")?.name).toBe("Fresh Fruits");
    expect(findParent(tree, "fruit")?.id).toBe("produce");
    expect(findParent(tree, "bakery")).toBeUndefined();
    expect(findCategory(tree, null)).toBeUndefined();
  });
});
