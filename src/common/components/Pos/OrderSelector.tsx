"use client"

import { formatCurrencyDisplay } from "@/common/utils/inutFormat"
import { Badge } from "@/core/shadcn/components/ui/badge"
import { Button } from "@/core/shadcn/components/ui/button"
import type { ListOrderPosResponse } from "@/lib/services/modules/posService/type"
import { X } from "lucide-react"
import { useMemo } from "react"

interface OrderSelectorProps {
  pendingOrders: ListOrderPosResponse[]
  selectedOrderId: number | null
  isLoading: boolean
  onSelectOrder: (orderId: number) => void
  onCreateOrder: () => void
  onCancelOrder: (orderId: number) => void
}

export function OrderSelector({
  pendingOrders,
  selectedOrderId,
  isLoading,
  onSelectOrder,
  onCreateOrder,
  onCancelOrder,
}: OrderSelectorProps) {
  const sortedOrders = useMemo(() => [...pendingOrders].sort((a, b) => b.id - a.id), [pendingOrders])

  return (
    <div className="flex items-center gap-2 h-14">
      {isLoading ? (
        <div className="flex items-center justify-center flex-1">
          <div
            className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"
            role="status"
            aria-label="Đang tải đơn hàng"
          ></div>
          <p className="ml-2 text-sm text-gray-500">Đang tải...</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 flex-1 overflow-x-auto scrollbar-hide pb-1">
            {sortedOrders.length === 0 ? (
              <div className="text-sm text-gray-400">Chưa có đơn hàng</div>
            ) : (
              sortedOrders.map((order) => (
                <button
                  key={order.id}
                  type="button"
                  className={`relative group flex items-center gap-2 px-3 py-2 rounded-full transition-all flex-shrink-0 h-10 ${
                    selectedOrderId === order.id
                      ? "bg-bgPrimarySolidDefault text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => onSelectOrder(order.id)}
                >
                  <span className={`font-semibold text-sm ${selectedOrderId === order.id ? "text-white" : "text-gray-900"}`}>
                    #{order.id}
                  </span>
                  <span className={`text-xs ${selectedOrderId === order.id ? "text-blue-100" : "text-gray-500"}`}>
                    {formatCurrencyDisplay(order.totalAmount)}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onCancelOrder(order.id)
                    }}
                    className={`ml-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-full p-0.5 ${
                      selectedOrderId === order.id
                        ? "hover:bg-white/20 text-white"
                        : "hover:bg-red-100 text-red-600"
                    }`}
                    aria-label={`Hủy đơn hàng #${order.id}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </button>
              ))
            )}
          </div>
          <Button 
            onClick={onCreateOrder} 
            size="sm" 
            className="shadow-sm h-10 px-4 flex-shrink-0 font-medium"
            aria-label="Tạo đơn hàng mới"
          >
            + Đơn mới
          </Button>
        </>
      )}
    </div>
  )
}

