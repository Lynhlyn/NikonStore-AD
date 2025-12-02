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
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-3">Thông tin đơn hàng</h3>
      <div className="space-y-2">
        <p>
          <span className="font-medium">Mã đơn hàng:</span> {order.trackingNumber}
        </p>
        <p>
          <span className="font-medium">Ngày đặt:</span> {formatDate(order.orderDate)}
        </p>
        <p>
          <span className="font-medium">Trạng thái:</span>
          <Badge className={`ml-2 ${getOrderStatusColor(order.orderStatus)}`}>
            {getOrderStatusLabel(order.orderStatus)}
          </Badge>
        </p>
        <p>
          <span className="font-medium">Phương thức thanh toán:</span>{' '}
          {getPaymentMethodLabel(order.paymentMethod)}
        </p>
        <p>
          <span className="font-medium">Trạng thái thanh toán:</span>{' '}
          {getPaymentStatusLabel(order.paymentStatus)}
        </p>
        <p>
          <span className="font-medium">Loại đơn hàng:</span> {getOrderTypeLabel(order.orderType)}
        </p>
      </div>
    </div>
  );
}

