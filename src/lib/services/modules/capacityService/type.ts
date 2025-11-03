import { EStatusEnumString } from '@/common/enums/status';

export interface Capacity {
  id: number;
  name: string;
  status: EStatusEnumString;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddCapacityRequest {
  name: string;
  status: EStatusEnumString;
}

export interface UpdateCapacityRequest {
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

export interface ICapacityListResponse {
  data: Capacity[];
  pagination: Pagination;
}

export interface ICapacityResponse {
  status: number;
  message: string;
  data: Capacity;
}

