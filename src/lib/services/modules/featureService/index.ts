import { apiSlice } from '@/lib/services/api';
import type { IListQuery } from '@/common/types/query';
import type { Feature, AddFeatureRequest, UpdateFeatureRequest, IFeatureListResponse, IFeatureResponse } from './type';

const feature = '/features';

export const featureApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    fetchFeatures: build.query<IFeatureListResponse, IListQuery>({
      query: (queryParams) => ({
        url: feature,
        method: 'GET',
        params: queryParams,
      }),
      keepUnusedDataFor: 0,
    }),
    fetchFeatureById: build.query<Feature, number>({
      query: (id) => ({
        url: `${feature}/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: IFeatureResponse) => response.data,
      keepUnusedDataFor: 0,
    }),
    addFeature: build.mutation<Feature, AddFeatureRequest>({
      query: (newFeature) => ({
        url: feature,
        method: 'POST',
        body: newFeature,
      }),
      transformResponse: (response: IFeatureResponse) => response.data,
    }),
    updateFeature: build.mutation<Feature, UpdateFeatureRequest>({
      query: ({ id, ...updatedFeature }) => ({
        url: `${feature}/${id}`,
        method: 'PUT',
        body: updatedFeature,
      }),
      transformResponse: (response: IFeatureResponse) => response.data,
    }),
    deleteFeature: build.mutation<void, number>({
      query: (id) => ({
        url: `${feature}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useFetchFeaturesQuery,
  useFetchFeatureByIdQuery,
  useAddFeatureMutation,
  useUpdateFeatureMutation,
  useDeleteFeatureMutation,
} = featureApi;

