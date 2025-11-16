"use client"

import { CustomerSelector } from "@/common/components/Pos/CustomerSelector"
import { VoucherSelector } from "@/common/components/Pos/VoucherSelector"
import { formatCurrency, formatCurrencyDisplay, getNumericValue } from "@/common/utils/inutFormat"
import { PAYMENT_METHODS } from "@/common/utils/pos-constants"
import { Button } from "@/core/shadcn/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/core/shadcn/components/ui/card"
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
  changeAmount: number
  onCompleteOrder: () => void
  isDisabled: boolean
  orderId?: number | null
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
  changeAmount,
  onCompleteOrder,
  isDisabled,
  orderId,
  onVnpayQrGenerated,
  hasOrderItems = false,
}: PaymentSectionProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null)
  const [isGeneratingQr, setIsGeneratingQr] = useState(false)
  const [qrError, setQrError] = useState<string | null>(null)

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
        } else if (qrCodeData.startsWith("http://") || qrCodeData.startsWith("https://")) {
          try {
            const dataUrl = await QRCode.toDataURL(qrCodeData, {
              width: 300,
              margin: 2,
            })
            setQrCodeDataUrl(dataUrl)
            setQrError(null)
          } catch (qrError) {
            console.error("Error rendering QR code from URL:", qrError)
            setQrError("Không thể render mã QR từ URL.")
            setQrCodeDataUrl(null)
          }
        } else {
          try {
            const dataUrl = await QRCode.toDataURL(qrCodeData, {
              width: 300,
              margin: 2,
            })
            setQrCodeDataUrl(dataUrl)
            setQrError(null)
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" aria-hidden="true" />
          Thông tin thanh toán
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CustomerSelector selectedCustomer={selectedCustomer} onCustomerSelect={onCustomerSelect} />

        <VoucherSelector
          selectedVoucher={selectedVoucher}
          onVoucherSelect={onVoucherSelect}
          orderTotal={totalAmount}
          customerId={selectedCustomer?.id ?? null}
        />

        <div>
          <label htmlFor="payment-method" className="block text-sm font-medium mb-1">
            Phương thức thanh toán
          </label>
          <Select 
            value={paymentMethod} 
            onValueChange={onPaymentMethodChange} 
            disabled={!hasOrderItems || totalAmount <= 0}
          >
            <SelectTrigger id="payment-method">
              <SelectValue placeholder="Chọn phương thức" />
            </SelectTrigger>
            <SelectContent>
              {availablePaymentMethods.map((method) => (
                <SelectItem key={method.value} value={method.value}>
                  <span className="flex items-center gap-2">
                    {method.icon && <span>{method.icon}</span>}
                    <span>{method.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="total-amount" className="block text-sm font-medium mb-1">
            Tổng tiền
          </label>
          <div id="total-amount" className="p-2 bg-gray-100 rounded font-semibold text-blue-600">
            {formatCurrencyDisplay(totalAmount)}
          </div>
        </div>

        {paymentMethod === "VNPAY-QR" && (
          <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium mb-2">
              Quét mã QR để thanh toán
            </label>
            {qrError ? (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-600 text-center">{qrError}</p>
                <Button
                  onClick={handleGenerateQr}
                  disabled={isGeneratingQr}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  Thử lại
                </Button>
              </div>
            ) : qrCodeDataUrl ? (
              <>
                <div className="p-4 bg-white rounded-lg">
                  <img 
                    src={qrCodeDataUrl} 
                    alt="VNPAY QR Code" 
                    className="w-[200px] h-[200px] object-contain"
                    onError={(e) => {
                      console.error("Error loading QR code image");
                      setQrError("Không thể hiển thị mã QR code.");
                      e.currentTarget.style.display = "none";
                    }}
                    onLoad={() => {
                      setQrError(null);
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Vui lòng quét mã QR bằng ứng dụng ngân hàng để thanh toán
                </p>
              </>
            ) : null}
          </div>
        )}

        {paymentMethod === "cash" && receivedAmount > 0 && (
          <div>
            <label htmlFor="change-amount" className="block text-sm font-medium mb-1">
              Tiền thừa
            </label>
            <div
              id="change-amount"
              className={`p-2 rounded font-semibold ${changeAmount >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
            >
              {formatCurrencyDisplay(changeAmount)}
            </div>
          </div>
        )}

        {paymentMethod === "cash" && (
          <div>
            <label htmlFor="received-amount" className="block text-sm font-medium mb-1">
              Tiền nhận
            </label>
            <Input
              id="received-amount"
              type="text"
              value={formatCurrencyDisplay(receivedAmount) || ""}
              onChange={(e) => onReceivedAmountChange(Number(getNumericValue(formatCurrency(e))))}
              placeholder="0"
              aria-label="Số tiền khách hàng đã nhận"
            />
          </div>
        )}

        <div className="flex flex-col gap-2 pt-4">
          {paymentMethod === "VNPAY-QR" ? (
            <Button
              onClick={handleGenerateQr}
              disabled={isDisabled || !orderId || isGeneratingQr}
              variant="default"
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
              aria-label="Tạo mã QR thanh toán"
            >
              {isGeneratingQr ? "Đang tạo mã QR..." : "Tạo mã QR thanh toán"}
            </Button>
          ) : (
            <Button
              onClick={onCompleteOrder}
              disabled={isDisabled || (paymentMethod === "cash" && receivedAmount < totalAmount)}
              variant="default"
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
              aria-label="Hoàn tất thanh toán"
            >
              Hoàn tất thanh toán
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

