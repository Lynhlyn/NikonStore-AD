export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
  altText?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddProductImageRequest {
  productId: number;
  imageUrl: string;
  isPrimary?: boolean;
  sortOrder?: number;
  altText?: string;
}

export interface UpdateProductImageRequest {
  id: number;
  imageUrl?: string;
  isPrimary?: boolean;
  sortOrder?: number;
  altText?: string;
}

export interface IProductImageListResponse {
  data: ProductImage[];
}

export interface IProductImageResponse {
  status: number;
  message: string;
  data: ProductImage;
}

