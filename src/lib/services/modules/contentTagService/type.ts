import { IListQuery } from '@/common/types/query';

export enum EContentType {
  BLOG = 'BLOG',
  FAQ = 'FAQ',
  NEWS = 'NEWS',
}

export interface ContentTag {
  id: number;
  name: string;
  slug: string;
  type: EContentType;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddContentTagRequest {
  name: string;
  slug: string;
  type: EContentType;
}

export interface UpdateContentTagRequest {
  id: number;
  name: string;
  slug: string;
  type: EContentType;
}

export interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface IContentTagListResponse {
  data: ContentTag[];
  pagination: Pagination;
}

export interface IContentTagResponse {
  status: number;
  message: string;
  data: ContentTag;
}

export interface IContentTagListQuery extends IListQuery {
  name?: string;
  slug?: string;
  type?: EContentType;
}

