import { apiSlice } from '@/lib/services/api';
import type {
  Staff,
  IStaffListResponse,
  AddStaffRequest,
  UpdateStaffRequest,
  IStaffResponse,
} from './type';
import { IListQuery } from '@/common/types/query';

const staffUrl = '/staffs';

export const staffApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    fetchStaffs: build.query<IStaffListResponse, IListQuery>({
      query: (queryParams) => ({
        url: staffUrl,
        method: 'GET',
        params: queryParams,
      }),
      keepUnusedDataFor: 0,
    }),
    fetchStaffById: build.query<Staff, number>({
      query: (id) => ({
        url: `${staffUrl}/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: IStaffResponse) => response.data,
      keepUnusedDataFor: 0,
    }),
    addStaff: build.mutation<Staff, AddStaffRequest>({
      query: (newStaff) => ({
        url: staffUrl,
        method: 'POST',
        body: newStaff,
      }),
      transformResponse: (response: IStaffResponse) => response.data,
    }),
    updateStaff: build.mutation<Staff, UpdateStaffRequest>({
      query: ({ id, ...updatedStaff }) => ({
        url: `${staffUrl}/${id}`,
        method: 'PUT',
        body: updatedStaff,
      }),
      transformResponse: (response: IStaffResponse) => response.data,
    }),
    deleteStaff: build.mutation<void, number>({
      query: (id) => ({
        url: `${staffUrl}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useFetchStaffsQuery,
  useFetchStaffByIdQuery,
  useAddStaffMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
} = staffApi;

