import { Pagination } from '@/lib/services/modules/brandService/type';

export interface Feature {
  id: number;
  name: string;
  description?: string;
  featureGroup?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddFeatureRequest {
  name: string;
  description?: string;
  featureGroup?: string;
}

export interface UpdateFeatureRequest {
  id: number;
  name: string;
  description?: string;
  featureGroup?: string;
}

export interface IFeatureResponse {
  status: number;
  message: string;
  data: Feature;
}

export interface IFeatureListResponse {
  pagination: Pagination;
  data: Feature[];
}

