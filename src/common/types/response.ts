export interface ApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPage: number;
}
