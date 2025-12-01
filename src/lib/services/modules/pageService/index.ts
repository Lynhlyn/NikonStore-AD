import { apiSlice } from '@/lib/services/api';
import type {
  PageCreateRequest,
  PageResponse,
  PageUpdateRequest,
  IPageResponse,
} from './type';

const page = '/page';

export const pageApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getPageByKey: build.query<PageResponse, string>({
      query: (pageKey) => ({
        url: `${page}/${pageKey}`,
        method: 'GET',
      }),
      transformResponse: (response: IPageResponse) => response.data,
      keepUnusedDataFor: 0,
    }),
    createPage: build.mutation<PageResponse, PageCreateRequest>({
      query: (newPage) => ({
        url: page,
        method: 'POST',
        body: newPage,
      }),
      transformResponse: (response: IPageResponse) => response.data,
    }),
    updatePage: build.mutation<PageResponse, PageUpdateRequest>({
      query: ({ id, ...updatedPage }) => ({
        url: `${page}/${id}`,
        method: 'PUT',
        body: updatedPage,
      }),
      transformResponse: (response: IPageResponse) => response.data,
    }),
  }),
});

export const {
  useGetPageByKeyQuery,
  useCreatePageMutation,
  useUpdatePageMutation,
} = pageApi;
