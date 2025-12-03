import { apiSlice } from '@/lib/services/api';
import type {
  ReplyCommentRequest,
  Comment,
  ICommentListResponse,
  ICommentResponse,
  ICommentListQuery,
} from './type';

const comment = '/comments';

export const commentApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    fetchComments: build.query<ICommentListResponse, ICommentListQuery>({
      query: (queryParams) => ({
        url: comment,
        method: 'GET',
        params: queryParams,
      }),
      keepUnusedDataFor: 0,
    }),
    fetchCommentById: build.query<Comment, number>({
      query: (id) => ({
        url: `${comment}/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: ICommentResponse) => response.data,
      keepUnusedDataFor: 0,
    }),
    replyComment: build.mutation<Comment, ReplyCommentRequest>({
      query: (replyData) => ({
        url: `${comment}/reply`,
        method: 'POST',
        body: replyData,
      }),
      transformResponse: (response: ICommentResponse) => response.data,
    }),
    updateCommentStatus: build.mutation<Comment, { id: number; status: boolean }>({
      query: ({ id, status }) => ({
        url: `${comment}/${id}/status`,
        method: 'PUT',
        params: { status },
      }),
      transformResponse: (response: ICommentResponse) => response.data,
    }),
    deleteComment: build.mutation<void, number>({
      query: (id) => ({
        url: `${comment}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useFetchCommentsQuery,
  useFetchCommentByIdQuery,
  useReplyCommentMutation,
  useUpdateCommentStatusMutation,
  useDeleteCommentMutation,
} = commentApi;

