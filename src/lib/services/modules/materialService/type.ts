import { EStatusEnumString } from '@/common/enums/status';

export interface Material {
  id: number;
  name: string;
  description?: string;
  status: EStatusEnumString;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddMaterialRequest {
  name: string;
  description?: string;
  status: EStatusEnumString;
}

export interface UpdateMaterialRequest {
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

export interface IMaterialListResponse {
  data: Material[];
  pagination: Pagination;
}

export interface IMaterialResponse {
  status: number;
  message: string;
  data: Material;
}

