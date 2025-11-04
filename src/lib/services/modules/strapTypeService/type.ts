import { EStatusEnumString } from '@/common/enums/status';

export interface StrapType {
  id: number;
  name: string;
  description?: string;
  status: EStatusEnumString;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddStrapTypeRequest {
  name: string;
  description?: string;
  status: EStatusEnumString;
}

export interface UpdateStrapTypeRequest {
  id: number;
  name: string;
  description?: string;
  status: EStatusEnumString;
}

export interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface IStrapTypeListResponse {
  data: StrapType[];
  pagination: Pagination;
}

export interface IStrapTypeResponse {
  status: number;
  message: string;
  data: StrapType;
}

