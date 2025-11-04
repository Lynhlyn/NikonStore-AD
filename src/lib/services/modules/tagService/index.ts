import { apiSlice } from '@/lib/services/api';
import type { IListQuery } from '@/common/types/query';
import type { Tag, AddTagRequest, UpdateTagRequest, ITagListResponse, ITagResponse } from './type';

const tag = '/tags';

export const tagApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    fetchTags: build.query<ITagListResponse, IListQuery>({
      query: (queryParams) => ({
        url: tag,
        method: 'GET',
        params: queryParams,
      }),
      keepUnusedDataFor: 0,
    }),
    fetchTagById: build.query<Tag, number>({
      query: (id) => ({
        url: `${tag}/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: ITagResponse) => response.data,
      keepUnusedDataFor: 0,
    }),
    addTag: build.mutation<Tag, AddTagRequest>({
      query: (newTag) => ({
        url: tag,
        method: 'POST',
        body: newTag,
      }),
      transformResponse: (response: ITagResponse) => response.data,
    }),
    updateTag: build.mutation<Tag, UpdateTagRequest>({
      query: ({ id, ...updatedTag }) => ({
        url: `${tag}/${id}`,
        method: 'PUT',
        body: updatedTag,
      }),
      transformResponse: (response: ITagResponse) => response.data,
    }),
    deleteTag: build.mutation<void, number>({
      query: (id) => ({
        url: `${tag}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useFetchTagsQuery,
  useFetchTagByIdQuery,
  useAddTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
} = tagApi;

