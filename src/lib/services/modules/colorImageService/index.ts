import { apiSlice } from '@/lib/services/api';
import type {
  ColorImage,
  AddColorImageRequest,
  UpdateColorImageRequest,
  IColorImageListResponse,
  IColorImageResponse,
} from './type';

const colorImage = '/color-images';

export const colorImageApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    fetchColorImagesByProductId: build.query<IColorImageListResponse, number>({
      query: (productId) => ({
        url: `${colorImage}/product/${productId}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 0,
    }),
    fetchColorImageByProductIdAndColorId: build.query<IColorImageResponse, { productId: number; colorId: number }>({
      query: ({ productId, colorId }) => ({
        url: `${colorImage}/product/${productId}/color/${colorId}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 0,
    }),
    fetchColorImageById: build.query<ColorImage, number>({
      query: (id) => ({
        url: `${colorImage}/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: IColorImageResponse) => response.data,
      keepUnusedDataFor: 0,
    }),
    addColorImage: build.mutation<ColorImage, AddColorImageRequest>({
      query: (newImage) => ({
        url: colorImage,
        method: 'POST',
        body: newImage,
      }),
      transformResponse: (response: IColorImageResponse) => response.data,
    }),
    updateColorImage: build.mutation<ColorImage, UpdateColorImageRequest>({
      query: ({ id, ...updatedImage }) => ({
        url: `${colorImage}/${id}`,
        method: 'PUT',
        body: updatedImage,
      }),
      transformResponse: (response: IColorImageResponse) => response.data,
    }),
    deleteColorImage: build.mutation<void, number>({
      query: (id) => ({
        url: `${colorImage}/${id}`,
        method: 'DELETE',
      }),
    }),
    deleteColorImageByProductAndColor: build.mutation<void, { productId: number; colorId: number }>({
      query: ({ productId, colorId }) => ({
        url: `${colorImage}/product/${productId}/color/${colorId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useFetchColorImagesByProductIdQuery,
  useFetchColorImageByProductIdAndColorIdQuery,
  useFetchColorImageByIdQuery,
  useAddColorImageMutation,
  useUpdateColorImageMutation,
  useDeleteColorImageMutation,
  useDeleteColorImageByProductAndColorMutation,
} = colorImageApi;

