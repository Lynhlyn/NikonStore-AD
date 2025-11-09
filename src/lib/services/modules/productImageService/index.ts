import { apiSlice } from '@/lib/services/api';
import type {
  ProductImage,
  AddProductImageRequest,
  UpdateProductImageRequest,
  IProductImageListResponse,
  IProductImageResponse,
} from './type';

const productImage = '/product-images';

export const productImageApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    fetchProductImagesByProductId: build.query<IProductImageListResponse, number>({
      query: (productId) => ({
        url: `${productImage}/product/${productId}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 0,
    }),
    fetchProductImageById: build.query<ProductImage, number>({
      query: (id) => ({
        url: `${productImage}/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: IProductImageResponse) => response.data,
      keepUnusedDataFor: 0,
    }),
    addProductImage: build.mutation<ProductImage, AddProductImageRequest>({
      query: (newImage) => ({
        url: productImage,
        method: 'POST',
        body: newImage,
      }),
      transformResponse: (response: IProductImageResponse) => response.data,
    }),
    updateProductImage: build.mutation<ProductImage, UpdateProductImageRequest>({
      query: ({ id, ...updatedImage }) => ({
        url: `${productImage}/${id}`,
        method: 'PUT',
        body: updatedImage,
      }),
      transformResponse: (response: IProductImageResponse) => response.data,
    }),
    deleteProductImage: build.mutation<void, number>({
      query: (id) => ({
        url: `${productImage}/${id}`,
        method: 'DELETE',
      }),
    }),
    deleteProductImagesByProductId: build.mutation<void, number>({
      query: (productId) => ({
        url: `${productImage}/product/${productId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useFetchProductImagesByProductIdQuery,
  useFetchProductImageByIdQuery,
  useAddProductImageMutation,
  useUpdateProductImageMutation,
  useDeleteProductImageMutation,
  useDeleteProductImagesByProductIdMutation,
} = productImageApi;

