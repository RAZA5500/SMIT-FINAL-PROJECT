import type { ICategory } from "@/services/categories/types";

export interface CategoryNode {
  id: string;
  name: string;
  children: CategoryNode[];
}

/**
 * Flat list (parentId) → 2-level tree. Jis child ka parent list mein nahi (inactive
 * parent) woh top-level par dikhta hai.
 */
export function buildCategoryTree(categories: ICategory[]): CategoryNode[] {
  const ids = new Set(categories.map((category) => category.id));
  const nodes = new Map<string, CategoryNode>(
    categories.map((category) => [category.id, { id: category.id, name: category.name, children: [] }]),
  );
  const roots: CategoryNode[] = [];

  for (const category of categories) {
    const node = nodes.get(category.id)!;
    const parent = category.parentId && ids.has(category.parentId) ? nodes.get(category.parentId) : null;
    if (parent) parent.children.push(node);
    else roots.push(node);
  }

  const byName = (a: CategoryNode, b: CategoryNode) => a.name.localeCompare(b.name);
  roots.sort(byName);
  roots.forEach((root) => root.children.sort(byName));
  return roots;
}

export function findCategoryName(nodes: CategoryNode[], id: string | null): string | undefined {
  if (!id) return undefined;
  for (const node of nodes) {
    if (node.id === id) return node.name;
    const child = findCategoryName(node.children, id);
    if (child) return child;
  }
  return undefined;
}
