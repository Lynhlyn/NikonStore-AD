import { apiSlice } from '@/lib/services/api';
import type {
  AddProductDetailRequest,
  IProductDetailListQuery,
  IProductDetailListResponse,
  IProductDetailResponse,
  ProductDetail,
  UpdateProductDetailRequest,
} from './type';

const productDetail = '/product-details';

export const productDetailApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    fetchProductDetails: build.query<IProductDetailListResponse, IProductDetailListQuery>({
      query: (queryParams) => ({
        url: productDetail,
        method: 'GET',
        params: queryParams,
      }),
      keepUnusedDataFor: 0,
    }),
    fetchProductDetailById: build.query<ProductDetail, number>({
      query: (id) => ({
        url: `${productDetail}/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: IProductDetailResponse) => response.data,
      keepUnusedDataFor: 0,
    }),
    addProductDetail: build.mutation<ProductDetail, AddProductDetailRequest>({
      query: (newProductDetail) => ({
        url: productDetail,
        method: 'POST',
        body: newProductDetail,
      }),
      transformResponse: (response: IProductDetailResponse) => response.data,
    }),
    updateProductDetail: build.mutation<ProductDetail, UpdateProductDetailRequest>({
      query: ({ id, ...updatedProductDetail }) => ({
        url: `${productDetail}/${id}`,
        method: 'PUT',
        body: updatedProductDetail,
      }),
      transformResponse: (response: IProductDetailResponse) => response.data,
    }),
    deleteProductDetail: build.mutation<void, number>({
      query: (id) => ({
        url: `${productDetail}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useFetchProductDetailsQuery,
  useFetchProductDetailByIdQuery,
  useAddProductDetailMutation,
  useUpdateProductDetailMutation,
  useDeleteProductDetailMutation,
} = productDetailApi;

