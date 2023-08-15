export type Pagination = {
  page: number;
  first: number;
  last: number;
  next?: number;
  prev?: number;
  total: number;
};

export type PaginatedData<T> = {
  data: T[];
  pagination: Pagination;
};
