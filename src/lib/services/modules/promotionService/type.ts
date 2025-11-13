import { EStatusEnumString } from '@/common/enums/status';

export interface Promotion {
  id: number;
  name: string;
  title: string;
  code?: string;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  appliesTo?: string;
  appliedProduct?: string;
  startDate: string;
  endDate: string;
  description?: string;
  status: EStatusEnumString;
  createdAt: string;
  updatedAt: string;
  products?: Array<{
    id: number;
    name: string;
    sku?: string;
  }>;
  productDetails?: Array<{
    id: number;
    sku: string;
    price: number;
  }>;
}

export interface AddPromotionRequest {
  name: string;
  title: string;
  code?: string;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  startDate: string;
  endDate: string;
  description?: string;
  productDetailIds?: number[];
}

export interface UpdatePromotionRequest extends Partial<AddPromotionRequest> {
  id: number;
  status?: EStatusEnumString;
  productDetailIds?: number[];
}

export interface IPromotionListResponse {
  content: Promotion[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface IPromotionResponse {
  status: number;
  message: string;
  data: Promotion;
}

