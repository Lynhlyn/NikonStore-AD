export interface ColorImage {
  id: number;
  productId: number;
  colorId: number;
  imageUrl: string;
  altText?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddColorImageRequest {
  productId: number;
  colorId: number;
  imageUrl: string;
  altText?: string;
}

export interface UpdateColorImageRequest {
  id: number;
  productId: number;
  colorId: number;
  imageUrl: string;
  altText?: string;
}

export interface IColorImageListResponse {
  data: ColorImage[];
}

export interface IColorImageResponse {
  status: number;
  message: string;
  data: ColorImage;
}

