import { EStatusEnumString } from '@/common/enums/status';

export interface Color {
  id: number;
  name: string;
  hexCode: string;
  status: EStatusEnumString;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddColorRequest {
  name: string;
  hexCode: string;
  status: EStatusEnumString;
}

export interface UpdateColorRequest {
  id: number;
  name: string;
  hexCode: string;
  status: EStatusEnumString;
}

export interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface IColorListResponse {
  data: Color[];
  pagination: Pagination;
}

export interface IColorResponse {
  status: number;
  message: string;
  data: Color;
}

