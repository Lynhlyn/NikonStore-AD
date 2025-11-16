"use client";

import { MESSAGES, PAYMENT_METHODS } from "@/common/utils/pos-constants";
import { useFetchCustomersQuery } from "@/lib/services/modules/customerService";
import type { Customer } from "@/lib/services/modules/customerService/type";
import {
  useCancelPendingOrderMutation,
  useCompletePosOrderMutation,
  useCreatePendingPosOrderMutation,
  useCreateVnpayQrPaymentMutation,
  useGetPendingOrderByIdQuery,
  useGetPendingPosOrdersQuery,
  useGetPosProductsQuery,
  useUpdatePendingOrderMutation
} from "@/lib/services/modules/posService";
import type {
  CompletePosOrderRequest,
  CreatePosPendingOrderRequest,
  OrderDetailItem,
  PosOrderResponse,
  ProductDetailPosResponse,
} from "@/lib/services/modules/posService/type";
import { useFetchVouchersQuery } from "@/lib/services/modules/voucherService";
import type { Voucher } from "@/lib/services/modules/voucherService/type";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

interface CompleteOrderParams {
  paymentMethod: string;
  receivedAmount: number;
  voucher: Voucher | null;
}

export const usePosLogic = (staffId: number) => {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: pendingOrdersResponse,
    isLoading: isLoadingPending,
    refetch: refetchPendingOrders,
  } = useGetPendingPosOrdersQuery(
    {
      page: 0,
      size: 10,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const {
    data: selectedOrderResponse,
    isLoading: isLoadingSelectedOrder,
    refetch: refetchSelectedOrder,
  } = useGetPendingOrderByIdQuery(selectedOrderId!, {
    skip: !selectedOrderId,
    refetchOnMountOrArgChange: true,
  });

  const { refetch: refetchProducts } = useGetPosProductsQuery(
    {
      page: 0,
      size: 100,
      status: "ACTIVE",
      keyword: "",
    },
    {
      skip: true,
    },
  );

  const { refetch: refetchCustomers } = useFetchCustomersQuery(
    {
      page: 0,
      size: 20,
      keyword: "",
      status: "ACTIVE",
    },
    {
      skip: true,
    },
  );

  const { refetch: refetchVouchers } = useFetchVouchersQuery(
    {
      page: 0,
      size: 20,
      keyword: "",
      status: "ACTIVE",
    },
    {
      skip: true,
    },
  );

  const [createPendingPosOrder] = useCreatePendingPosOrderMutation();
  const [completePosOrder] = useCompletePosOrderMutation();
  const [updatePendingOrder] = useUpdatePendingOrderMutation();
  const [cancelPendingOrder, { isLoading: isCancellingOrder }] = useCancelPendingOrderMutation();
  const [createVnpayQrPayment] = useCreateVnpayQrPaymentMutation();

  const pendingOrders = pendingOrdersResponse?.data || [];
  const selectedOrder = selectedOrderResponse?.data;

  const calculateFinalAmount = useCallback((order: PosOrderResponse | undefined, voucher: Voucher | null) => {
    if (!order) return 0;
    let finalAmount = order.totalAmount;
    if (voucher) {
      let discount = 0;
      if (voucher.discountType === "percentage") {
        discount = (order.totalAmount * voucher.discountValue) / 100;
        if (voucher.maxDiscount) {
          discount = Math.min(discount, voucher.maxDiscount);
        }
      } else {
        discount = voucher.discountValue;
      }
      finalAmount = Math.max(0, order.totalAmount - discount);
    }
    return finalAmount;
  }, []);

  const refreshAllData = useCallback(async (options?: {
    skipPendingOrders?: boolean;
    skipSelectedOrder?: boolean;
    skipProducts?: boolean;
    skipCustomers?: boolean;
    skipVouchers?: boolean;
    resetState?: boolean;
  }) => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      const refreshTasks = [];

      if (!options?.skipPendingOrders) {
        refreshTasks.push(refetchPendingOrders());
      }

      if (!options?.skipSelectedOrder && selectedOrderId) {
        refreshTasks.push(refetchSelectedOrder());
      }

      if (!options?.skipProducts) {
        refreshTasks.push(refetchProducts());
      }

      if (!options?.skipCustomers) {
        refreshTasks.push(refetchCustomers());
      }

      if (!options?.skipVouchers) {
        refreshTasks.push(refetchVouchers());
      }

      await Promise.all(refreshTasks);

      if (options?.resetState) {
        setSelectedOrderId(null);
      }
    } catch  {
    } finally {
      setIsRefreshing(false);
    }
  }, [
    isRefreshing,
    refetchPendingOrders,
    refetchSelectedOrder,
    refetchProducts,
    refetchCustomers,
    refetchVouchers,
    selectedOrderId
  ]);

  const refreshData = useCallback(async (orderId?: number) => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    refreshTimeoutRef.current = setTimeout(async () => {
      try {
        const currentOrderId = orderId || selectedOrderId;
        await Promise.all([
          refetchPendingOrders(),
          currentOrderId ? refetchSelectedOrder() : Promise.resolve()
        ]);
      } catch {
      }
    }, 200);
  }, [refetchPendingOrders, refetchSelectedOrder, selectedOrderId]);

  const handleSelectOrder = useCallback(async (orderId: number) => {
    setSelectedOrderId(orderId);
  }, []);

  const handleCreateOrder = useCallback(async () => {
    const orderRequest: CreatePosPendingOrderRequest = {
      totalAmount: 0,
      paymentMethod: "cash",
      paymentStatus: "pending",
      note: "Đơn hàng mới tại quầy",
      staffId,
    };

    try {
      const response = await createPendingPosOrder(orderRequest).unwrap();

      setSelectedOrderId(response.id);
      await refreshData(response.id);

      toast.success(MESSAGES.SUCCESS.ORDER_CREATED);
      return response.id;
    } catch (error: any) {
      if (error?.status === 422 && error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error(MESSAGES.ERROR.CREATE_ORDER_FAILED);
      }
      return null;
    }
  }, [staffId, createPendingPosOrder, refreshData]);

  const handleCustomerChange = useCallback(
    async (customer: Customer | null) => {
      if (!selectedOrderId) return;
      try {
        await updatePendingOrder({
          orderId: selectedOrderId,
          request: {
            customerId: customer?.id,
            note: customer ? `Khách hàng: ${customer.fullName}` : "Khách vãng lai",
          },
        }).unwrap();
        await refreshData(selectedOrderId);
      } catch (error) {
        toast.error("Không thể cập nhật thông tin khách hàng");
      }
    },
    [selectedOrderId, updatePendingOrder, refreshData],
  );

  const handleVoucherChange = useCallback(
    async (voucher: Voucher | null) => {
      if (!selectedOrderId) return;
      try {
        await updatePendingOrder({
          orderId: selectedOrderId,
          request: {
            voucherId: voucher?.id,
          },
        }).unwrap();
        await refreshData(selectedOrderId);
      } catch (error) {
        toast.error("Không thể cập nhật voucher");
      }
    },
    [selectedOrderId, updatePendingOrder, refreshData],
  );

  const handleAddProductToOrder = useCallback(
    async (productDetail: ProductDetailPosResponse, quantity = 1) => {
      if (!selectedOrderId || !selectedOrder) {
        toast.error(MESSAGES.ERROR.SELECT_ORDER_FIRST);
        return;
      }

      try {
        const existingDetail = selectedOrder.orderDetails.find((detail) => detail.productDetailId === productDetail.id);
        let orderDetails: OrderDetailItem[];

        if (existingDetail) {
          orderDetails = selectedOrder.orderDetails.map((detail) => ({
            productDetailId: detail.productDetailId,
            quantity: detail.productDetailId === productDetail.id ? detail.quantity + quantity : detail.quantity,
          }));
        } else {
          orderDetails = [
            ...selectedOrder.orderDetails.map((detail) => ({
              productDetailId: detail.productDetailId,
              quantity: detail.quantity,
            })),
            {
              productDetailId: productDetail.id,
              quantity: quantity,
            },
          ];
        }

        await updatePendingOrder({
          orderId: selectedOrderId,
          request: { orderDetails },
        }).unwrap();
        await refreshData(selectedOrderId);
        toast.success(MESSAGES.SUCCESS.PRODUCT_ADDED);
      } catch (error) {
        toast.error(MESSAGES.ERROR.ADD_PRODUCT_FAILED);
      }
    },
    [selectedOrderId, selectedOrder, updatePendingOrder, refreshData],
  );

  const handleUpdateQuantity = useCallback(
    async (productDetailId: number, newQuantity: number) => {
      if (!selectedOrderId || !selectedOrder) return;

      try {
        let orderDetails: OrderDetailItem[];

        if (newQuantity <= 0) {
          orderDetails = selectedOrder.orderDetails
            .filter((detail) => detail.productDetailId !== productDetailId)
            .map((detail) => ({
              productDetailId: detail.productDetailId,
              quantity: detail.quantity,
            }));
        } else {
          orderDetails = selectedOrder.orderDetails.map((detail) => ({
            productDetailId: detail.productDetailId,
            quantity: detail.productDetailId === productDetailId ? newQuantity : detail.quantity,
          }));
        }

        await updatePendingOrder({
          orderId: selectedOrderId,
          request: { orderDetails },
        }).unwrap();
        await refreshData(selectedOrderId);
        toast.success(MESSAGES.SUCCESS.QUANTITY_UPDATED);
      } catch (error) {
        toast.error(MESSAGES.ERROR.UPDATE_QUANTITY_FAILED);
      }
    },
    [selectedOrderId, selectedOrder, updatePendingOrder, refreshData],
  );

  const handleCompleteOrder = useCallback(
    async ({ paymentMethod, receivedAmount, voucher }: CompleteOrderParams) => {
      if (!selectedOrderId || !selectedOrder) {
        toast.error(MESSAGES.ERROR.SELECT_ORDER);
        return false;
      }

      if (selectedOrder.orderDetails.length === 0) {
        toast.error(MESSAGES.ERROR.EMPTY_ORDER);
        return false;
      }

      const finalAmount = calculateFinalAmount(selectedOrder, voucher);
      if (receivedAmount < finalAmount) {
        toast.error(MESSAGES.ERROR.INSUFFICIENT_PAYMENT);
        return false;
      }

      const completeRequest: CompletePosOrderRequest = {
        paymentMethod,
        amountPaid: receivedAmount,
        changeAmount: receivedAmount - finalAmount,
        voucherId: voucher?.id,
        paymentNote: `Thanh toán ${PAYMENT_METHODS.find((m) => m.value === paymentMethod)?.label}`,
        orderNote: "Hoàn tất đơn hàng tại quầy",
      };

      try {
        await completePosOrder({
          orderId: selectedOrderId,
          request: completeRequest,
        }).unwrap();

        await refreshAllData({
          skipSelectedOrder: true,
          resetState: true
        });

        toast.success(MESSAGES.SUCCESS.ORDER_COMPLETED);
        return true;
      } catch (error) {
        toast.error(MESSAGES.ERROR.COMPLETE_ORDER_FAILED);
        return false;
      }
    },
    [selectedOrderId, selectedOrder, calculateFinalAmount, completePosOrder, refreshAllData],
  );

  const handleClearOrder = useCallback(() => {
    setSelectedOrderId(null);
  }, []);

  const resetOrderState = useCallback(() => {
    setSelectedOrderId(null);
  }, []);

  const handleCancelOrder = useCallback(
    async (orderId: number, cancelReason: string) => {
      try {
        await cancelPendingOrder({
          orderId,
          staffId,
          cancelReason,
        }).unwrap();

        if (selectedOrderId === orderId) {
          resetOrderState();
        }

        await refreshAllData({
          skipSelectedOrder: selectedOrderId === orderId,
          resetState: selectedOrderId === orderId
        });

        return true;
      } catch (error: any) {
        if (error?.data?.message) {
          toast.error(error.data.message);
        } else if (error?.status === 422 && error?.data?.message) {
          toast.error(error.data.message);
        } else {
          toast.error("Không thể hủy đơn hàng");
        }
        return false;
      }
    },
    [selectedOrderId, cancelPendingOrder, refreshAllData, resetOrderState, staffId],
  );

  const handleCreateVnpayQr = useCallback(
    async (orderId: number): Promise<string | null> => {
      try {
        const response = await createVnpayQrPayment(orderId).unwrap();
        return response.data;
      } catch (error: any) {
        if (error?.data?.message) {
          toast.error(error.data.message);
        } else {
          toast.error("Không thể tạo mã QR thanh toán");
        }
        return null;
      }
    },
    [createVnpayQrPayment],
  );

  return {
    selectedOrderId,
    selectedOrder,
    pendingOrders,
    isLoadingSelectedOrder,
    isLoadingPending,
    isCancellingOrder,
    isRefreshing,
    handleSelectOrder,
    handleCreateOrder,
    handleCompleteOrder,
    handleUpdateQuantity,
    handleClearOrder,
    resetOrderState,
    handleCancelOrder,
    handleAddProductToOrder,
    handleCustomerChange,
    handleVoucherChange,
    calculateFinalAmount,
    refreshAllData,
    refreshData,
    handleCreateVnpayQr,
  };
};
