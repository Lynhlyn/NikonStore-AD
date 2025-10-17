export interface IPaginationPayload {
  page: number;
  limit?: number;
}

export interface IPagination {
  total: number;
  page: number;
  totalPage: number;
}
