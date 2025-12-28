"use client"

import { CustomerSelector } from "@/common/components/Pos/CustomerSelector"
import { VoucherSelector } from "@/common/components/Pos/VoucherSelector"
import { formatCurrency, formatCurrencyDisplay, getNumericValue } from "@/common/utils/inutFormat"
import { PAYMENT_METHODS } from "@/common/utils/pos-constants"
import { Button } from "@/core/shadcn/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/core/shadcn/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/core/shadcn/components/ui/dialog"
import { Input } from "@/core/shadcn/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/shadcn/components/ui/select"
import { Customer } from "@/lib/services/modules/customerService/type"
import type { Voucher } from "@/lib/services/modules/voucherService/type"
import { CreditCard } from "lucide-react"
import { useEffect, useState } from "react"
import QRCode from "qrcode"

interface PaymentSectionProps {
  selectedCustomer: Customer | null
  onCustomerSelect: (customer: Customer | null) => void
  selectedVoucher: Voucher | null
  onVoucherSelect: (voucher: Voucher | null) => void
  paymentMethod: string
  onPaymentMethodChange: (method: string) => void
  receivedAmount: number
  onReceivedAmountChange: (amount: number) => void
  totalAmount: number
  subtotal: number
  changeAmount: number
  onCompleteOrder: () => void
  isDisabled: boolean
  orderId?: number | null
  orderCode?: string | null
  onVnpayQrGenerated?: () => Promise<string>
  hasOrderItems?: boolean
}

export function PaymentSection({
  selectedCustomer,
  onCustomerSelect,
  selectedVoucher,
  onVoucherSelect,
  paymentMethod,
  onPaymentMethodChange,
  receivedAmount,
  onReceivedAmountChange,
  totalAmount,
  subtotal,
  changeAmount,
  onCompleteOrder,
  isDisabled,
  orderId,
  orderCode,
  onVnpayQrGenerated,
  hasOrderItems = false,
}: PaymentSectionProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null)
  const [isGeneratingQr, setIsGeneratingQr] = useState(false)
  const [qrError, setQrError] = useState<string | null>(null)
  const [isQrModalOpen, setIsQrModalOpen] = useState(false)

  const availablePaymentMethods = PAYMENT_METHODS.filter((method) => {
    if (method.value === "VNPAY-QR") {
      const isAvailable = hasOrderItems && totalAmount > 0 && orderId !== null && orderId !== undefined
      return isAvailable
    }
    return true
  })

  useEffect(() => {
    if (paymentMethod === "VNPAY-QR" && !availablePaymentMethods.find((m) => m.value === "VNPAY-QR")) {
      onPaymentMethodChange("cash")
    }
  }, [paymentMethod, availablePaymentMethods, onPaymentMethodChange])

  const handleGenerateQr = async () => {
    if (!orderId || !onVnpayQrGenerated) return
    
    setIsGeneratingQr(true)
    setQrError(null)
    try {
      const qrCodeData = await onVnpayQrGenerated()
      if (qrCodeData) {
        if (qrCodeData.startsWith("data:image")) {
          setQrCodeDataUrl(qrCodeData)
          setQrError(null)
          setIsQrModalOpen(true)
        } else if (qrCodeData.startsWith("http://") || qrCodeData.startsWith("https://")) {
          try {
            const dataUrl = await QRCode.toDataURL(qrCodeData, {
              width: 400,
              margin: 2,
            })
            setQrCodeDataUrl(dataUrl)
            setQrError(null)
            setIsQrModalOpen(true)
          } catch (qrError) {
            console.error("Error rendering QR code from URL:", qrError)
            setQrError("Không thể render mã QR từ URL.")
            setQrCodeDataUrl(null)
          }
        } else {
          try {
            const dataUrl = await QRCode.toDataURL(qrCodeData, {
              width: 400,
              margin: 2,
            })
            setQrCodeDataUrl(dataUrl)
            setQrError(null)
            setIsQrModalOpen(true)
          } catch (qrError) {
            console.error("Error rendering QR code:", qrError)
            setQrError("Không thể render mã QR từ dữ liệu VNPay.")
            setQrCodeDataUrl(null)
          }
        }
      }
    } catch (error) {
      console.error("Error generating QR:", error)
      setQrError("Không thể tạo mã QR. Vui lòng thử lại.")
      setQrCodeDataUrl(null)
    } finally {
      setIsGeneratingQr(false)
    }
  }
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="bg-white border-b border-gray-200 px-3 sm:px-4 py-2 sm:py-3">
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" aria-hidden="true" />
          <span className="text-sm sm:text-base font-semibold">Thanh toán</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-2.5 p-2 sm:p-3 min-w-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 min-w-0">
          <div className="min-w-0">
            <CustomerSelector selectedCustomer={selectedCustomer} onCustomerSelect={onCustomerSelect} />
          </div>

          <div className="min-w-0">
            <VoucherSelector
              selectedVoucher={selectedVoucher}
              onVoucherSelect={onVoucherSelect}
              orderTotal={subtotal}
              customerId={selectedCustomer?.id ?? null}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
          <div>
            <label htmlFor="payment-method" className="block text-xs font-medium mb-1 text-gray-700">
              Phương thức
            </label>
            <Select 
              value={paymentMethod} 
              onValueChange={onPaymentMethodChange} 
              disabled={!hasOrderItems || totalAmount <= 0}
            >
              <SelectTrigger id="payment-method" className="h-8 sm:h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm">
                <SelectValue placeholder="Chọn" />
              </SelectTrigger>
              <SelectContent>
                {availablePaymentMethods.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    <span className="flex items-center gap-2 text-xs sm:text-sm">
                      {method.icon && <span>{method.icon}</span>}
                      <span>{method.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="total-amount" className="block text-xs font-medium mb-1 text-gray-700">
              Tổng tiền
            </label>
            <div id="total-amount" className="h-8 sm:h-9 px-2 sm:px-3 bg-blue-50 rounded-md font-bold text-blue-700 text-sm sm:text-base border border-blue-200 flex items-center">
              {formatCurrencyDisplay(totalAmount)}
            </div>
          </div>
        </div>

        {paymentMethod === "VNPAY-QR" && qrError && (
          <div className="p-2.5 bg-red-50 rounded-lg border border-red-200">
            <p className="text-xs text-red-700 text-center font-medium mb-1.5">{qrError}</p>
            <Button
              onClick={handleGenerateQr}
              disabled={isGeneratingQr}
              variant="outline"
              size="sm"
              className="w-full border-red-300 hover:bg-red-100 h-8 text-xs"
            >
              Thử lại
            </Button>
          </div>
        )}

        {paymentMethod === "cash" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
            <div>
              <label htmlFor="received-amount" className="block text-xs font-medium mb-1 text-gray-700">
                Tiền nhận
              </label>
              <Input
                id="received-amount"
                type="text"
                value={formatCurrencyDisplay(receivedAmount) || ""}
                onChange={(e) => onReceivedAmountChange(Number(getNumericValue(formatCurrency(e))))}
                placeholder="0"
                className="h-8 sm:h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm"
                aria-label="Số tiền khách hàng đã nhận"
              />
            </div>
            {receivedAmount > 0 && (
              <div>
                <label htmlFor="change-amount" className="block text-xs font-medium mb-1 text-gray-700">
                  Tiền thừa
                </label>
                <div
                  id="change-amount"
                  className={`h-8 sm:h-9 px-2 sm:px-3 rounded-md font-bold text-sm sm:text-base border flex items-center ${changeAmount >= 0 ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}
                >
                  {formatCurrencyDisplay(changeAmount)}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="pt-0.5">
          {paymentMethod === "VNPAY-QR" ? (
            <Button
              onClick={handleGenerateQr}
              disabled={isDisabled || !orderId || isGeneratingQr}
              variant="default"
              className="w-full font-semibold shadow-sm h-8 sm:h-9 text-xs sm:text-sm"
              aria-label="Tạo mã QR thanh toán"
            >
              {isGeneratingQr ? "Đang tạo..." : "Tạo mã QR"}
            </Button>
          ) : (
            <Button
              onClick={onCompleteOrder}
              disabled={isDisabled || (paymentMethod === "cash" && receivedAmount < totalAmount)}
              variant="default"
              className="w-full font-semibold shadow-sm h-8 sm:h-9 text-xs sm:text-sm"
              aria-label="Hoàn tất thanh toán"
            >
              Hoàn tất thanh toán
            </Button>
          )}
        </div>
      </CardContent>

      <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Thanh toán qua VNPAY QR</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center gap-4 py-4">
            {qrCodeDataUrl ? (
              <>
                <div className="p-4 bg-white rounded-lg border-2 border-gray-200 shadow-lg">
                  <img 
                    src={qrCodeDataUrl} 
                    alt="VNPAY QR Code" 
                    className="w-[280px] h-[280px] object-contain"
                    onError={(e) => {
                      console.error("Error loading QR code image");
                      setQrError("Không thể hiển thị mã QR code.");
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                
                <div className="w-full space-y-2 text-center">
                  {orderCode && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Mã đơn hàng:</span> {orderCode}
                    </div>
                  )}
                  <div className="text-lg font-bold text-blue-600">
                    {formatCurrencyDisplay(totalAmount)}
                  </div>
                  <p className="text-sm text-gray-500">
                    Quét mã QR bằng ứng dụng ngân hàng để thanh toán
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Đang tạo mã QR...
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

