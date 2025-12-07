'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/core/shadcn/components/ui/button';
import { ArrowLeft, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAppNavigation } from '@/common/hooks';
import { routerApp } from '@/router';
import {
  useFetchOrderByIdQuery,
  useExportOrderDetailToExcelMutation,
} from '@/lib/services/modules/orderService';
import { OrderDetailProps } from './types';
import { OrderInfo } from './OrderInfo';
import { CustomerInfo } from './CustomerInfo';
import { ProductList } from './ProductList';
import { OrderSummary } from './OrderSummary';
import { StatusActions } from './StatusActions';

export function OrderDetail({ orderId, source = 'online' }: OrderDetailProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getRouteWithRole } = useAppNavigation();
  const { data: orderResponse, isLoading, error, refetch } = useFetchOrderByIdQuery(orderId);
  const [exportOrderDetailToExcel, { isLoading: isExporting }] = useExportOrderDetailToExcelMutation();
  const orderDetail = orderResponse?.data;

  const currentSource = searchParams.get('source') || source;

  const getBackRoute = () => {
    const query = new URLSearchParams(searchParams.toString());
    let baseRoute;

    switch (currentSource) {
      case 'online':
        baseRoute = getRouteWithRole(routerApp.order.online);
        break;
      case 'offline':
        baseRoute = getRouteWithRole(routerApp.order.offline);
        break;
      default:
        baseRoute = getRouteWithRole(routerApp.order.history);
        break;
    }
    return query.toString() ? `${baseRoute}?${query.toString()}` : baseRoute;
  };

  const handleExportExcel = async () => {
    try {
      const result = await exportOrderDetailToExcel(orderId).unwrap();
      const filename = `ChiTietDonHang_${orderId}.xlsx`;
      const url = window.URL.createObjectURL(result);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Xuất Excel thành công!');
    } catch {
      toast.error('Có lỗi xảy ra khi xuất Excel');
    }
  };

  const handleStatusChange = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            onClick={() => router.push(getBackRoute())}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Trở về
          </Button>
          <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        </div>
        <div className="animate-pulse">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !orderDetail) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            onClick={() => router.push(getBackRoute())}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Trở về
          </Button>
          <h1 className="text-2xl font-bold">Chi tiết đơn hàng #{orderId}</h1>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center text-red-500">
            <p>Có lỗi xảy ra khi tải dữ liệu đơn hàng hoặc không tìm thấy đơn hàng</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push(getBackRoute())}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Trở về
          </Button>
          <h1 className="text-2xl font-bold">Chi tiết đơn hàng #{orderDetail.trackingNumber}</h1>
        </div>
        <div className="flex items-center gap-2">
          <StatusActions
            orderId={orderId}
            currentStatus={orderDetail.orderStatus}
            onStatusChange={handleStatusChange}
            orderNumber={orderDetail.trackingNumber}
          />
          <Button
            onClick={handleExportExcel}
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isExporting ? 'Đang xuất...' : 'Xuất Excel'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <OrderInfo order={orderDetail} />
        <CustomerInfo order={orderDetail} />
      </div>

      <div className="mb-8">
        <ProductList items={orderDetail.orderDetails || []} orderId={orderId} />
      </div>

      <OrderSummary
        totalAmount={orderDetail.totalAmount || 0}
        discount={orderDetail.discount || 0}
        shippingFee={orderDetail.shippingFee || 0}
        note={orderDetail.note}
      />
    </div>
  );
}

