import { EStatusEnumString } from '@/common/enums/status';
import { IListQuery } from '@/common/types/query';

export interface Color {
  id: number;
  name: string;
  hexCode?: string;
}

export interface Capacity {
  id: number;
  name: string;
}

export interface Promotion {
  id: number;
  name: string;
  isActive?: boolean;
  discountType?: 'percentage' | 'fixed_amount';
  discountValue?: number;
}

export interface ProductDetail {
  id: number;
  sku: string;
  stock: number;
  reservedStock?: number;
  productName: string;
  productId: number;
  color?: Color;
  capacity?: Capacity;
  price: number;
  status: EStatusEnumString;
  promotionId?: number;
  promotion?: Promotion;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddProductDetailRequest {
  sku: string;
  stock: number;
  productId: number;
  colorId?: number;
  capacityId?: number;
  price: number;
  status: EStatusEnumString;
}

export interface UpdateProductDetailRequest extends AddProductDetailRequest {
  id: number;
}

export interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface IProductDetailListResponse {
  data: ProductDetail[];
  pagination: Pagination;
}

export interface IProductDetailResponse {
  status: number;
  message: string;
  data: ProductDetail;
}

export interface IProductDetailListQuery extends IListQuery {
  productId?: number;
  sku?: string;
  colorId?: number;
  capacityId?: number;
  status?: EStatusEnumString;
  minPrice?: number;
  maxPrice?: number;
  promotionId?: number;
  productIds?: number[];
}

