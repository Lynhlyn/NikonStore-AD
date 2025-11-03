import { apiSlice } from '@/lib/services/api';
import type { AddCapacityRequest, Capacity, ICapacityListResponse, UpdateCapacityRequest, ICapacityResponse } from './type';
import { IListQuery } from '@/common/types/query';

const capacity = '/capacities';

export const capacityApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    fetchCapacities: build.query<ICapacityListResponse, IListQuery>({
      query: (queryParams) => ({
        url: capacity,
        method: 'GET',
        params: queryParams,
      }),
      keepUnusedDataFor: 0,
    }),
    fetchCapacityById: build.query<Capacity, number>({
      query: (id) => ({
        url: `${capacity}/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: ICapacityResponse) => response.data,
      keepUnusedDataFor: 0,
    }),
    addCapacity: build.mutation<Capacity, AddCapacityRequest>({
      query: (newCapacity) => ({
        url: capacity,
        method: 'POST',
        body: newCapacity,
      }),
      transformResponse: (response: ICapacityResponse) => response.data,
    }),
    updateCapacity: build.mutation<Capacity, UpdateCapacityRequest>({
      query: ({ id, ...updatedCapacity }) => ({
        url: `${capacity}/${id}`,
        method: 'PUT',
        body: updatedCapacity,
      }),
      transformResponse: (response: ICapacityResponse) => response.data,
    }),
    deleteCapacity: build.mutation<void, number>({
      query: (id) => ({
        url: `${capacity}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useFetchCapacitiesQuery,
  useFetchCapacityByIdQuery,
  useAddCapacityMutation,
  useUpdateCapacityMutation,
  useDeleteCapacityMutation,
} = capacityApi;

