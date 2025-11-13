import { apiSlice } from '@/lib/services/api';
import {
  IOrder,
  IOrderResponse,
  IOrderDetailApiResponse,
  IOrderDetailResponse,
  ICancelOrderRequest,
  IUpdateStatusOrderResponse,
  IUpdateStatusOrderRequest,
  IOrderHistorySearchRequest,
  IOrderStatusHistoryResponse,
  IExportOrdersRequest
} from './type';

const orderEndpoint = '/orders';
const orderHistoryEndpoint = '/order-history';

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    fetchOrders: build.query<IOrderResponse, {
      page?: number;
      size?: number;
      keyword?: string;
      type?: string;
      status?: number;
      fromDate?: string;
      toDate?: string;
    }>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.page !== undefined) searchParams.append('page', params.page.toString());
        if (params.size !== undefined) searchParams.append('size', params.size.toString());
        if (params.keyword) searchParams.append('keyword', params.keyword);
        if (params.type) searchParams.append('type', params.type);
        if (params.status !== undefined) searchParams.append('status', params.status.toString());
        if (params.fromDate) searchParams.append('fromDate', params.fromDate);
        if (params.toDate) searchParams.append('toDate', params.toDate);
        return {
          url: `${orderEndpoint}/search?${searchParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Order'],
    }),

    fetchAllOrders: build.query<IOrderResponse, {
      page?: number;
      size?: number;
    }>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.page !== undefined) searchParams.append('page', params.page.toString());
        if (params.size !== undefined) searchParams.append('size', params.size.toString());
        return {
          url: `${orderEndpoint}/all?${searchParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Order'],
    }),

    fetchOrderById: build.query<IOrderDetailApiResponse, number>({
      query: (id) => ({
        url: `${orderEndpoint}/${id}`,
        method: 'GET',
      }),
      providesTags: ['Order'],
    }),

    updateStatusOrder: build.mutation<IUpdateStatusOrderResponse, IUpdateStatusOrderRequest>({
      query: (body) => ({
        url: `${orderEndpoint}/status`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Order'],
    }),

    cancelOrder: build.mutation<any, ICancelOrderRequest>({
      query: (body) => ({
        url: `${orderEndpoint}/cancel`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Order'],
    }),

    fetchOrderStatusHistory: build.query<IOrderStatusHistoryResponse, {
      page?: number;
      size?: number;
    }>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.page !== undefined) searchParams.append('page', params.page.toString());
        if (params.size !== undefined) searchParams.append('size', params.size.toString());
        return {
          url: `${orderHistoryEndpoint}?${searchParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['OrderHistory'],
    }),

    searchOrderHistory: build.query<IOrderStatusHistoryResponse, IOrderHistorySearchRequest>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.trackingNumber) searchParams.append('trackingNumber', params.trackingNumber);
        if (params.statusAfter !== undefined) searchParams.append('statusAfter', params.statusAfter.toString());
        if (params.createdAtFrom) searchParams.append('createdAtFrom', params.createdAtFrom);
        if (params.createdAtTo) searchParams.append('createdAtTo', params.createdAtTo);
        if (params.changeByName) searchParams.append('changeByName', params.changeByName);
        if (params.notes) searchParams.append('notes', params.notes);
        if (params.orderType) searchParams.append('orderType', params.orderType);
        if (params.page !== undefined) searchParams.append('page', params.page.toString());
        if (params.size !== undefined) searchParams.append('size', params.size.toString());
        if (params.sortBy) searchParams.append('sort', params.sortBy);
        if (params.sortDirection) searchParams.append('direction', params.sortDirection);
        return {
          url: `${orderHistoryEndpoint}/search?${searchParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['OrderHistory'],
    }),

    exportOrdersToExcel: build.mutation<Blob, IExportOrdersRequest>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.keyword) searchParams.append('keyword', params.keyword);
        if (params.type) searchParams.append('type', params.type);
        if (params.status) searchParams.append('status', params.status);
        if (params.fromDate) searchParams.append('fromDate', params.fromDate);
        if (params.toDate) searchParams.append('toDate', params.toDate);
        return {
          url: `${orderEndpoint}/export/excel?${searchParams.toString()}`,
          method: 'GET',
          responseHandler: async (response) => {
            return await response.blob();
          },
        };
      },
    }),

    exportOrderDetailToExcel: build.mutation<Blob, number>({
      query: (orderId) => ({
        url: `${orderEndpoint}/${orderId}/export/excel`,
        method: 'GET',
        responseHandler: async (response) => {
          return await response.blob();
        },
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchOrdersQuery,
  useFetchAllOrdersQuery,
  useFetchOrderByIdQuery,
  useUpdateStatusOrderMutation,
  useCancelOrderMutation,
  useFetchOrderStatusHistoryQuery,
  useSearchOrderHistoryQuery,
  useExportOrdersToExcelMutation,
  useExportOrderDetailToExcelMutation,
} = orderApi;

