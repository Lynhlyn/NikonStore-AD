import { IListQuery } from '@/common/types/query';

export type EmailAction =
  | 'REGISTER_SUCCESS'
  | 'FORGOT_PASSWORD'
  | 'RESET_PASSWORD'
  | 'PASSWORD_RESET'
  | 'PASSWORD_CHANGED'
  | 'VERIFY_EMAIL'
  | 'WELCOME'
  | 'ORDER_PENDING_CONFIRMATION'
  | 'ORDER_CONFIRMATION'
  | 'ORDER_CONFIRM'
  | 'CONFIRMATION'
  | 'ORDER_CONFIRMED'
  | 'ORDER_PREPARING'
  | 'ORDER_SHIPPING'
  | 'ORDER_COMPLETED'
  | 'ORDER_CANCELLED'
  | 'ORDER_PENDING_PAYMENT'
  | 'ORDER_FAILED_DELIVERY'
  | 'ACCOUNT_LOCKED'
  | 'ACCOUNT_UNLOCKED'
  | 'ACCOUNT_DISABLED'
  | 'PROMOTION'
  | 'NEWSLETTER'
  | 'BRANDSNEW'
  | 'AUTHENTICATION_CODE'
  | 'VOUCHER_ASSIGNED';

export interface TemplateEmail {
  id: number;
  action: EmailAction;
  subject: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddTemplateEmailRequest {
  action: EmailAction;
  subject: string;
  content: string;
}

export interface UpdateTemplateEmailRequest {
  id: number;
  action: EmailAction;
  subject: string;
  content: string;
}

export interface ITemplateEmailListResponse {
  data: TemplateEmail[];
  pagination?: Pagination;
}

export interface ITemplateEmailResponse {
  status: number;
  message: string;
  data: TemplateEmail;
}

export interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ITemplateEmailListQuery extends IListQuery {
  isAll?: boolean;
  action?: string;
  keyword?: string;
}

