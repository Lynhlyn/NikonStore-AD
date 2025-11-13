import { IListQuery } from '@/common/types/query';
import { apiSlice } from '@/lib/services/api';
import type {
  AddPromotionRequest,
  IPromotionListResponse,
  IPromotionResponse,
  Promotion,
  UpdatePromotionRequest,
} from './type';

const promotion = '/promotions';

export const promotionApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    fetchPromotions: build.query<IPromotionListResponse, IListQuery & {
      status?: string;
      sortBy?: string;
      sortDir?: 'asc' | 'desc';
    }>({
      query: (queryParams) => {
        const params: any = {
          page: queryParams.page || 0,
          size: queryParams.size || 10,
          sort: queryParams.sortBy || 'id',
          direction: queryParams.sortDir || 'desc',
        };
        if (queryParams.status) {
          params.status = queryParams.status;
        }
        return {
          url: promotion,
          method: 'GET',
          params,
        };
      },
      keepUnusedDataFor: 0,
      providesTags: ['Promotion'],
    }),
    searchPromotions: build.query<IPromotionListResponse, {
      page?: number;
      size?: number;
      name?: string;
      code?: string;
      status?: number;
      discountType?: string;
      appliesTo?: string;
      sortBy?: string;
      sortDir?: string;
    }>({
      query: (queryParams) => ({
        url: `${promotion}/search`,
        method: 'POST',
        body: queryParams,
      }),
      transformResponse: (response: IPromotionListResponse | { data: IPromotionListResponse }) => {
        if ('data' in response) {
          return response.data;
        }
        return response;
      },
      keepUnusedDataFor: 0,
      providesTags: ['Promotion'],
    }),
    fetchPromotionById: build.query<Promotion, number>({
      query: (id) => ({
        url: `${promotion}/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: IPromotionResponse) => response.data,
      keepUnusedDataFor: 0,
      providesTags: ['Promotion'],
    }),
    addPromotion: build.mutation<Promotion, AddPromotionRequest>({
      query: (newPromotion) => ({
        url: promotion,
        method: 'POST',
        body: newPromotion,
      }),
      transformResponse: (response: IPromotionResponse) => response.data,
      invalidatesTags: ['Promotion'],
    }),
    updatePromotion: build.mutation<Promotion, UpdatePromotionRequest>({
      query: ({ id, ...updatedPromotion }) => ({
        url: `${promotion}/${id}`,
        method: 'PUT',
        body: updatedPromotion,
      }),
      transformResponse: (response: IPromotionResponse) => response.data,
      invalidatesTags: ['Promotion'],
    }),
    deletePromotion: build.mutation<void, number>({
      query: (id) => ({
        url: `${promotion}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Promotion'],
    }),
    togglePromotionStatus: build.mutation<Promotion, number>({
      query: (id) => ({
        url: `${promotion}/${id}/toggle-status`,
        method: 'PUT',
      }),
      transformResponse: (response: IPromotionResponse) => response.data,
      invalidatesTags: ['Promotion'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchPromotionsQuery,
  useSearchPromotionsQuery,
  useFetchPromotionByIdQuery,
  useAddPromotionMutation,
  useUpdatePromotionMutation,
  useDeletePromotionMutation,
  useTogglePromotionStatusMutation,
} = promotionApi;

