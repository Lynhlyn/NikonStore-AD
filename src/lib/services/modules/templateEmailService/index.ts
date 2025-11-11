import { apiSlice } from '@/lib/services/api';
import type {
  AddTemplateEmailRequest,
  TemplateEmail,
  ITemplateEmailListResponse,
  UpdateTemplateEmailRequest,
  ITemplateEmailResponse,
  ITemplateEmailListQuery,
} from './type';

const templateEmail = '/template-emails';

export const templateEmailApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    fetchTemplateEmails: build.query<ITemplateEmailListResponse, ITemplateEmailListQuery>({
      query: (queryParams) => ({
        url: templateEmail,
        method: 'GET',
        params: queryParams,
      }),
      keepUnusedDataFor: 0,
    }),
    fetchTemplateEmailById: build.query<TemplateEmail, number>({
      query: (id) => ({
        url: `${templateEmail}/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: ITemplateEmailResponse) => response.data,
      keepUnusedDataFor: 0,
    }),
    addTemplateEmail: build.mutation<TemplateEmail, AddTemplateEmailRequest>({
      query: (newTemplateEmail) => ({
        url: templateEmail,
        method: 'POST',
        body: newTemplateEmail,
      }),
      transformResponse: (response: ITemplateEmailResponse) => response.data,
    }),
    updateTemplateEmail: build.mutation<TemplateEmail, UpdateTemplateEmailRequest>({
      query: ({ id, ...updatedTemplateEmail }) => ({
        url: `${templateEmail}/${id}`,
        method: 'PUT',
        body: updatedTemplateEmail,
      }),
      transformResponse: (response: ITemplateEmailResponse) => response.data,
    }),
    deleteTemplateEmail: build.mutation<void, number>({
      query: (id) => ({
        url: `${templateEmail}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useFetchTemplateEmailsQuery,
  useFetchTemplateEmailByIdQuery,
  useAddTemplateEmailMutation,
  useUpdateTemplateEmailMutation,
  useDeleteTemplateEmailMutation,
} = templateEmailApi;

