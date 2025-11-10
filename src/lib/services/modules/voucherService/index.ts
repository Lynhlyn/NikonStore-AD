import { IListQuery } from '@/common/types/query';
import { apiSlice } from '@/lib/services/api';
import type {
  AddVoucherRequest,
  IVoucherListResponse,
  IVoucherResponse,
  IVoucherWithCustomersResponse,
  UpdateVoucherRequest,
  Voucher,
  VoucherWithCustomers,
} from './type';

const voucher = '/vouchers';

export const voucherApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    fetchVouchers: build.query<IVoucherListResponse, IListQuery & {
      status?: string;
      sortBy?: string;
      sortDir?: 'asc' | 'desc';
      isAll?: boolean;
    }>({
      query: (queryParams) => {
        const params: any = {
          page: queryParams.page || 0,
          size: queryParams.size || 10,
          sort: queryParams.sortBy || 'id',
          direction: queryParams.sortDir || 'desc',
        };
        if (queryParams.status) {
          params.status = queryParams.status;
        }
        if (queryParams.isAll !== undefined) {
          params.isAll = queryParams.isAll;
        }
        return {
          url: voucher,
          method: 'GET',
          params,
        };
      },
      keepUnusedDataFor: 0,
      providesTags: ['Voucher'],
    }),
    fetchVoucherById: build.query<VoucherWithCustomers, number>({
      query: (id) => ({
        url: `${voucher}/${id}/with-customers`,
        method: 'GET',
      }),
      transformResponse: (response: IVoucherWithCustomersResponse) => response.data,
      keepUnusedDataFor: 0,
      providesTags: ['Voucher'],
    }),
    addVoucher: build.mutation<Voucher, AddVoucherRequest>({
      query: (newVoucher) => ({
        url: voucher,
        method: 'POST',
        body: newVoucher,
      }),
      transformResponse: (response: IVoucherResponse) => response.data,
      invalidatesTags: ['Voucher'],
    }),
    updateVoucher: build.mutation<Voucher, UpdateVoucherRequest>({
      query: ({ id, ...updatedVoucher }) => ({
        url: `${voucher}/${id}`,
        method: 'PUT',
        body: updatedVoucher,
      }),
      transformResponse: (response: IVoucherResponse) => response.data,
      invalidatesTags: ['Voucher'],
    }),
    deleteVoucher: build.mutation<void, number>({
      query: (id) => ({
        url: `${voucher}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Voucher'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchVouchersQuery,
  useFetchVoucherByIdQuery,
  useAddVoucherMutation,
  useUpdateVoucherMutation,
  useDeleteVoucherMutation,
} = voucherApi;

