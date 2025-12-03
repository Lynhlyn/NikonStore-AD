import { IListQuery } from '@/common/types/query';

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category?: {
    id: number;
    name: string;
    slug: string;
    description?: string;
    type: string;
  };
  tag?: {
    id: number;
    name: string;
    slug: string;
    type: string;
  };
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddFAQRequest {
  question: string;
  answer: string;
  categoryId?: number;
  tagId?: number;
  status?: boolean;
}

export interface UpdateFAQRequest {
  question?: string;
  answer?: string;
  categoryId?: number;
  tagId?: number;
  status?: boolean;
}

export interface IFAQListResponse {
  data: FAQ[];
  pagination?: Pagination;
}

export interface IFAQResponse {
  status: number;
  message: string;
  data: FAQ;
}

export interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface IFAQListQuery extends IListQuery {
  categoryId?: number;
  tagId?: number;
  status?: boolean;
}

