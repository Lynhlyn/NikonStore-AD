"use client"

import { formatCurrencyDisplay } from "@/common/utils/inutFormat"
import { Badge } from "@/core/shadcn/components/ui/badge"
import { Button } from "@/core/shadcn/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/core/shadcn/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/shadcn/components/ui/table"
import type { ListOrderPosResponse } from "@/lib/services/modules/posService/type"
import { Trash2 } from "lucide-react"
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Đơn hàng chờ xử lý</CardTitle>
          <Button onClick={onCreateOrder} size="sm" aria-label="Tạo đơn hàng mới">
            Tạo đơn mới
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-64 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-32">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    <div
                      className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"
                      role="status"
                      aria-label="Đang tải đơn hàng"
                    ></div>
                    <p className="mt-2 text-sm text-gray-500">Đang tải...</p>
                  </TableCell>
                </TableRow>
              ) : sortedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                    Không có đơn hàng chờ
                  </TableCell>
                </TableRow>
              ) : (
                sortedOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    className={`hover:bg-gray-50 ${selectedOrderId === order.id ? "bg-blue-50/50" : ""}`}
                  >
                    <TableCell>
                      <Badge variant="outline">#{order.id}</Badge>
                    </TableCell>
                    <TableCell>{order.customer?.fullName || "Khách vãng lai"}</TableCell>
                    <TableCell className="font-semibold">{formatCurrencyDisplay(order.totalAmount)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {order.paymentStatus === "pending" ? "Chờ thanh toán" : order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={selectedOrderId === order.id ? "default" : "outline"}
                          onClick={() => onSelectOrder(order.id)}
                          className="flex-1"
                          aria-label={
                            selectedOrderId === order.id
                              ? `Đơn hàng #${order.id} đã được chọn`
                              : `Chọn đơn hàng #${order.id}`
                          }
                        >
                          {selectedOrderId === order.id ? "Đã chọn" : "Chọn"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onCancelOrder(order.id)}
                          className="px-2"
                          aria-label={`Hủy đơn hàng #${order.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

