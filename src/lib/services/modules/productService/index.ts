import { apiSlice } from '@/lib/services/api';
import type {
  AddProductRequest,
  UpdateProductRequest,
  Product,
  IProductListResponse,
  IProductResponse,
  IProductListQuery,
} from './type';

const product = '/products';

export const productApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    fetchProducts: build.query<IProductListResponse, IProductListQuery>({
      query: (queryParams) => ({
        url: product,
        method: 'GET',
        params: queryParams,
      }),
      keepUnusedDataFor: 0,
    }),
    fetchProductById: build.query<Product, number>({
      query: (id) => ({
        url: `${product}/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: IProductResponse) => response.data,
      keepUnusedDataFor: 0,
    }),
    addProduct: build.mutation<Product, AddProductRequest>({
      query: (newProduct) => ({
        url: product,
        method: 'POST',
        body: newProduct,
      }),
      transformResponse: (response: IProductResponse) => response.data,
    }),
    updateProduct: build.mutation<Product, UpdateProductRequest>({
      query: ({ id, ...updatedProduct }) => ({
        url: `${product}/${id}`,
        method: 'PUT',
        body: updatedProduct,
      }),
      transformResponse: (response: IProductResponse) => response.data,
    }),
    deleteProduct: build.mutation<void, number>({
      query: (id) => ({
        url: `${product}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useFetchProductsQuery,
  useFetchProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;

