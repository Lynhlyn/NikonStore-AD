import { EStatusEnumString } from '@/common/enums/status';

export interface Category {
  id: number;
  name: string;
  parentId?: number;
  parentName?: string;
  description?: string;
  status: EStatusEnumString;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddCategoryRequest {
  name: string;
  parentId?: number;
  description?: string;
  status: EStatusEnumString;
}

export interface UpdateCategoryRequest {
  id: number;
  name: string;
  parentId?: number;
  description?: string;
  status: EStatusEnumString;
}

export interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ICategoryListResponse {
  data: Category[];
  pagination: Pagination;
}

export interface ICategoryResponse {
  status: number;
  message: string;
  data: Category;
}

