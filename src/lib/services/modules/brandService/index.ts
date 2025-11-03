import { apiSlice } from '@/lib/services/api';
import type { AddBrandRequest, Brand, IBrandListResponse, UpdateBrandRequest, IBrandResponse } from './type';
import { IListQuery } from '@/common/types/query';

const brand = '/brands';

export const brandApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    fetchBrands: build.query<IBrandListResponse, IListQuery>({
      query: (queryParams) => ({
        url: brand,
        method: 'GET',
        params: queryParams,
      }),
      keepUnusedDataFor: 0,
    }),
    fetchBrandById: build.query<Brand, number>({
      query: (id) => ({
        url: `${brand}/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: IBrandResponse) => response.data,
      keepUnusedDataFor: 0,
    }),
    addBrand: build.mutation<Brand, AddBrandRequest>({
      query: (newBrand) => ({
        url: brand,
        method: 'POST',
        body: newBrand,
      }),
      transformResponse: (response: IBrandResponse) => response.data,
    }),
    updateBrand: build.mutation<Brand, UpdateBrandRequest>({
      query: ({ id, ...updatedBrand }) => ({
        url: `${brand}/${id}`,
        method: 'PUT',
        body: updatedBrand,
      }),
      transformResponse: (response: IBrandResponse) => response.data,
    }),
    deleteBrand: build.mutation<void, number>({
      query: (id) => ({
        url: `${brand}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useFetchBrandsQuery,
  useFetchBrandByIdQuery,
  useAddBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApi;

