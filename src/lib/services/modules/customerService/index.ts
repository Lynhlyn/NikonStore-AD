import { IListQuery } from '@/common/types/query';
import { apiSlice } from '@/lib/services/api';
import type {
  CreateCustomerRequest,
  Customer,
  ICustomerListResponse,
  ICustomerResponse,
  UpdateCustomerRequest
} from './type';

const customerEndpoint = '/customers';

export const customerApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    fetchCustomers: build.query<ICustomerListResponse, IListQuery & {
      email?: string;
      phoneNumber?: string;
      gender?: string;
      provider?: string;
      isGuest?: boolean;
      createdFromDate?: string;
      createdToDate?: string;
    }>({
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const { page, size, sort, direction, keyword, status, ...rest } = queryArgs;
        return `${endpointName}(${JSON.stringify({ page, size, sort, direction, keyword, status, ...rest })})`;
      },
      query: (queryParams) => {
        const params = { ...queryParams };
        if (params.status !== undefined && params.status !== 'all') {
          if (params.status === 1 || params.status === '1') {
            params.status = 'ACTIVE';
          } else if (params.status === 0 || params.status === '0') {
            params.status = 'INACTIVE';
          }
        } else if (params.status === 'all') {
          delete params.status;
        }

        Object.keys(params).forEach(key => {
          const value = (params as Record<string, unknown>)[key];
          if (value === '' || value === 'all' || value === undefined) {
            delete (params as Record<string, unknown>)[key];
          }
        });

        return {
          url: `${customerEndpoint}/filter`,
          method: 'POST',
          body: params,
          params: {
            page: params.page || 0,
            size: params.size || 10,
            sort: params.sort || 'id',
            direction: params.direction || 'asc'
          },
        };
      },
      keepUnusedDataFor: 0,
      transformResponse: (response: any): ICustomerListResponse => {
        const pagination = response?.pagination || {};
        return {
          success: response?.status === 200,
          data: Array.isArray(response?.data) ? response.data : [],
          pagination: {
            currentPage: pagination.page ?? 0,
            totalPages: pagination.totalPages ?? 0,
            totalElements: pagination.totalElements ?? 0,
            size: pagination.size ?? 0,
          },
        } as ICustomerListResponse;
      },
      providesTags: ['Customer'],
    }),

    fetchCustomerById: build.query<Customer, number>({
      query: (id) => ({
        url: `${customerEndpoint}/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: ICustomerResponse) => response.data,
      keepUnusedDataFor: 0,
      providesTags: ['Customer'],
    }),

    addCustomer: build.mutation<Customer, CreateCustomerRequest>({
      query: (newCustomer) => {
        const customerData = {
          ...newCustomer,
          status: newCustomer.status === 1 ? 'ACTIVE' : 'INACTIVE'
        };

        return {
          url: customerEndpoint,
          method: 'POST',
          body: customerData,
        };
      },
      transformResponse: (response: ICustomerResponse) => {
        return response.data;
      },
      transformErrorResponse: (error) => {
        return error.data;
      },
      invalidatesTags: ['Customer'],
    }),

    updateCustomer: build.mutation<Customer, { id: number; data: UpdateCustomerRequest }>({
      query: ({ id, data }) => {
        const customerData = {
          ...data,
          status: data.status === 1 ? 'ACTIVE' : data.status === 11 ? 'BLOCKED' : 'INACTIVE'
        };

        return {
          url: `${customerEndpoint}/${id}`,
          method: 'PUT',
          body: customerData,
        };
      },
      transformResponse: (response: ICustomerResponse) => {
        return response.data;
      },
      transformErrorResponse: (error) => {
        return error.data;
      },
      invalidatesTags: ['Customer'],
    }),

    deleteCustomer: build.mutation<void, { id: number; reason: string }>({
      query: ({ id, reason }) => ({
        url: `${customerEndpoint}/${id}`,
        method: 'DELETE',
        body: reason,
      }),
      invalidatesTags: ['Customer'],
    }),

    toggleCustomerStatus: build.mutation<Customer, { id: number; status: number }>({
      query: ({ id, status }) => {
        const statusEnum = status === 1 ? 'ACTIVE' : 'INACTIVE';
        return {
          url: `${customerEndpoint}/${id}/toggle-status`,
          method: 'PATCH',
          body: { status: statusEnum },
        };
      },
      transformResponse: (response: ICustomerResponse) => response.data,
      invalidatesTags: ['Customer'],
    }),

    blockCustomer: build.mutation<Customer, { id: number; reason: string }>({
      query: ({ id, reason }) => ({
        url: `${customerEndpoint}/${id}/block`,
        method: 'POST',
        body: { reason },
      }),
      transformResponse: (response: ICustomerResponse) => response.data,
      invalidatesTags: ['Customer'],
    }),

    unblockCustomer: build.mutation<Customer, { id: number }>({
      query: ({ id }) => ({
        url: `${customerEndpoint}/${id}/unblock`,
        method: 'POST',
      }),
      transformResponse: (response: ICustomerResponse) => response.data,
      invalidatesTags: ['Customer'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchCustomersQuery,
  useFetchCustomerByIdQuery,
  useAddCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useToggleCustomerStatusMutation,
  useBlockCustomerMutation,
  useUnblockCustomerMutation,
} = customerApi;

