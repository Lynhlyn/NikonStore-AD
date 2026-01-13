"use client"

import { ProductImage } from "@/common/components/Pos/ProductImage"
import { formatCurrencyDisplay } from "@/common/utils/inutFormat"
import { Button } from "@/core/shadcn/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/core/shadcn/components/ui/card"
import type { PosOrderResponse } from "@/lib/services/modules/posService/type"
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"

interface OrderCartProps {
  selectedOrder: PosOrderResponse | null | undefined
  isLoading: boolean
  onUpdateQuantity: (productDetailId: number, newQuantity: number) => void
  onClearOrder: () => void
}

export function OrderCart({ selectedOrder, isLoading, onUpdateQuantity, onClearOrder }: OrderCartProps) {
  const calculateDiscountedPrice = (price: number, promotion?: any) => {
    if (!promotion || !promotion.isActive) {
      return price
    }

    if (promotion.discountType === "percentage") {
      const discountAmount = (price * promotion.discountValue) / 100
      return Math.round(price - discountAmount)
    } else if (promotion.discountType === "fixed_amount" || promotion.discountType === "amount") {
      return Math.max(0, price - promotion.discountValue)
    }

    return price
  }

  const getUnitPrice = (item: any) => {
    return item.price
  }

  const getOriginalUnitPrice = (item: any) => {
    if (item.originalPrice) {
      return item.originalPrice
    }
    
    if (item.promotion && item.promotion.isActive) {
      if (item.promotion.discountType === "percentage") {
        return Math.round(item.price / (1 - item.promotion.discountValue / 100))
      } else if (item.promotion.discountType === "fixed_amount" || item.promotion.discountType === "amount") {
        return item.price + item.promotion.discountValue
      }
    }
    return item.price
  }

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="bg-white border-b border-gray-200 px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" aria-hidden="true" />
            <span className="text-sm sm:text-base font-semibold">Giỏ hàng</span>
            <span className="text-xs sm:text-sm font-normal text-gray-500">({selectedOrder?.orderDetails.length || 0})</span>
            {isLoading && <span className="text-xs sm:text-sm text-gray-400 ml-2">(Đang cập nhật...)</span>}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-2 sm:p-4">
        <div className="space-y-2 max-h-48 sm:max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              <div
                className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600 mx-auto mb-2"
                role="status"
                aria-label="Đang tải giỏ hàng"
              ></div>
              Đang tải...
            </div>
          ) : !selectedOrder || selectedOrder.orderDetails.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" aria-hidden="true" />
              <p className="text-sm font-medium">Giỏ hàng trống</p>
            </div>
          ) : (
            selectedOrder.orderDetails.map((item) => (
              <div key={item.id} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                <ProductImage src={item.thumbnailImage} alt={item.productName} className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-md border border-gray-200" />

                <div className="flex-1 min-w-0 max-w-[200px] sm:max-w-[250px]">
                  <div className="font-semibold text-xs sm:text-sm text-gray-900 line-clamp-2 break-words" title={item.productName}>
                    {item.productName}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 truncate">
                    <span className="hidden sm:inline">SKU: {item.sku}</span>
                    <span className="sm:hidden">{item.sku}</span>
                    {item.color && <span> • <span className="truncate inline-block max-w-[60px] sm:max-w-[80px]" title={item.color.name}>{item.color.name}</span></span>}
                    {item.capacity && <span> • <span className="truncate inline-block max-w-[60px] sm:max-w-[80px]" title={item.capacity.name}>{item.capacity.name}</span></span>}
                  </div>
                  <div className="space-y-0.5 mt-1.5">
                    {item.promotion && item.promotion.isActive ? (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="line-through text-gray-400 text-xs">
                            {formatCurrencyDisplay(getOriginalUnitPrice(item))}
                          </span>
                          <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-medium">
                            {item.promotion.discountType === "percentage"
                              ? `-${item.promotion.discountValue}%`
                              : `-${formatCurrencyDisplay(item.promotion.discountValue)}`}
                          </span>
                        </div>
                        <div className="text-red-600 font-semibold text-sm">
                          {formatCurrencyDisplay(getUnitPrice(item))} / sản phẩm
                        </div>
                        <div className="text-xs text-gray-600 font-medium">
                          Tổng: {formatCurrencyDisplay(item.totalAmount)}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-blue-600 font-semibold text-sm">
                          {formatCurrencyDisplay(getUnitPrice(item))} / sản phẩm
                        </div>
                        <div className="text-xs text-gray-600 font-medium">
                          Tổng: {formatCurrencyDisplay(item.totalAmount)}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateQuantity(item.productDetailId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="h-7 w-7 p-0 border-gray-300 hover:bg-gray-100"
                    aria-label={`Giảm số lượng ${item.productName}`}
                  >
                    <Minus className="w-3 h-3" aria-hidden="true" />
                  </Button>
                  <span className="w-8 text-center font-semibold text-gray-900" aria-live="polite">
                    {item.quantity}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateQuantity(item.productDetailId, item.quantity + 1)}
                    className="h-7 w-7 p-0 border-gray-300 hover:bg-gray-100"
                    aria-label={`Tăng số lượng ${item.productName}`}
                  >
                    <Plus className="w-3 h-3" aria-hidden="true" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onUpdateQuantity(item.productDetailId, 0)}
                    className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    aria-label={`Xóa ${item.productName} khỏi giỏ hàng`}
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedOrder && selectedOrder.orderDetails.length > 0 && (
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 space-y-1.5 sm:space-y-2 bg-gray-50 rounded-lg p-3 sm:p-4 -mx-2 sm:-mx-4 -mb-2 sm:-mb-4">
            <div className="flex justify-between text-xs sm:text-sm text-gray-600">
              <span>Tạm tính:</span>
              <span className="font-medium text-gray-900">{formatCurrencyDisplay(selectedOrder.subtotal)}</span>
            </div>
            {selectedOrder.productDiscount > 0 && (
              <div className="flex justify-between text-xs sm:text-sm text-green-600">
                <span>Giảm giá sản phẩm:</span>
                <span className="font-medium">-{formatCurrencyDisplay(selectedOrder.productDiscount)}</span>
              </div>
            )}
            {selectedOrder.voucherDiscount > 0 && (
              <div className="flex justify-between text-xs sm:text-sm text-green-600">
                <span>Giảm giá voucher:</span>
                <span className="font-medium">-{formatCurrencyDisplay(selectedOrder.voucherDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-base sm:text-lg font-bold pt-2 border-t border-gray-300">
              <span className="text-gray-900">Tổng cộng:</span>
              <span className="text-blue-600 text-lg sm:text-xl">{formatCurrencyDisplay(selectedOrder.totalAmount)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

