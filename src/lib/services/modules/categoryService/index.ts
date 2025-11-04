import { apiSlice } from '@/lib/services/api';
import type { AddCategoryRequest, Category, ICategoryListResponse, UpdateCategoryRequest, ICategoryResponse } from './type';
import { IListQuery } from '@/common/types/query';

const category = '/categories';

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    fetchCategories: build.query<ICategoryListResponse, IListQuery>({
      query: (queryParams) => ({
        url: category,
        method: 'GET',
        params: queryParams,
      }),
      keepUnusedDataFor: 0,
    }),
    fetchCategoryById: build.query<Category, number>({
      query: (id) => ({
        url: `${category}/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: ICategoryResponse) => response.data,
      keepUnusedDataFor: 0,
    }),
    addCategory: build.mutation<Category, AddCategoryRequest>({
      query: (newCategory) => ({
        url: category,
        method: 'POST',
        body: newCategory,
      }),
      transformResponse: (response: ICategoryResponse) => response.data,
    }),
    updateCategory: build.mutation<Category, UpdateCategoryRequest>({
      query: ({ id, ...updatedCategory }) => ({
        url: `${category}/${id}`,
        method: 'PUT',
        body: updatedCategory,
      }),
      transformResponse: (response: ICategoryResponse) => response.data,
    }),
    deleteCategory: build.mutation<void, number>({
      query: (id) => ({
        url: `${category}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useFetchCategoriesQuery,
  useFetchCategoryByIdQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;

