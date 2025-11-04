import { apiSlice } from '@/lib/services/api';
import type { AddColorRequest, Color, IColorListResponse, UpdateColorRequest, IColorResponse } from './type';
import { IListQuery } from '@/common/types/query';

const color = '/colors';

export const colorApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    fetchColors: build.query<IColorListResponse, IListQuery>({
      query: (queryParams) => ({
        url: color,
        method: 'GET',
        params: queryParams,
      }),
      keepUnusedDataFor: 0,
    }),
    fetchColorById: build.query<Color, number>({
      query: (id) => ({
        url: `${color}/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: IColorResponse) => response.data,
      keepUnusedDataFor: 0,
    }),
    addColor: build.mutation<Color, AddColorRequest>({
      query: (newColor) => ({
        url: color,
        method: 'POST',
        body: newColor,
      }),
      transformResponse: (response: IColorResponse) => response.data,
    }),
    updateColor: build.mutation<Color, UpdateColorRequest>({
      query: ({ id, ...updatedColor }) => ({
        url: `${color}/${id}`,
        method: 'PUT',
        body: updatedColor,
      }),
      transformResponse: (response: IColorResponse) => response.data,
    }),
    deleteColor: build.mutation<void, number>({
      query: (id) => ({
        url: `${color}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useFetchColorsQuery,
  useFetchColorByIdQuery,
  useAddColorMutation,
  useUpdateColorMutation,
  useDeleteColorMutation,
} = colorApi;

