export interface IPagination<T> {
  rows: T[];
  page: number;
  total: number;
}
