import type { Prisma } from '@prisma/client';

/** Max 2 levels: top-level depth 0, child depth 1 */
export const CATEGORY_MAX_DEPTH = 1;

export const categoryInclude = {
  _count: { select: { children: true, products: true } },
} satisfies Prisma.CategoryInclude;

export type CategoryRecord = Prisma.CategoryGetPayload<{
  include: typeof categoryInclude;
}>;

export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  parentId: string | null;
  depth: number;
  /** Product sirf leaf (bina children) category mein ja sakta hai */
  isLeaf: boolean;
  childCount: number;
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IListCategoriesFilter {
  page: number;
  limit: number;
  parentId?: string;
  search?: string;
  isActive?: boolean;
}

export interface ICategoryWriteData {
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
  depth: number;
  isActive?: boolean;
}
