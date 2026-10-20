import type { CategoryRecord, ICategory } from '../types/category.types';

export function toCategory(category: CategoryRecord): ICategory {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    isActive: category.isActive,
    parentId: category.parentId,
    depth: category.depth,
    isLeaf: category._count.children === 0,
    childCount: category._count.children,
    productCount: category._count.products,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}
