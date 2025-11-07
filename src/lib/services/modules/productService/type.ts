import { EStatusEnumString } from '@/common/enums/status';
import { IListQuery } from '@/common/types/query';
import type { ProductImage } from '../productImageService/type';

export interface Brand {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Material {
  id: number;
  name: string;
}

export interface StrapType {
  id: number;
  name: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Feature {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  compartment?: string;
  strapType?: StrapType;
  brand?: Brand;
  category?: Category;
  material?: Material;
  description?: string;
  dimensions?: string;
  weight?: number;
  waterproofRating?: string;
  status: EStatusEnumString;
  tags?: Tag[];
  features?: Feature[];
  images?: ProductImage[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AddProductRequest {
  name: string;
  compartment?: string;
  strapTypeId?: number;
  brandId?: number;
  categoryId?: number;
  materialId?: number;
  description?: string;
  dimensions?: string;
  weight?: number;
  waterproofRating?: string;
  status: EStatusEnumString;
  tagIds?: number[];
  featureIds?: number[];
}

export interface UpdateProductRequest extends AddProductRequest {
  id: number;
}

export interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface IProductListResponse {
  data: Product[];
  pagination: Pagination;
}

export interface IProductResponse {
  status: number;
  message: string;
  data: Product;
}

export interface IProductListQuery extends IListQuery {
  categoryId?: number;
  brandId?: number;
  materialId?: number;
  strapTypeId?: number;
  compartment?: string;
}

