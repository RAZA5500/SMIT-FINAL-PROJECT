import type { IPaginationPayload } from "@/services/types";

/** Backend `ICategory` — max 2 levels (depth 0 = top-level, 1 = child) */
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
  createdAt: string;
  updatedAt: string;
}

export interface IFetchCategoriesPayload extends IPaginationPayload {
  parentId?: string;
  search?: string;
}

export interface IFetchAdminCategoriesPayload extends IFetchCategoriesPayload {
  isActive?: boolean;
}

export interface ICreateCategoryPayload {
  name: string;
  description?: string;
  /** null / na ho = top-level */
  parentId?: string | null;
  isActive?: boolean;
}

/** `description: null` khali karta hai, `parentId: null` top-level par le jata hai */
export interface IUpdateCategoryPayload {
  name?: string;
  description?: string | null;
  parentId?: string | null;
  isActive?: boolean;
}
