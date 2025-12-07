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
import { getRoleFromPathName } from "@/common/utils/pathname";
import { routerApp } from "@/router";

interface DecodedToken {
  exp?: number;
  iat?: number;
  sub?: string;
  id?: number;
}

function decodeToken(token: string): DecodedToken | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return decoded.exp < now;
}

function isTokenExpiringSoon(token: string, bufferMinutes: number = 5): boolean {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  const bufferSeconds = bufferMinutes * 60;
  return decoded.exp < now + bufferSeconds;
}

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/`,
  prepareHeaders: (headers, { getState, endpoint }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    const tokenFromService = TokenService.getToken();
    const accessToken = token?.accessToken || tokenFromService?.accessToken;

    if (endpoint !== 'uploadImages' && endpoint !== 'uploadImage') {
      headers.set("Content-Type", "application/json");
    }

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

const uploadBaseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_UPLOAD_URL}/upload`,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    const tokenFromService = TokenService.getToken();
    const accessToken = token?.accessToken || tokenFromService?.accessToken;

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
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

  const isLoginRequest = api.endpoint === "login" || api.endpoint === "register" || api.endpoint === "refreshToken";
  
  if (!isLoginRequest) {
    const state = api.getState() as RootState;
    const tokenFromState = state.auth.token;
    const authToken = TokenService.getToken();
    
    const currentAccessToken = tokenFromState?.accessToken || authToken?.accessToken;
    
    if (currentAccessToken) {
      if (isTokenExpired(currentAccessToken) || isTokenExpiringSoon(currentAccessToken, 5)) {
        if (!mutex.isLocked()) {
          const release = await mutex.acquire();
          try {
            const stateAfterWait = api.getState() as RootState;
            const tokenAfterWait = stateAfterWait.auth.token;
            const tokenFromService = TokenService.getToken();
            
            const refreshToken = tokenAfterWait?.refreshToken || tokenFromService?.refreshToken;
            
            if (!refreshToken) {
              api.dispatch({ type: "auth/setLogout" });
              if (typeof window !== 'undefined') {
                const role = getRoleFromPathName();
                window.location.href = `/${role}${routerApp.auth.signIn}`;
              }
              return { error: { status: 401, data: "No refresh token" } } as { error: FetchBaseQueryError };
            }
            
            interface RefreshResult {
              accessToken: string;
              refreshToken?: string;
            }
            const refreshResult = (await baseQuery(
              {
                url: "/auth/refresh-token",
                method: "POST",
                body: {
                  refreshToken: refreshToken,
                },
              },
              api,
              extraOptions,
            )) as { data?: RefreshResult; error?: unknown };
            
            if (refreshResult.data && refreshResult.data.accessToken) {
              api.dispatch({
                type: "auth/setToken",
                payload: {
                  accessToken: refreshResult.data.accessToken,
                  refreshToken: refreshResult.data.refreshToken || refreshToken,
                }
              });
            } else {
              api.dispatch({ type: "auth/setLogout" });
              if (typeof window !== 'undefined') {
                const role = getRoleFromPathName();
                window.location.href = `/${role}${routerApp.auth.signIn}`;
              }
              return { error: { status: 401, data: "Token expired" } } as { error: FetchBaseQueryError };
            }
          } catch (_e) {
            api.dispatch({ type: "auth/setLogout" });
            if (typeof window !== 'undefined') {
              const role = getRoleFromPathName();
              window.location.href = `/${role}${routerApp.auth.signIn}`;
            }
            return { error: { status: 401, data: "Refresh failed" } } as { error: FetchBaseQueryError };
          } finally {
            release();
          }
        } else {
          await mutex.waitForUnlock();
        }
      }
    }
  }

  let result = await queryFn(args, api, extraOptions);

  if (result.error && (result.error.status === 401 || result.error.status === 403) && !isLoginRequest) {
    if (mutex.isLocked()) {
      await mutex.waitForUnlock();
      result = await queryFn(args, api, extraOptions);
    } else {
      const release = await mutex.acquire();
      try {
        const state = api.getState() as RootState;
        const tokenFromState = state.auth.token;
        const tokenFromService = TokenService.getToken();
        
        const refreshToken = tokenFromState?.refreshToken || tokenFromService?.refreshToken;
        
        if (!refreshToken) {
          api.dispatch({ type: "auth/setLogout" });
          if (typeof window !== 'undefined') {
            const role = getRoleFromPathName();
            window.location.href = `/${role}${routerApp.auth.signIn}`;
          }
          return result;
        }
        
        interface RefreshResult {
          accessToken: string;
          refreshToken?: string;
        }
        const refreshResult = (await baseQuery(
          {
            url: "/auth/refresh-token",
            method: "POST",
            body: {
              refreshToken: refreshToken,
            },
          },
          api,
          extraOptions,
        )) as { data?: RefreshResult; error?: unknown };
        
        if (refreshResult.data && refreshResult.data.accessToken) {
          api.dispatch({
            type: "auth/setToken",
            payload: {
              accessToken: refreshResult.data.accessToken,
              refreshToken: refreshResult.data.refreshToken || refreshToken,
            }
          });

          result = await queryFn(args, api, extraOptions);
        } else {
          api.dispatch({ type: "auth/setLogout" });
          if (typeof window !== 'undefined') {
            const role = getRoleFromPathName();
            window.location.href = `/${role}${routerApp.auth.signIn}`;
          }
        }
      } catch (_e) {
        api.dispatch({ type: "auth/setLogout" });
        if (typeof window !== 'undefined') {
          const role = getRoleFromPathName();
          window.location.href = `/${role}${routerApp.auth.signIn}`;
        }
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
  tagTypes: ['Customer', 'ShippingAddress', 'CustomerVoucher', 'TemplateEmail', 'Voucher', 'Promotion', 'Order', 'OrderHistory', 'Contact', 'Review', 'FAQ', 'Blog', 'Comment'],
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

