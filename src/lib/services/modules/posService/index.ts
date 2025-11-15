import { apiSlice } from "@/lib/services/api";
import type {
  CompletePosOrderRequest,
  CreatePosPendingOrderRequest,
  IPosOrderListResponse,
  IPosOrderResponse,
  IProductDetailPosListResponse,
  IProductListResponse,
  ListOrderPosResponse,
  ProductDetailPosResponse,
  UpdatePosPendingOrderRequest,
} from "./type";

const posApiPath = "/pos";

export const posApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getPosProducts: build.query<
      IProductListResponse,
      {
        keyword?: string;
        brandId?: number;
        categoryId?: number;
        materialId?: number;
        strapTypeId?: number;
        status?: string;
        page?: number;
        size?: number;
        sort?: string;
        direction?: string;
      }
    >({
      query: (queryParams) => ({
        url: `${posApiPath}/products`,
        method: "GET",
        params: queryParams,
      }),
      keepUnusedDataFor: 0,
    }),

    getProductDetails: build.query<
      IProductDetailPosListResponse,
      {
        productId: number;
        sku?: string;
        colorId?: number;
        capacityId?: number;
        status?: string;
        minPrice?: number;
        maxPrice?: number;
        promotionId?: number;
        page?: number;
        size?: number;
        sort?: string;
        direction?: string;
      }
    >({
      query: ({ productId, ...queryParams }) => ({
        url: `${posApiPath}/products/${productId}/details`,
        method: "GET",
        params: queryParams,
      }),
      keepUnusedDataFor: 0,
    }),

    createPendingPosOrder: build.mutation<ListOrderPosResponse, CreatePosPendingOrderRequest>({
      query: (orderRequest) => ({
        url: `${posApiPath}/orders/pending`,
        method: "POST",
        body: orderRequest,
      }),
    }),

    getPendingPosOrders: build.query<
      IPosOrderListResponse,
      {
        customerId?: number;
        staffId?: number;
        page?: number;
        size?: number;
        sort?: string;
        direction?: string;
      }
    >({
      query: (queryParams) => ({
        url: `${posApiPath}/orders/pending`,
        method: "GET",
        params: queryParams,
      }),
      keepUnusedDataFor: 0,
    }),

    getPendingOrderById: build.query<IPosOrderResponse, number>({
      query: (orderId) => ({
        url: `${posApiPath}/orders/pending/${orderId}`,
        method: "GET",
      }),
    }),

    updatePendingOrder: build.mutation<
      IPosOrderResponse,
      {
        orderId: number;
        request: UpdatePosPendingOrderRequest;
      }
    >({
      query: ({ orderId, request }) => ({
        url: `${posApiPath}/orders/pending/${orderId}`,
        method: "PUT",
        body: request,
      }),
    }),

    completePosOrder: build.mutation<
      IPosOrderResponse,
      {
        orderId: number;
        request: CompletePosOrderRequest;
      }
    >({
      query: ({ orderId, request }) => ({
        url: `${posApiPath}/orders/pending/${orderId}/complete`,
        method: "POST",
        body: request,
      }),
    }),

    cancelPendingOrder: build.mutation<
      IPosOrderResponse,
      {
        orderId: number;
        staffId: number;
        cancelReason?: string;
      }
    >({
      query: ({ orderId, staffId, cancelReason = "Không có lý do" }) => ({
        url: `${posApiPath}/orders/pending/${orderId}`,
        method: "DELETE",
        params: { staffId, cancelReason },
      }),
    }),

    searchProductDetailBySlug: build.query<
      { status: number; message: string; data: ProductDetailPosResponse },
      { slug?: string; sku?: string }
    >({
      query: (params) => ({
        url: `${posApiPath}/product-details/search`,
        method: "GET",
        params,
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useGetPosProductsQuery,
  useGetProductDetailsQuery,
  useCreatePendingPosOrderMutation,
  useGetPendingPosOrdersQuery,
  useGetPendingOrderByIdQuery,
  useUpdatePendingOrderMutation,
  useCompletePosOrderMutation,
  useCancelPendingOrderMutation,
  useSearchProductDetailBySlugQuery,
} = posApi;
