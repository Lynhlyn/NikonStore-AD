'use client';

import { CustomerInfoProps } from './types';

export function CustomerInfo({ order }: CustomerInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-3">Thông tin khách hàng</h3>
      <div className="space-y-2">
        <p>
          <span className="font-medium">Tên khách hàng:</span> {order.customerName || '-'}
        </p>
        <p>
          <span className="font-medium">Email:</span> {order.customerEmail || '-'}
        </p>
        <p>
          <span className="font-medium">Số điện thoại:</span> {order.customerPhone || '-'}
        </p>
        <p>
          <span className="font-medium">Địa chỉ giao hàng:</span> {order.shippingAddress || '-'}
        </p>
      </div>
    </div>
  );
}

