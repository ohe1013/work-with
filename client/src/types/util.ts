export interface IPagination {
  firstPage: 1;
  lastPage: number;
  currentPage: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

export type pageClickType = "prev" | "next" | "current";
