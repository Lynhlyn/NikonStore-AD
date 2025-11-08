import { apiSlice } from '@/lib/services/api';
import type { AddProductTagRequest, UpdateProductTagRequest, ProductTag, IProductTagResponse } from './type';

const productsApi = '/products';

export const productTagApi = apiSlice.injectEndpoints({
  endpoints: (build) => {
    return {
      fetchProductTagsByProductId: build.query<ProductTag[], number>({
        query: (productId) => ({
          url: `${productsApi}/${productId}/tags`,
          method: 'GET',
        }),
        transformResponse: (response: IProductTagResponse) => response.data,
        keepUnusedDataFor: 0,
      }),

      addProductTag: build.mutation<ProductTag, AddProductTagRequest>({
        query: ({ productId, tagId }) => ({
          url: `${productsApi}/${productId}/tags`,
          method: 'POST',
          body: { tagId },
        }),
        transformResponse: (response: IProductTagSingleResponse) => response.data,
      }),

      updateProductTags: build.mutation<ProductTag[], UpdateProductTagRequest>({
        query: ({ productId, tagIds }) => ({
          url: `${productsApi}/${productId}/tags`,
          method: 'PUT',
          body: { tagIds },
        }),
        transformResponse: (response: IProductTagResponse) => response.data,
      }),

      deleteProductTag: build.mutation<void, { productId: number; tagId: number }>({
        query: ({ productId, tagId }) => ({
          url: `${productsApi}/${productId}/tags/${tagId}`,
          method: 'DELETE',
        }),
      }),

      deleteAllProductTags: build.mutation<void, number>({
        query: (productId) => ({
          url: `${productsApi}/${productId}/tags`,
          method: 'DELETE',
        }),
      }),
    };
  },
});

export const {
  useFetchProductTagsByProductIdQuery,
  useAddProductTagMutation,
  useUpdateProductTagsMutation,
  useDeleteProductTagMutation,
  useDeleteAllProductTagsMutation,
} = productTagApi;

