import { apiSlice } from '@/lib/services/api';
import type {
  AddBannerRequest,
  Banner,
  IBannerListResponse,
  IBannerResponse,
  UpdateBannerRequest,
} from './type';
import { IListQuery } from '@/common/types/query';

const banner = '/banners';

export interface IBannerListQuery extends IListQuery {
  position?: number;
}

export const bannerApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    fetchBanners: build.query<IBannerListResponse, IBannerListQuery>({
      query: (queryParams) => ({
        url: banner,
        method: 'GET',
        params: queryParams,
      }),
      keepUnusedDataFor: 0,
    }),
    fetchBannerById: build.query<Banner, number>({
      query: (id) => ({
        url: `${banner}/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: IBannerResponse) => response.data,
      keepUnusedDataFor: 0,
    }),
    addBanner: build.mutation<Banner, AddBannerRequest>({
      query: (newBanner) => ({
        url: banner,
        method: 'POST',
        body: newBanner,
      }),
      transformResponse: (response: IBannerResponse) => response.data,
    }),
    updateBanner: build.mutation<Banner, UpdateBannerRequest>({
      query: ({ id, ...updatedBanner }) => ({
        url: `${banner}/${id}`,
        method: 'PUT',
        body: updatedBanner,
      }),
      transformResponse: (response: IBannerResponse) => response.data,
    }),
    deleteBanner: build.mutation<void, number>({
      query: (id) => ({
        url: `${banner}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useFetchBannersQuery,
  useFetchBannerByIdQuery,
  useAddBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannerApi;

