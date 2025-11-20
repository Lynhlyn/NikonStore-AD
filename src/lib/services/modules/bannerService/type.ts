import { EStatusEnumString } from '@/common/enums/status';

export interface Banner {
  id: number;
  name: string;
  description?: string;
  url: string;
  status: EStatusEnumString;
  imageUrl: string;
  position: number;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddBannerRequest {
  name: string;
  description?: string;
  url: string;
  status: EStatusEnumString;
  imageUrl: string;
  position: number;
  displayOrder?: number;
}

export interface UpdateBannerRequest {
  id: number;
  name: string;
  description?: string;
  url: string;
  status: EStatusEnumString;
  imageUrl: string;
  position: number;
  displayOrder?: number;
}

export interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface IBannerListResponse {
  data: Banner[];
  pagination: Pagination;
}

export interface IBannerResponse {
  status: number;
  message: string;
  data: Banner;
}

