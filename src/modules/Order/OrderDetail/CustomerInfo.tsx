'use client';

import { CustomerInfoProps } from './types';

import { User, Mail, Phone, MapPin } from 'lucide-react';

export function CustomerInfo({ order }: CustomerInfoProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl font-bold mb-4 text-gray-800 pb-3 border-b border-gray-200">Thông tin khách hàng</h3>
      <div className="space-y-4">
        <div className="flex items-start gap-3 py-2">
          <User className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <span className="font-semibold text-gray-600 block mb-1">Tên khách hàng</span>
            <span className="text-gray-900">{order.customerName || '-'}</span>
          </div>
        </div>
        <div className="flex items-start gap-3 py-2">
          <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <span className="font-semibold text-gray-600 block mb-1">Email</span>
            <span className="text-gray-700">{order.customerEmail || '-'}</span>
          </div>
        </div>
        <div className="flex items-start gap-3 py-2">
          <Phone className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <span className="font-semibold text-gray-600 block mb-1">Số điện thoại</span>
            <span className="text-gray-700">{order.customerPhone || '-'}</span>
          </div>
        </div>
        <div className="flex items-start gap-3 py-2">
          <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <span className="font-semibold text-gray-600 block mb-1">Địa chỉ giao hàng</span>
            <span className="text-gray-700">{order.shippingAddress || '-'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

