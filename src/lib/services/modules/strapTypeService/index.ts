import { apiSlice } from '@/lib/services/api';
import type { AddStrapTypeRequest, StrapType, IStrapTypeListResponse, UpdateStrapTypeRequest, IStrapTypeResponse } from './type';
import { IListQuery } from '@/common/types/query';

const strapType = '/strap-types';

export const strapTypeApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    fetchStrapTypes: build.query<IStrapTypeListResponse, IListQuery>({
      query: (queryParams) => ({
        url: strapType,
        method: 'GET',
        params: queryParams,
      }),
      keepUnusedDataFor: 0,
    }),
    fetchStrapTypeById: build.query<StrapType, number>({
      query: (id) => ({
        url: `${strapType}/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: IStrapTypeResponse) => response.data,
      keepUnusedDataFor: 0,
    }),
    addStrapType: build.mutation<StrapType, AddStrapTypeRequest>({
      query: (newStrapType) => ({
        url: strapType,
        method: 'POST',
        body: newStrapType,
      }),
      transformResponse: (response: IStrapTypeResponse) => response.data,
    }),
    updateStrapType: build.mutation<StrapType, UpdateStrapTypeRequest>({
      query: ({ id, ...updatedStrapType }) => ({
        url: `${strapType}/${id}`,
        method: 'PUT',
        body: updatedStrapType,
      }),
      transformResponse: (response: IStrapTypeResponse) => response.data,
    }),
    deleteStrapType: build.mutation<void, number>({
      query: (id) => ({
        url: `${strapType}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useFetchStrapTypesQuery,
  useFetchStrapTypeByIdQuery,
  useAddStrapTypeMutation,
  useUpdateStrapTypeMutation,
  useDeleteStrapTypeMutation,
} = strapTypeApi;

