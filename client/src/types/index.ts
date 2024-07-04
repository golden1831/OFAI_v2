export interface IPagination<T> {
  rows: T[];
  page: number;
  total: number;
}

export interface IPaginationRequest {
  page: number; // first page is 0
  limit: number; // max limit will be 100
}
