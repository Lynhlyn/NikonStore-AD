import { apiSlice } from '@/lib/services/api';
import { ReviewListResponse } from './type';

const reviewEndpoint = '/reviews';

export const reviewApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    fetchReviewsByOrderId: build.query<ReviewListResponse, number>({
      query: (orderId) => ({
        url: `${reviewEndpoint}/order/${orderId}`,
        method: 'GET',
      }),
      providesTags: ['Review'],
    }),
  }),
  overrideExisting: false,
});

export const { useFetchReviewsByOrderIdQuery } = reviewApi;

