import TokenService from "@/common/utils/tokenService";
import type { Action } from "@reduxjs/toolkit";
import {
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import { REHYDRATE } from "redux-persist";
import type { RootState } from "./store";

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/`,
  prepareHeaders: (headers, { getState, endpoint }) => {
    const token = (getState() as RootState).auth.token;

    if (endpoint !== 'uploadImages' && endpoint !== 'uploadImage') {
      headers.set("Content-Type", "application/json");
    }

    if (token?.accessToken) {
      headers.set("Authorization", `Bearer ${token.accessToken}`);
    }
    return headers;
  },
});

const uploadBaseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_UPLOAD_URL}/api/upload`,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

    if (token?.accessToken) {
      headers.set("Authorization", `Bearer ${token.accessToken}`);
    }
    return headers;
  },
});

const mutex = new Mutex();

const baseQueryWithInterceptor: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  await mutex.waitForUnlock();

  const isUploadEndpoint = api.endpoint === 'uploadImages' || api.endpoint === 'uploadImage';
  const queryFn = isUploadEndpoint ? uploadBaseQuery : baseQuery;

  let result = await queryFn(args, api, extraOptions);

  if (result.error && (result.error.status === 401 || result.error.status === 403) && (api.endpoint !== "login" && api.endpoint !== "register")) {
    if (mutex.isLocked()) {
      await mutex.waitForUnlock();
      result = await queryFn(args, api, extraOptions);
    } else {
      const release = await mutex.acquire();
      const authToken = TokenService.getToken();
      try {
        interface RefreshResult {
          accessToken: string;
        }
        const refreshResult = (await baseQuery(
          {
            url: "/auth/refresh-token",
            method: "POST",
            body: {
              refreshToken: authToken?.refreshToken,
            },
          },
          api,
          extraOptions,
        )) as { data: RefreshResult };
        if (refreshResult.data) {
          api.dispatch({
            type: "auth/setToken",
            payload: {
              accessToken: refreshResult.data.accessToken,
            }
          });

          result = await queryFn(args, api, extraOptions);
        } else {
          api.dispatch({ type: "auth/setLogout" });
        }
      } catch (_e) {
        api.dispatch({ type: "auth/setLogout" });
      } finally {
        release();
      }
    }
  }
  return result;
};

function isHydrateAction(action: Action): action is Action<typeof REHYDRATE> & {
  key: string
  payload: RootState
  err: unknown
} {
  return action.type === REHYDRATE
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithInterceptor,
  tagTypes: ['Customer', 'ShippingAddress', 'CustomerVoucher', 'TemplateEmail'],
  extractRehydrationInfo(action, { reducerPath }): any {
    if (isHydrateAction(action)) {
      if (action.key === 'key used with redux-persist') {
        return action.payload
      }
      return undefined
    }
  },
  endpoints: (_build) => ({}),
});

