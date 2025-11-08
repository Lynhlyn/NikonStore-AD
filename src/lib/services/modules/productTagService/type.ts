export interface ProductTag {
  productId: number;
  tagId: number;
  tagName: string;
  tagSlug: string;
  tagDescription?: string;
  tagStatus: number;
}

export interface AddProductTagRequest {
  productId: number;
  tagId: number;
}

export interface UpdateProductTagRequest {
  productId: number;
  tagIds: number[];
}

export interface IProductTagResponse {
  status: number;
  message: string;
  data: ProductTag[];
}

export interface IProductTagSingleResponse {
  status: number;
  message: string;
  data: ProductTag;
}

