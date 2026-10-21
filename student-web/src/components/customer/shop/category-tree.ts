import type { ICategory } from "@/services/categories/types";

export interface CategoryNode {
  id: string;
  name: string;
  /** Sirf is category ke apne products (backend `productCount`) */
  productCount: number;
  children: CategoryNode[];
}

/**
 * Flat list (parentId) → 2-level tree. Jis child ka parent list mein nahi (inactive
 * parent) woh top-level par dikhta hai.
 */
export function buildCategoryTree(categories: ICategory[]): CategoryNode[] {
  const ids = new Set(categories.map((category) => category.id));
  const nodes = new Map<string, CategoryNode>(
    categories.map((category) => [
      category.id,
      { id: category.id, name: category.name, productCount: category.productCount, children: [] },
    ]),
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

/** Products sirf leaf categories mein hote hain — parent ka total = apne + children ke */
export function totalProducts(node: CategoryNode): number {
  return node.productCount + node.children.reduce((sum, child) => sum + totalProducts(child), 0);
}

export function findCategoryName(nodes: CategoryNode[], id: string | null): string | undefined {
  return findCategory(nodes, id)?.name;
}

export function findCategory(nodes: CategoryNode[], id: string | null): CategoryNode | undefined {
  if (!id) return undefined;
  for (const node of nodes) {
    if (node.id === id) return node;
    const child = findCategory(node.children, id);
    if (child) return child;
  }
  return undefined;
}

/** Child ho to us ka parent (breadcrumbs / active top-level pill) */
export function findParent(nodes: CategoryNode[], id: string | null): CategoryNode | undefined {
  if (!id) return undefined;
  return nodes.find((node) => node.children.some((child) => child.id === id));
}
