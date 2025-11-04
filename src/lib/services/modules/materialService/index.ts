import { apiSlice } from '@/lib/services/api';
import type { AddMaterialRequest, Material, IMaterialListResponse, UpdateMaterialRequest, IMaterialResponse } from './type';
import { IListQuery } from '@/common/types/query';

const material = '/materials';

export const materialApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    fetchMaterials: build.query<IMaterialListResponse, IListQuery>({
      query: (queryParams) => ({
        url: material,
        method: 'GET',
        params: queryParams,
      }),
      keepUnusedDataFor: 0,
    }),
    fetchMaterialById: build.query<Material, number>({
      query: (id) => ({
        url: `${material}/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: IMaterialResponse) => response.data,
      keepUnusedDataFor: 0,
    }),
    addMaterial: build.mutation<Material, AddMaterialRequest>({
      query: (newMaterial) => ({
        url: material,
        method: 'POST',
        body: newMaterial,
      }),
      transformResponse: (response: IMaterialResponse) => response.data,
    }),
    updateMaterial: build.mutation<Material, UpdateMaterialRequest>({
      query: ({ id, ...updatedMaterial }) => ({
        url: `${material}/${id}`,
        method: 'PUT',
        body: updatedMaterial,
      }),
      transformResponse: (response: IMaterialResponse) => response.data,
    }),
    deleteMaterial: build.mutation<void, number>({
      query: (id) => ({
        url: `${material}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useFetchMaterialsQuery,
  useFetchMaterialByIdQuery,
  useAddMaterialMutation,
  useUpdateMaterialMutation,
  useDeleteMaterialMutation,
} = materialApi;

