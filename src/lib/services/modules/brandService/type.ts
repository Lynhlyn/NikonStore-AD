import { EStatusEnumString } from '@/common/enums/status';
import { IListQuery } from '@/common/types/query';

export interface Brand {
  id: number;
  name: string;
  status: EStatusEnumString;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddBrandRequest {
  name: string;
  status: EStatusEnumString;
}

export interface UpdateBrandRequest {
  id: number;
  name: string;
  status: EStatusEnumString;
}

export interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface IBrandListResponse {
  data: Brand[];
  pagination: Pagination;
}

export interface IBrandResponse {
  status: number;
  message: string;
  data: Brand;
}

