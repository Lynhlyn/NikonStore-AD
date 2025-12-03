import { IListQuery } from '@/common/types/query';

export interface Comment {
  id: number;
  blogId: number;
  customer?: {
    id: number;
    username: string;
    fullName: string;
    email: string;
  };
  userComment?: string;
  content: string;
  parentId?: number;
  replies?: Comment[];
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddCommentRequest {
  blogId: number;
  customerId?: number;
  userComment?: string;
  content: string;
}

export interface ReplyCommentRequest {
  blogId: number;
  parentId: number;
  customerId?: number;
  userComment?: string;
  content: string;
}

export interface ICommentListResponse {
  data: Comment[];
  pagination?: Pagination;
}

export interface ICommentResponse {
  status: number;
  message: string;
  data: Comment;
}

export interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ICommentListQuery extends IListQuery {
  blogId?: number;
  status?: boolean;
}

