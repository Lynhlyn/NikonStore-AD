import { apiSlice } from '@/lib/services/api';
import type {
  AddContentTagRequest,
  ContentTag,
  IContentTagListResponse,
  UpdateContentTagRequest,
  IContentTagResponse,
  IContentTagListQuery,
} from './type';

const contentTag = '/content-tags';

export const contentTagApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    fetchContentTags: build.query<IContentTagListResponse, IContentTagListQuery>({
      query: (queryParams) => ({
        url: contentTag,
        method: 'GET',
        params: queryParams,
      }),
      keepUnusedDataFor: 0,
    }),
    fetchContentTagById: build.query<ContentTag, number>({
      query: (id) => ({
        url: `${contentTag}/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: IContentTagResponse) => response.data,
      keepUnusedDataFor: 0,
    }),
    addContentTag: build.mutation<ContentTag, AddContentTagRequest>({
      query: (newContentTag) => ({
        url: contentTag,
        method: 'POST',
        body: newContentTag,
      }),
      transformResponse: (response: IContentTagResponse) => response.data,
    }),
    updateContentTag: build.mutation<ContentTag, UpdateContentTagRequest>({
      query: ({ id, ...updatedContentTag }) => ({
        url: `${contentTag}/${id}`,
        method: 'PUT',
        body: updatedContentTag,
      }),
      transformResponse: (response: IContentTagResponse) => response.data,
    }),
    deleteContentTag: build.mutation<void, number>({
      query: (id) => ({
        url: `${contentTag}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useFetchContentTagsQuery,
  useFetchContentTagByIdQuery,
  useAddContentTagMutation,
  useUpdateContentTagMutation,
  useDeleteContentTagMutation,
} = contentTagApi;

