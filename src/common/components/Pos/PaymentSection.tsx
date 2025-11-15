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
}: PaymentSectionProps) {
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
          <Select value={paymentMethod} onValueChange={onPaymentMethodChange} disabled={isDisabled}>
            <SelectTrigger id="payment-method">
              <SelectValue placeholder="Chọn phương thức" />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_METHODS.map((method) => (
                <SelectItem key={method.value} value={method.value}>
                  {method.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="total-amount" className="block text-sm font-medium mb-1">
              Tổng tiền
            </label>
            <div id="total-amount" className="p-2 bg-gray-100 rounded font-semibold text-blue-600">
              {formatCurrencyDisplay(totalAmount)}
            </div>
          </div>
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
        </div>

        {receivedAmount > 0 && (
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

        <div className="flex flex-col gap-2 pt-4">
          <Button
            onClick={onCompleteOrder}
            disabled={isDisabled}
            variant="default"
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
            aria-label="Hoàn tất thanh toán"
          >
            Hoàn tất thanh toán
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

