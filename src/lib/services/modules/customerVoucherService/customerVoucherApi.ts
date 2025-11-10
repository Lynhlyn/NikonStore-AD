import { apiSlice } from '@/lib/services/api';
import type { CustomerVoucherResponseDTO } from './type';

const customerVoucherEndpoint = '/customer-vouchers';

export const customerVoucherApi = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        assignVouchersToCustomer: build.mutation<
            CustomerVoucherResponseDTO[],
            { customerId: number; voucherIds: number[] }
        >({
            query: (data) => ({
                url: `${customerVoucherEndpoint}/assign`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['CustomerVoucher'],
        }),

        assignVoucherToCustomers: build.mutation<
            void,
            { voucherId: number; customerIds: number[] }
        >({
            query: ({ voucherId, customerIds }) => ({
                url: `${customerVoucherEndpoint}/assign-bulk`,
                method: 'POST',
                params: { voucherId },
                body: customerIds,
            }),
            invalidatesTags: ['CustomerVoucher'],
        }),

        getVouchersByCustomer: build.query<
            { data: CustomerVoucherResponseDTO[]; total: number },
            { customerId: number; page?: number; size?: number; sort?: string; direction?: string }
        >({
            query: ({ customerId, page = 0, size = 10, sort = 'voucher.id', direction = 'desc' }) => ({
                url: `${customerVoucherEndpoint}/customer/${customerId}`,
                method: 'GET',
                params: { page, size, sort, direction },
            }),
            transformResponse: (response: any) => ({
                data: response.data || [],
                total: response.pagination?.totalElements || 0,
            }),
            providesTags: ['CustomerVoucher'],
        }),

        getCustomersByVoucher: build.query<
            { data: CustomerVoucherResponseDTO[]; total: number },
            { voucherId: number; page?: number; size?: number; sort?: string; direction?: string }
        >({
            query: ({ voucherId, page = 0, size = 10, sort = 'customer.id', direction = 'desc' }) => ({
                url: `${customerVoucherEndpoint}/voucher/${voucherId}/customers`,
                method: 'GET',
                params: { page, size, sort, direction },
            }),
            transformResponse: (response: any) => ({
                data: response.data || [],
                total: response.pagination?.totalElements || 0,
            }),
            providesTags: ['CustomerVoucher'],
        }),

        getUnusedVouchersByCustomer: build.query<
            CustomerVoucherResponseDTO[],
            { customerId: number }
        >({
            query: ({ customerId }) => ({
                url: `${customerVoucherEndpoint}/customer/${customerId}/unused`,
                method: 'GET',
            }),
            transformResponse: (response: any) => response.data || [],
            providesTags: ['CustomerVoucher'],
        }),

        getUsedVouchersByCustomer: build.query<
            CustomerVoucherResponseDTO[],
            { customerId: number }
        >({
            query: ({ customerId }) => ({
                url: `${customerVoucherEndpoint}/customer/${customerId}/used`,
                method: 'GET',
            }),
            transformResponse: (response: any) => response.data || [],
            providesTags: ['CustomerVoucher'],
        }),

        useVoucher: build.mutation<
            CustomerVoucherResponseDTO,
            { customerId: number; voucherId: number }
        >({
            query: ({ customerId, voucherId }) => ({
                url: `${customerVoucherEndpoint}/customer/${customerId}/voucher/${voucherId}/use`,
                method: 'POST',
            }),
            invalidatesTags: ['CustomerVoucher'],
        }),

        removeVoucherFromCustomer: build.mutation<
            void,
            { customerId: number; voucherId: number }
        >({
            query: ({ customerId, voucherId }) => ({
                url: `${customerVoucherEndpoint}/customer/${customerId}/voucher/${voucherId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['CustomerVoucher'],
        }),

        getCustomerVoucherStatistics: build.query<
            { totalVouchers: number; usedVouchers: number; unusedVouchers: number },
            { customerId: number }
        >({
            query: ({ customerId }) => ({
                url: `${customerVoucherEndpoint}/customer/${customerId}/statistics`,
                method: 'GET',
            }),
            transformResponse: (response: any) => response.data || {},
            providesTags: ['CustomerVoucher'],
        }),

        checkCustomerHasVoucher: build.query<
            boolean,
            { customerId: number; voucherId: number }
        >({
            query: ({ customerId, voucherId }) => ({
                url: `${customerVoucherEndpoint}/check`,
                method: 'GET',
                params: { customerId, voucherId },
            }),
            transformResponse: (response: any) => response.data || false,
            providesTags: ['CustomerVoucher'],
        }),
    }),
    overrideExisting: false,
});

export const {
    useAssignVouchersToCustomerMutation,
    useAssignVoucherToCustomersMutation,
    useGetVouchersByCustomerQuery,
    useGetCustomersByVoucherQuery,
    useGetUnusedVouchersByCustomerQuery,
    useGetUsedVouchersByCustomerQuery,
    useUseVoucherMutation,
    useRemoveVoucherFromCustomerMutation,
    useGetCustomerVoucherStatisticsQuery,
    useCheckCustomerHasVoucherQuery,
} = customerVoucherApi;

