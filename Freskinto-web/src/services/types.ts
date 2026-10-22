/** Har list response ki shape: `data` + `meta` (backend `IPaginated<T>`, FLOW-MD 05 §4) */
export interface IPaginationMeta {
  total: number;
  currentPage: number;
  limit: number;
  pages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface IPaginatedResponse<T> {
  data: T[];
  meta: IPaginationMeta;
}

export interface IPaginationPayload {
  page?: number;
  limit?: number;
}

/** Mutation hooks: caller khud toast kare to `silent: true` (FLOW-MD 07 §7) */
export interface IMutationOptions {
  silent?: boolean;
}
