import { IListQuery } from '@/common/types/query';
import { EContentType } from '../contentTagService/type';

export interface ContentCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  type: EContentType;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddContentCategoryRequest {
  name: string;
  slug: string;
  description?: string;
  type: EContentType;
}

export interface UpdateContentCategoryRequest {
  id: number;
  name: string;
  slug: string;
  description?: string;
  type: EContentType;
}

export interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface IContentCategoryListResponse {
  data: ContentCategory[];
  pagination: Pagination;
}

export interface IContentCategoryResponse {
  status: number;
  message: string;
  data: ContentCategory;
}

export interface IContentCategoryListQuery extends IListQuery {
  name?: string;
  slug?: string;
  type?: EContentType;
}

