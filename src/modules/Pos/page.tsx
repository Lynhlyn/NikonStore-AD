"use client"

import { BarcodeScanner } from "@/common/components/Pos/BarcodeScanner"
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
import { useCallback, useState } from "react"
import { toast } from "sonner"

export default function POSPage() {
  const userState = useAppSelector<RootState, IUserState>((state) => state.user)
  const user = userState.user

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
  } = usePosLogic(user?.data?.id || 1)

  const { displayTime } = useRealTime(selectedOrder?.createdAt)

  const resetPaymentState = useCallback(() => {
    setSelectedCustomer(null)
    setSelectedVoucher(null)
    setReceivedAmount(0)
    setPaymentMethod("cash")
  }, [])

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
      setOrderToCancel({ id: orderId, code: `#${orderId}` })
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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-3 py-1">
              <User className="w-4 h-4 mr-2" aria-hidden="true" />
              {user?.data?.name || "Admin"}
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              {displayTime}
            </Badge>
          </div>

          <Button
            onClick={handleRefreshAll}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Đang làm mới...' : 'Làm mới'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div></div>
            <BarcodeScanner
              onScanSuccess={(productDetail: ProductDetailPosResponse) => {
                if (!selectedOrderId) {
                  toast.error(MESSAGES.ERROR.SELECT_ORDER_FIRST)
                  return
                }
                handleAddProductToOrder(productDetail, 1)
              }}
              disabled={!selectedOrderId}
            />
          </div>
          <DialogProductTable onProductSelect={handleProductSelect} />
          <OrderSelector
            pendingOrders={pendingOrders}
            selectedOrderId={selectedOrderId}
            isLoading={isLoadingPending}
            onSelectOrder={handleSelectOrder}
            onCreateOrder={handleCreateOrder}
            onCancelOrder={handleCancelOrderClick}
          />
        </div>

        <div className="col-span-5 space-y-6">
          {!selectedOrderId && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-orange-700" role="alert">
                  <AlertCircle className="w-5 h-5" aria-hidden="true" />
                  <span className="text-sm font-medium">{MESSAGES.WARNING.SELECT_ORDER_TO_START}</span>
                </div>
              </CardContent>
            </Card>
          )}

          <OrderCart
            selectedOrder={selectedOrder}
            isLoading={isLoadingSelectedOrder}
            onUpdateQuantity={handleUpdateQuantity}
            onClearOrder={() => {
              handleClearOrderLocal()
              resetOrderState()
            }}
          />

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
            changeAmount={changeAmount}
            onCompleteOrder={handleOrderComplete}
            isDisabled={
              !selectedOrderId ||
              !selectedOrder ||
              selectedOrder.orderDetails.length === 0 ||
              receivedAmount < finalAmount
            }
          />
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
