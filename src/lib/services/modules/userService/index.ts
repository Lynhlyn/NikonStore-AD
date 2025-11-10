import { apiSlice } from '@/lib/services/api';
import { IUserResponse } from './type';

const auth = '/auth';

export const userApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    fetchCurrentUser: build.query<IUserResponse, null>({
      query: () => ({
        url: `${auth}/current-user`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useFetchCurrentUserQuery } = userApi;

