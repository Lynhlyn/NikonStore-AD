import { apiSlice } from '@/lib/services/api';
import type {
  AddBlogRequest,
  Blog,
  IBlogListResponse,
  UpdateBlogRequest,
  IBlogResponse,
  IBlogListQuery,
} from './type';

const blog = '/blogs';

export const blogApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    fetchBlogs: build.query<IBlogListResponse, IBlogListQuery>({
      query: (queryParams) => ({
        url: blog,
        method: 'GET',
        params: queryParams,
      }),
      keepUnusedDataFor: 0,
    }),
    fetchBlogById: build.query<Blog, number>({
      query: (id) => ({
        url: `${blog}/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: IBlogResponse) => response.data,
      keepUnusedDataFor: 0,
    }),
    fetchBlogBySlug: build.query<Blog, string>({
      query: (slug) => ({
        url: `${blog}/slug/${slug}`,
        method: 'GET',
      }),
      transformResponse: (response: IBlogResponse) => response.data,
      keepUnusedDataFor: 0,
    }),
    addBlog: build.mutation<Blog, AddBlogRequest>({
      query: (newBlog) => ({
        url: blog,
        method: 'POST',
        body: newBlog,
      }),
      transformResponse: (response: IBlogResponse) => response.data,
    }),
    updateBlog: build.mutation<Blog, { id: number; data: UpdateBlogRequest }>({
      query: ({ id, data }) => ({
        url: `${blog}/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: IBlogResponse) => response.data,
    }),
    deleteBlog: build.mutation<void, number>({
      query: (id) => ({
        url: `${blog}/${id}`,
        method: 'DELETE',
      }),
    }),
    updateBlogPublishStatus: build.mutation<Blog, { id: number; isPublished: boolean }>({
      query: ({ id, isPublished }) => ({
        url: `${blog}/${id}/publish`,
        method: 'PUT',
        params: { isPublished },
      }),
      transformResponse: (response: IBlogResponse) => response.data,
    }),
  }),
});

export const {
  useFetchBlogsQuery,
  useFetchBlogByIdQuery,
  useFetchBlogBySlugQuery,
  useAddBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useUpdateBlogPublishStatusMutation,
} = blogApi;

