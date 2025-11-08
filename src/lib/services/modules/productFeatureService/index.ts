import { apiSlice } from '@/lib/services/api';
import type { AddProductFeatureRequest, UpdateProductFeatureRequest, ProductFeature, IProductFeatureResponse, ISingleProductFeatureResponse } from './type';

const productsApi = '/products';

export const productFeatureApi = apiSlice.injectEndpoints({
  endpoints: (build) => {
    return {
      fetchProductFeaturesByProductId: build.query<ProductFeature[], number>({
        query: (productId) => ({
          url: `${productsApi}/${productId}/features`,
          method: 'GET',
        }),
        transformResponse: (response: IProductFeatureResponse) => response.data,
        keepUnusedDataFor: 0,
      }),

      addProductFeature: build.mutation<ProductFeature, { productId: number } & AddProductFeatureRequest>({
        query: ({ productId, featureId }) => ({
          url: `${productsApi}/${productId}/features`,
          method: 'POST',
          body: { featureId },
        }),
        transformResponse: (response: ISingleProductFeatureResponse) => response.data,
      }),

      updateProductFeatures: build.mutation<ProductFeature[], { productId: number } & UpdateProductFeatureRequest>({
        query: ({ productId, featureIds }) => ({
          url: `${productsApi}/${productId}/features`,
          method: 'PUT',
          body: { featureIds },
        }),
        transformResponse: (response: IProductFeatureResponse) => response.data,
      }),

      deleteProductFeature: build.mutation<void, { productId: number; featureId: number }>({
        query: ({ productId, featureId }) => ({
          url: `${productsApi}/${productId}/features/${featureId}`,
          method: 'DELETE',
        }),
      }),

      deleteAllProductFeatures: build.mutation<void, number>({
        query: (productId) => ({
          url: `${productsApi}/${productId}/features`,
          method: 'DELETE',
        }),
      }),
    };
  },
});

export const {
  useFetchProductFeaturesByProductIdQuery,
  useAddProductFeatureMutation,
  useUpdateProductFeaturesMutation,
  useDeleteProductFeatureMutation,
  useDeleteAllProductFeaturesMutation,
} = productFeatureApi;

