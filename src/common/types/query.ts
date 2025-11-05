export interface IListQuery {
  page?: number | null;
  keyword?: string;
  name?: string;
  slug?: string;
  code?: string;
  state?: string | null;
  status?: string | number;
  customerId?: number | null;
  limit?: number;
  getAll?: boolean;
  groupByCategory?: boolean;
  isAll?: boolean;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
  featureGroup?: string | null;
  sortBy?: string | null;
  sortDir?: string | null;
}

