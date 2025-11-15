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
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" aria-hidden="true" />
            Giỏ hàng ({selectedOrder?.orderDetails.length || 0} sản phẩm)
            {isLoading && <span className="text-sm text-gray-500 ml-2">(Đang cập nhật...)</span>}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              <div
                className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"
                role="status"
                aria-label="Đang tải giỏ hàng"
              ></div>
              Đang tải...
            </div>
          ) : !selectedOrder || selectedOrder.orderDetails.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" aria-hidden="true" />
              <p>Giỏ hàng trống</p>
            </div>
          ) : (
            selectedOrder.orderDetails.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <ProductImage src={item.thumbnailImage} alt={item.productName} className="w-12 h-12 flex-shrink-0" />

                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{item.productName}</div>
                  <div className="text-xs text-gray-500">
                    <span>SKU: {item.sku}</span>
                    {item.color && <span> • {item.color.name}</span>}
                    {item.capacity && <span> • {item.capacity.name}</span>}
                  </div>
                  <div className="space-y-1">
                    {item.promotion && item.promotion.isActive ? (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="line-through text-gray-500 text-xs">
                            {formatCurrencyDisplay(item.price)}
                          </span>
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                            {item.promotion.discountType === "percentage"
                              ? `-${item.promotion.discountValue}%`
                              : `-${formatCurrencyDisplay(item.promotion.discountValue)}`}
                          </span>
                        </div>
                        <div className="text-red-600 font-semibold text-sm">
                          {formatCurrencyDisplay(item.price - (item.discount / item.quantity))} / sản phẩm
                        </div>
                        <div className="text-xs text-gray-600">
                          Tổng: {formatCurrencyDisplay(item.totalAmount)}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-blue-600 font-semibold text-sm">
                          {formatCurrencyDisplay(item.price)} / sản phẩm
                        </div>
                        <div className="text-xs text-gray-600">
                          Tổng: {formatCurrencyDisplay(item.totalAmount)}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateQuantity(item.productDetailId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="h-8 w-8 p-0"
                    aria-label={`Giảm số lượng ${item.productName}`}
                  >
                    <Minus className="w-3 h-3" aria-hidden="true" />
                  </Button>
                  <span className="w-8 text-center font-medium" aria-live="polite">
                    {item.quantity}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateQuantity(item.productDetailId, item.quantity + 1)}
                    className="h-8 w-8 p-0"
                    aria-label={`Tăng số lượng ${item.productName}`}
                  >
                    <Plus className="w-3 h-3" aria-hidden="true" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onUpdateQuantity(item.productDetailId, 0)}
                    className="h-8 w-8 p-0"
                    aria-label={`Xóa ${item.productName} khỏi giỏ hàng`}
                  >
                    <Trash2 className="w-3 h-3" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedOrder && selectedOrder.orderDetails.length > 0 && (
          <div className="mt-4 pt-4 border-t space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tạm tính (giá gốc):</span>
              <span>{formatCurrencyDisplay(selectedOrder.subtotal)}</span>
            </div>
            {selectedOrder.productDiscount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Giảm giá sản phẩm (promotion):</span>
                <span>-{formatCurrencyDisplay(selectedOrder.productDiscount)}</span>
              </div>
            )}
            {selectedOrder.voucherDiscount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Giảm giá voucher:</span>
                <span>-{formatCurrencyDisplay(selectedOrder.voucherDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-lg font-bold pt-2 border-t">
              <span>Tổng cộng:</span>
              <span className="text-blue-600">{formatCurrencyDisplay(selectedOrder.totalAmount)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

