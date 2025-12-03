import { apiSlice } from '@/lib/services/api';
import type {
  AddContentCategoryRequest,
  ContentCategory,
  IContentCategoryListResponse,
  UpdateContentCategoryRequest,
  IContentCategoryResponse,
  IContentCategoryListQuery,
} from './type';

const contentCategory = '/content-categories';

export const contentCategoryApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    fetchContentCategories: build.query<IContentCategoryListResponse, IContentCategoryListQuery>({
      query: (queryParams) => ({
        url: contentCategory,
        method: 'GET',
        params: queryParams,
      }),
      keepUnusedDataFor: 0,
    }),
    fetchContentCategoryById: build.query<ContentCategory, number>({
      query: (id) => ({
        url: `${contentCategory}/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: IContentCategoryResponse) => response.data,
      keepUnusedDataFor: 0,
    }),
    addContentCategory: build.mutation<ContentCategory, AddContentCategoryRequest>({
      query: (newContentCategory) => ({
        url: contentCategory,
        method: 'POST',
        body: newContentCategory,
      }),
      transformResponse: (response: IContentCategoryResponse) => response.data,
    }),
    updateContentCategory: build.mutation<ContentCategory, UpdateContentCategoryRequest>({
      query: ({ id, ...updatedContentCategory }) => ({
        url: `${contentCategory}/${id}`,
        method: 'PUT',
        body: updatedContentCategory,
      }),
      transformResponse: (response: IContentCategoryResponse) => response.data,
    }),
    deleteContentCategory: build.mutation<void, number>({
      query: (id) => ({
        url: `${contentCategory}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useFetchContentCategoriesQuery,
  useFetchContentCategoryByIdQuery,
  useAddContentCategoryMutation,
  useUpdateContentCategoryMutation,
  useDeleteContentCategoryMutation,
} = contentCategoryApi;

