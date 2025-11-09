import { apiSlice } from '@/lib/services/api';
import {
  IDeleteImageResponse,
  IDeleteImagesRequest,
  IDeleteSingleImageResponse,
  IUploadImageRequest,
  IUploadImageResponse,
} from '@/lib/services/modules/uploadImageService/type';

export const imageApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    uploadImages: build.mutation<IUploadImageResponse, IUploadImageRequest>({
      query: ({ files, folder }) => {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append('files', file);
        });

        return {
          url: `?folder=${encodeURIComponent(folder)}`,
          method: 'POST',
          body: formData,
        };
      },
    }),
    deleteImages: build.mutation<IDeleteImageResponse, IDeleteImagesRequest>({
      query: ({ imageUrls }) => ({
        url: '',
        method: 'DELETE',
        body: imageUrls,
      }),
    }),
    deleteSingleImage: build.mutation<IDeleteSingleImageResponse, string>({
      query: (imageUrl) => ({
        url: `/${encodeURIComponent(imageUrl)}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useUploadImagesMutation,
  useDeleteImagesMutation,
  useDeleteSingleImageMutation,
} = imageApi;

