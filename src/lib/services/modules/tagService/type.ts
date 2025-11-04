import { EStatusEnumString } from '@/common/enums/status';

export interface Tag {
  id: number;
  name: string;
  slug: string;
  description?: string;
  status: EStatusEnumString;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddTagRequest {
  name: string;
  slug: string;
  description?: string;
  status: EStatusEnumString;
}

export interface UpdateTagRequest {
  id: number;
  name: string;
  slug: string;
  description?: string;
  status: EStatusEnumString;
}

export interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ITagListResponse {
  data: Tag[];
  pagination: Pagination;
}

export interface ITagResponse {
  status: number;
  message: string;
  data: Tag;
}

