export interface IPaginationMeta {
  total: number;
  currentPage: number;
  limit: number;
  pages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/** Har list response ki shape: hamesha `data` + `meta` (FLOW-MD 05 §4) */
export interface IPaginated<T> {
  data: T[];
  meta: IPaginationMeta;
}

export function buildMeta(
  total: number,
  page: number,
  limit: number,
): IPaginationMeta {
  const pages = Math.ceil(total / limit);
  return {
    total,
    currentPage: page,
    limit,
    pages,
    hasNextPage: page < pages,
    hasPrevPage: page > 1,
  };
}

/** Prisma `skip`/`take` page aur limit se */
export function toSkipTake(page: number, limit: number) {
  return { skip: (page - 1) * limit, take: limit };
}
