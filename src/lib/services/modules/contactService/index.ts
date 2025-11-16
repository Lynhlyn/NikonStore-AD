import { IListQuery } from '@/common/types/query';
import { apiSlice } from '@/lib/services/api';
import type {
  CreateContactRequest,
  Contact,
  IContactListResponse,
  IContactResponse,
  UpdateContactRequest
} from './type';

const contactEndpoint = '/contacts';

export const contactApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    fetchContacts: build.query<IContactListResponse, IListQuery & {
      status?: string;
    }>({
      query: (queryParams) => {
        const params: any = {
          page: queryParams.page || 0,
          size: queryParams.size || 10,
          sort: queryParams.sort || 'id',
          direction: queryParams.direction || 'asc',
        };

        if (queryParams.status && queryParams.status !== 'all') {
          params.status = queryParams.status;
        }

        return {
          url: contactEndpoint,
          method: 'GET',
          params,
        };
      },
      keepUnusedDataFor: 0,
      transformResponse: (response: any): IContactListResponse => {
        const pagination = response?.pagination || {};
        return {
          status: response?.status || 200,
          message: response?.message || '',
          data: Array.isArray(response?.data) ? response.data : [],
          pagination: {
            page: pagination.page ?? 0,
            size: pagination.size ?? 10,
            totalPages: pagination.totalPages ?? 0,
            totalElements: pagination.totalElements ?? 0,
          },
        };
      },
      providesTags: ['Contact'],
    }),

    fetchContactById: build.query<Contact, number>({
      query: (id) => ({
        url: `${contactEndpoint}/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: IContactResponse) => response.data,
      keepUnusedDataFor: 0,
      providesTags: ['Contact'],
    }),

    updateContact: build.mutation<Contact, { id: number; data: UpdateContactRequest }>({
      query: ({ id, data }) => ({
        url: `${contactEndpoint}/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: IContactResponse) => response.data,
      invalidatesTags: ['Contact'],
    }),

    deleteContact: build.mutation<void, number>({
      query: (id) => ({
        url: `${contactEndpoint}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Contact'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchContactsQuery,
  useFetchContactByIdQuery,
  useUpdateContactMutation,
  useDeleteContactMutation,
} = contactApi;

