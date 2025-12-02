'use client';

import { OrderSummaryProps } from './types';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
}

export function OrderSummary({ totalAmount, discount, shippingFee, note }: OrderSummaryProps) {
  const cappedDiscount = Math.min(discount, totalAmount);
  const finalAmount = Math.max(0, totalAmount - cappedDiscount + shippingFee);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Tổng kết đơn hàng</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="font-medium">Tổng tiền hàng:</span>
          <span>{formatCurrency(totalAmount)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-red-600">
            <span className="font-medium">Giảm giá:</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}
        {shippingFee > 0 && (
          <div className="flex justify-between">
            <span className="font-medium">Phí vận chuyển:</span>
            <span>{formatCurrency(shippingFee)}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
          <span>Thành tiền:</span>
          <span>{formatCurrency(finalAmount)}</span>
        </div>
      </div>
      {note && (
        <div className="mt-4 pt-4 border-t">
          <p><span className="font-medium">Ghi chú:</span> {note}</p>
        </div>
      )}
    </div>
  );
}

