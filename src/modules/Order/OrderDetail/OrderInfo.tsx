'use client';

import { Badge } from '@/core/shadcn/components/ui/badge';
import { getPaymentMethodLabel } from '@/common/utils/paymentMethodMapper';
import { getOrderStatusLabel, getOrderStatusColor } from '@/common/utils/orderStatusMapper';
import { getPaymentStatusLabel } from '@/common/utils/paymentStatusMapper';
import { getOrderTypeLabel } from '@/common/utils/orderTypeMapper';
import { OrderInfoProps } from './types';

function formatDate(dateString: string): string {
  if (!dateString) return '--/--/----';
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function OrderInfo({ order }: OrderInfoProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl font-bold mb-4 text-gray-800 pb-3 border-b border-gray-200">Thông tin đơn hàng</h3>
      <div className="space-y-4">
        <div className="flex items-start justify-between py-2">
          <span className="font-semibold text-gray-600 min-w-[160px]">Mã đơn hàng:</span>
          <span className="text-gray-900 font-mono font-semibold">{order.trackingNumber}</span>
        </div>
        <div className="flex items-start justify-between py-2">
          <span className="font-semibold text-gray-600 min-w-[160px]">Ngày đặt:</span>
          <span className="text-gray-700">{formatDate(order.orderDate)}</span>
        </div>
        <div className="flex items-start justify-between py-2">
          <span className="font-semibold text-gray-600 min-w-[160px]">Trạng thái:</span>
          <Badge className={`${getOrderStatusColor(order.orderStatus)} border font-medium px-3 py-1 rounded-full`}>
            {getOrderStatusLabel(order.orderStatus)}
          </Badge>
        </div>
        <div className="flex items-start justify-between py-2">
          <span className="font-semibold text-gray-600 min-w-[160px]">Phương thức thanh toán:</span>
          <span className="text-gray-700">{getPaymentMethodLabel(order.paymentMethod)}</span>
        </div>
        <div className="flex items-start justify-between py-2">
          <span className="font-semibold text-gray-600 min-w-[160px]">Trạng thái thanh toán:</span>
          <span className="text-gray-700">{getPaymentStatusLabel(order.paymentStatus)}</span>
        </div>
        <div className="flex items-start justify-between py-2">
          <span className="font-semibold text-gray-600 min-w-[160px]">Loại đơn hàng:</span>
          <span className="text-gray-700">{getOrderTypeLabel(order.orderType)}</span>
        </div>
      </div>
    </div>
  );
}

