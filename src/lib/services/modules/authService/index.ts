import { apiSlice } from '@/lib/services/api';
import type {
  IForgotPasswordPayload,
  ILoginPayload,
  ILoginResponse,
  IResetPassword,
} from './type';

const auth = '/auth';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<ILoginResponse, ILoginPayload>({
      query: (body) => ({
        url: `${auth}/login`,
        method: 'POST',
        body,
      }),
    }),
    
    forgotPassword: build.mutation<null, IForgotPasswordPayload>({
      query: (body) => ({
        url: `${auth}/forgot-password`,
        method: 'POST',
        body,
      }),
    }),

    validateResetToken: build.query<{ message: string }, string>({
      query: (token) => ({
        url: `${auth}/validate-reset-token`,
        method: 'GET',
        params: { token },
      }),
    }),

    resetPassword: build.mutation<null, IResetPassword>({
      query: (body) => ({
        url: `${auth}/reset-password`,
        method: 'POST',
        body,
      }),
    }),

    refreshToken: build.mutation<{ accessToken: string; refreshToken: string }, { refreshToken: string }>({
      query: (body) => ({
        url: `${auth}/refresh-token`,
        method: 'POST',
        body,
      }),
    }),

    logout: build.mutation<null, { identifier: string }>({
      query: (body) => ({
        url: `${auth}/logout`,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useValidateResetTokenQuery,
  useResetPasswordMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
} = authApi;

