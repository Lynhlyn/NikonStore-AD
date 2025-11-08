export interface ProductFeature {
  productId: number;
  featureId: number;
  featureName: string;
  featureDescription?: string;
  featureGroup?: string;
}

export interface AddProductFeatureRequest {
  featureId: number;
}

export interface UpdateProductFeatureRequest {
  featureIds: number[];
}

export interface IProductFeatureResponse {
  status: number;
  message: string;
  data: ProductFeature[];
}

export interface ISingleProductFeatureResponse {
  status: number;
  message: string;
  data: ProductFeature;
}

