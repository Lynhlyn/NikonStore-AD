"use client"

import { CancelOrderModal } from "@/common/components/Pos/CancelOrderModal"
import { OrderCart } from "@/common/components/Pos/OrderCart"
import { OrderSelector } from "@/common/components/Pos/OrderSelector"
import { PaymentSection } from "@/common/components/Pos/PaymentSection"
import { DialogProductDetailTable } from "@/common/components/Pos/ProductDetailTable"
import { DialogProductTable } from "@/common/components/Pos/ProductTable"
import { usePosLogic } from "@/common/hooks/usePosLogic"
import type { ProductDetailPosResponse } from "@/lib/services/modules/posService/type"
import { useRealTime } from "@/common/hooks/useRealTime"
import { MESSAGES } from "@/common/utils/pos-constants"
import { Badge } from "@/core/shadcn/components/ui/badge"
import { Button } from "@/core/shadcn/components/ui/button"
import { Card, CardContent } from "@/core/shadcn/components/ui/card"
import type { IUserState } from "@/lib/features/userSlice/type"
import { useAppSelector } from "@/lib/hook/redux"
import type { Customer } from "@/lib/services/modules/customerService/type"
import type { Voucher } from "@/lib/services/modules/voucherService/type"
import type { RootState } from "@/lib/services/store"
import { AlertCircle, RefreshCw, User } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"

export default function POSPage() {
  const userState = useAppSelector<RootState, IUserState>((state) => state.user)
  const user = userState.user
  const searchParams = useSearchParams()

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null)
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [receivedAmount, setReceivedAmount] = useState(0)
  const [showProductDetails, setShowProductDetails] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [orderToCancel, setOrderToCancel] = useState<{ id: number; code: string } | null>(null)

  const {
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
  } = usePosLogic(user?.data?.id || 1)

  const { displayTime } = useRealTime(selectedOrder?.createdAt)

  const resetPaymentState = useCallback(() => {
    setSelectedCustomer(null)
    setSelectedVoucher(null)
    setReceivedAmount(0)
    setPaymentMethod("cash")
  }, [])

  useEffect(() => {
    if (!searchParams) return
    
    const paymentStatus = searchParams.get("payment")
    const orderIdParam = searchParams.get("orderId")
    const errorCode = searchParams.get("errorCode")

    if (paymentStatus && orderIdParam) {
      if (paymentStatus === "success") {
        toast.success(`Thanh toán thành công cho đơn hàng ${orderIdParam}!`)
        setTimeout(async () => {
          await refreshAllData({ resetState: false })
          const completedOrder = pendingOrders.find(o => o.orderCode === orderIdParam)
          if (completedOrder) {
            await handleSelectOrder(completedOrder.id)
          }
        }, 1000)
        window.history.replaceState({}, "", "/pos")
      } else if (paymentStatus === "failed") {
        toast.error(`Thanh toán thất bại cho đơn hàng ${orderIdParam}. ${errorCode ? `Mã lỗi: ${errorCode}` : ""}`)
        window.history.replaceState({}, "", "/pos")
      } else if (paymentStatus === "error") {
        toast.error("Đã xảy ra lỗi khi xử lý thanh toán")
        window.history.replaceState({}, "", "/pos")
      }
    }
  }, [searchParams, refreshAllData, pendingOrders, handleSelectOrder])

  useEffect(() => {
    if (paymentMethod === "VNPAY-QR" && selectedOrderId && selectedOrder && selectedOrder.status === "PENDING_PAYMENT") {
      const intervalId = setInterval(async () => {
        try {
          await refreshData()
          const updatedOrder = pendingOrders.find(o => o.id === selectedOrderId)
          if (updatedOrder && updatedOrder.status === "COMPLETED") {
            toast.success(`Đơn hàng ${updatedOrder.orderCode || `#${updatedOrder.id}`} đã được thanh toán thành công!`)
            clearInterval(intervalId)
            await refreshAllData({ resetState: false })
            resetPaymentState()
          }
        } catch (error) {
          console.error("Error polling order status:", error)
        }
      }, 3000)

      return () => clearInterval(intervalId)
    }
  }, [paymentMethod, selectedOrderId, selectedOrder?.status, refreshData, pendingOrders, refreshAllData, resetPaymentState])

  const handleRefreshAll = useCallback(async () => {
    try {
      setSelectedCustomer(null)
      setSelectedVoucher(null)
      setReceivedAmount(0)
      setPaymentMethod("cash")
      setShowProductDetails(false)
      setSelectedProductId(null)

      await refreshAllData({ resetState: true })
      window.location.reload()
    } catch (error) {
      toast.error("Không thể làm mới dữ liệu")
    }
  }, [refreshAllData])

  const handleCustomerSelect = useCallback(
    async (customer: Customer | null) => {
      setSelectedCustomer(customer)
      if (selectedOrderId) {
        await handleCustomerChange(customer)
      }
    },
    [selectedOrderId, handleCustomerChange],
  )

  const handleVoucherSelect = useCallback(
    async (voucher: Voucher | null) => {
      setSelectedVoucher(voucher)
      if (selectedOrderId) {
        await handleVoucherChange(voucher)
      }
    },
    [selectedOrderId, handleVoucherChange],
  )

  const handleProductSelect = useCallback(
    (productId: number) => {
      if (!selectedOrderId) {
        toast.error(MESSAGES.ERROR.SELECT_ORDER_FIRST)
        return
      }
      setSelectedProductId(productId)
      setShowProductDetails(true)
    },
    [selectedOrderId],
  )

  const handleOrderComplete = useCallback(async () => {
    const success = await handleCompleteOrder({
      paymentMethod,
      receivedAmount,
      voucher: selectedVoucher,
    })

    if (success) {
      setSelectedCustomer(null)
      setSelectedVoucher(null)
      setReceivedAmount(0)
      setPaymentMethod("cash")
      setShowProductDetails(false)
      setSelectedProductId(null)

      window.location.reload()
    }
  }, [handleCompleteOrder, paymentMethod, receivedAmount, selectedVoucher])

  const handleClearOrderLocal = useCallback(() => {
    setSelectedCustomer(null)
    setSelectedVoucher(null)
    setReceivedAmount(0)
    setPaymentMethod("cash")
    setShowProductDetails(false)
    setSelectedProductId(null)
  }, [])

  const handleCancelOrderClick = useCallback((orderId: number) => {
    const order = pendingOrders.find(o => o.id === orderId)
    if (order) {
      setOrderToCancel({ id: orderId, code: order.orderCode || `#${orderId}` })
      setShowCancelModal(true)
    }
  }, [pendingOrders])

  const handleConfirmCancelOrder = useCallback(async (reason: string) => {
    if (orderToCancel) {
      try {
        setShowCancelModal(false)
        setOrderToCancel(null)
        setSelectedCustomer(null)
        setSelectedVoucher(null)
        setReceivedAmount(0)
        setPaymentMethod("cash")
        setShowProductDetails(false)
        setSelectedProductId(null)

        const success = await handleCancelOrder(orderToCancel.id, reason)

        if (success) {
          toast.success("Đã hủy đơn hàng thành công")
          window.location.reload()
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi hủy đơn hàng")
      }
    }
  }, [orderToCancel, handleCancelOrder])

  const finalAmount = calculateFinalAmount(selectedOrder, selectedVoucher)
  const changeAmount = receivedAmount - finalAmount

  return (
    <div className="h-screen flex flex-col bg-gray-50 p-2 sm:p-4 overflow-hidden">
      <div className="mb-2 sm:mb-4 flex-shrink-0">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 bg-white rounded-lg shadow-sm border border-gray-200 px-2 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5 bg-gray-100 rounded-md">
              <User className="w-4 h-4 text-gray-600" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">{user?.data?.name || "Admin"}</span>
            </div>
            <div className="px-2 sm:px-3 py-1.5 bg-blue-50 rounded-md">
              <span className="text-xs sm:text-sm font-medium text-blue-700">{displayTime}</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <OrderSelector
              pendingOrders={pendingOrders}
              selectedOrderId={selectedOrderId}
              isLoading={isLoadingPending}
              onSelectOrder={handleSelectOrder}
              onCreateOrder={handleCreateOrder}
              onCancelOrder={handleCancelOrderClick}
            />
          </div>

          <Button
            onClick={handleRefreshAll}
            disabled={isRefreshing}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex-shrink-0 w-full sm:w-auto justify-center sm:justify-start"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="text-xs sm:text-sm">{isRefreshing ? 'Đang làm mới...' : 'Làm mới'}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-4 flex-1 min-h-0 overflow-hidden">
        <div className="lg:col-span-8 flex flex-col min-h-0 h-full">
          <DialogProductTable 
            onProductSelect={handleProductSelect}
            onScanSuccess={(productDetail: ProductDetailPosResponse) => {
              if (!selectedOrderId) {
                toast.error(MESSAGES.ERROR.SELECT_ORDER_FIRST)
                return
              }
              handleAddProductToOrder(productDetail, 1)
            }}
            scanDisabled={!selectedOrderId}
          />
        </div>

        <div className="lg:col-span-4 space-y-2 sm:space-y-4 flex flex-col min-h-0 overflow-y-auto">
          {!selectedOrderId && (
            <Card className="border-orange-200 bg-orange-50/50 shadow-sm flex-shrink-0">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 text-orange-700" role="alert">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span className="text-xs sm:text-sm font-medium">{MESSAGES.WARNING.SELECT_ORDER_TO_START}</span>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex-shrink-0">
            <OrderCart
              selectedOrder={selectedOrder}
              isLoading={isLoadingSelectedOrder}
              onUpdateQuantity={handleUpdateQuantity}
              onClearOrder={() => {
                handleClearOrderLocal()
                resetOrderState()
              }}
            />
          </div>

          <div className="flex-shrink-0">
            <PaymentSection
            selectedCustomer={selectedCustomer}
            onCustomerSelect={handleCustomerSelect}
            selectedVoucher={selectedVoucher}
            onVoucherSelect={handleVoucherSelect}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
            receivedAmount={receivedAmount}
            onReceivedAmountChange={setReceivedAmount}
            totalAmount={finalAmount}
            subtotal={selectedOrder?.subtotal || 0}
            changeAmount={changeAmount}
            onCompleteOrder={handleOrderComplete}
            isDisabled={
              !selectedOrderId ||
              !selectedOrder ||
              selectedOrder.orderDetails.length === 0 ||
              (paymentMethod === "cash" && receivedAmount < finalAmount)
            }
            orderId={selectedOrderId}
            orderCode={selectedOrder?.code || `#${selectedOrderId}`}
            hasOrderItems={selectedOrder?.orderDetails && selectedOrder.orderDetails.length > 0}
            onVnpayQrGenerated={async () => {
              if (selectedOrderId) {
                const url = await handleCreateVnpayQr(selectedOrderId)
                return url || ""
              }
              return ""
            }}
          />
          </div>
        </div>
      </div>

      <DialogProductDetailTable
        isOpen={showProductDetails}
        onClose={() => setShowProductDetails(false)}
        productId={selectedProductId}
        onAddToCart={handleAddProductToOrder}
      />

      {showCancelModal && orderToCancel && (
        <CancelOrderModal
          isOpen={showCancelModal}
          onClose={() => {
            setShowCancelModal(false)
            setOrderToCancel(null)
          }}
          onConfirm={handleConfirmCancelOrder}
          isLoading={isCancellingOrder}
          orderCode={orderToCancel.code}
        />
      )}
    </div>
  )
}
