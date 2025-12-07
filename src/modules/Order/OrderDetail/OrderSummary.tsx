'use client';

import { OrderSummaryProps } from './types';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
}

function formatNote(note: string | null | undefined): string {
  if (!note || note.trim() === "" || note.trim().toLowerCase() === "null") {
    return "Không có";
  }
  return note.trim();
}

import { Receipt, Tag, Truck, FileText } from 'lucide-react';

export function OrderSummary({ totalAmount, discount, shippingFee, note }: OrderSummaryProps) {
  const safeTotalAmount = Math.max(0, totalAmount || 0);
  const safeDiscount = Math.max(0, discount || 0);
  const cappedDiscount = Math.min(safeDiscount, safeTotalAmount);
  const finalAmount = Math.max(0, safeTotalAmount - cappedDiscount + (shippingFee || 0));

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg border border-gray-200 p-6">
      <h3 className="text-xl font-bold mb-6 text-gray-800 pb-3 border-b border-gray-300">Tổng kết đơn hàng</h3>
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center py-2 bg-white rounded-lg px-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-gray-600" />
            <span className="font-semibold text-gray-700">Tổng tiền hàng:</span>
          </div>
          <span className="font-bold text-gray-900">{formatCurrency(safeTotalAmount)}</span>
        </div>
        {cappedDiscount > 0 && (
          <div className="flex justify-between items-center py-2 bg-white rounded-lg px-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-red-500" />
              <span className="font-semibold text-gray-700">Giảm giá:</span>
            </div>
            <span className="font-bold text-red-600">-{formatCurrency(cappedDiscount)}</span>
          </div>
        )}
        {shippingFee > 0 && (
          <div className="flex justify-between items-center py-2 bg-white rounded-lg px-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-gray-600" />
              <span className="font-semibold text-gray-700">Phí vận chuyển:</span>
            </div>
            <span className="font-bold text-gray-900">{formatCurrency(shippingFee)}</span>
          </div>
        )}
        <div className="flex justify-between items-center py-4 px-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg">
          <span className="text-white font-bold text-lg">Thành tiền:</span>
          <span className="text-white font-bold text-xl">{formatCurrency(finalAmount)}</span>
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-gray-300 bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-start gap-2">
          <FileText className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <span className="font-semibold text-gray-700 block mb-1">Ghi chú:</span>
            <p className="text-gray-600">{formatNote(note)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

