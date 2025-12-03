import { apiSlice } from '@/lib/services/api';
import type {
  AddFAQRequest,
  FAQ,
  IFAQListResponse,
  UpdateFAQRequest,
  IFAQResponse,
  IFAQListQuery,
} from './type';

const faq = '/faqs';

export const faqApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    fetchFAQs: build.query<IFAQListResponse, IFAQListQuery>({
      query: (queryParams) => ({
        url: faq,
        method: 'GET',
        params: queryParams,
      }),
      keepUnusedDataFor: 0,
    }),
    fetchFAQById: build.query<FAQ, number>({
      query: (id) => ({
        url: `${faq}/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: IFAQResponse) => response.data,
      keepUnusedDataFor: 0,
    }),
    addFAQ: build.mutation<FAQ, AddFAQRequest>({
      query: (newFAQ) => ({
        url: faq,
        method: 'POST',
        body: newFAQ,
      }),
      transformResponse: (response: IFAQResponse) => response.data,
    }),
    updateFAQ: build.mutation<FAQ, { id: number; data: UpdateFAQRequest }>({
      query: ({ id, data }) => ({
        url: `${faq}/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: IFAQResponse) => response.data,
    }),
    deleteFAQ: build.mutation<void, number>({
      query: (id) => ({
        url: `${faq}/${id}`,
        method: 'DELETE',
      }),
    }),
    updateFAQStatus: build.mutation<FAQ, { id: number; status: boolean }>({
      query: ({ id, status }) => ({
        url: `${faq}/${id}/status`,
        method: 'PUT',
        params: { status },
      }),
      transformResponse: (response: IFAQResponse) => response.data,
    }),
  }),
});

export const {
  useFetchFAQsQuery,
  useFetchFAQByIdQuery,
  useAddFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
  useUpdateFAQStatusMutation,
} = faqApi;

