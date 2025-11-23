'use client';

import { useFetchOrderByIdQuery, useExportOrderDetailToExcelMutation } from "@/lib/services/modules/orderService";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/core/shadcn/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { useAppNavigation } from "@/common/hooks";
import { routerApp } from "@/router";
import { Badge } from "@/core/shadcn/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/shadcn/components/ui/table";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface OrderDetailProps {
  params: {
    id: string;
  };
}

export default function OrderDetail({ params }: OrderDetailProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getRouteWithRole } = useAppNavigation();
  const orderId = parseInt(params.id);
  const { data: orderResponse, isLoading, error } = useFetchOrderByIdQuery(orderId);
  const [exportOrderDetailToExcel, { isLoading: isExporting }] = useExportOrderDetailToExcelMutation();
  const orderDetail = orderResponse?.data;

  const source = searchParams.get('source') || 'online';

  const getBackRoute = () => {
    const query = new URLSearchParams(searchParams.toString());
    let baseRoute;

    switch (source) {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusLabel = (status: number) => {
    const statusMap: { [key: number]: string } = {
      3: 'Chờ xác nhận',
      4: 'Đã xác nhận',
      5: 'Đang giao hàng',
      6: 'Đã hoàn thành',
      7: 'Đã hủy',
      8: 'Chờ thanh toán',
      12: 'Giao hàng thất bại',
      13: 'Đang chuẩn bị hàng'
    };
    return statusMap[status] || `Trạng thái ${status}`;
  };

  const getStatusColor = (status: number) => {
    const colorMap: { [key: number]: string } = {
      3: 'text-yellow-700 bg-yellow-100',
      4: 'text-blue-700 bg-blue-100',
      5: 'text-orange-700 bg-orange-100',
      6: 'text-green-900 bg-green-200',
      7: 'text-red-700 bg-red-100',
      8: 'text-yellow-700 bg-yellow-100',
      12: 'text-red-700 bg-red-100',
      13: 'text-indigo-700 bg-indigo-100'
    };
    return colorMap[status] || 'text-gray-700 bg-gray-100';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '--/--/----';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xuất Excel');
    }
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
          <h1 className="text-2xl font-bold">Chi tiết đơn hàng #{params.id}</h1>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center text-red-500">
            <p>Có lỗi xảy ra khi tải dữ liệu đơn hàng hoặc không tìm thấy đơn hàng</p>
          </div>
        </div>
      </div>
    );
  }

  const totalAmount = orderDetail.totalAmount || 0;
  const discount = orderDetail.discount || 0;
  const shippingFee = orderDetail.shippingFee || 0;
  // Cap discount to not exceed totalAmount to prevent negative final amount
  const cappedDiscount = Math.min(discount, totalAmount);
  const finalAmount = Math.max(0, totalAmount - cappedDiscount + shippingFee);

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-3">Thông tin đơn hàng</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Mã đơn hàng:</span> {orderDetail.trackingNumber}</p>
            <p><span className="font-medium">Ngày đặt:</span> {formatDate(orderDetail.orderDate)}</p>
            <p><span className="font-medium">Trạng thái:</span>
              <Badge className={`ml-2 ${getStatusColor(orderDetail.orderStatus)}`}>
                {getStatusLabel(orderDetail.orderStatus)}
              </Badge>
            </p>
            <p><span className="font-medium">Phương thức thanh toán:</span> {orderDetail.paymentMethod || '-'}</p>
            <p><span className="font-medium">Trạng thái thanh toán:</span> {orderDetail.paymentStatus || '-'}</p>
            <p><span className="font-medium">Loại đơn hàng:</span> {orderDetail.orderType || '-'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-3">Thông tin khách hàng</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Tên khách hàng:</span> {orderDetail.customerName || '-'}</p>
            <p><span className="font-medium">Email:</span> {orderDetail.customerEmail || '-'}</p>
            <p><span className="font-medium">Số điện thoại:</span> {orderDetail.customerPhone || '-'}</p>
            <p><span className="font-medium">Địa chỉ giao hàng:</span> {orderDetail.shippingAddress || '-'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Danh sách sản phẩm</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>STT</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Tên sản phẩm</TableHead>
              <TableHead>Số lượng</TableHead>
              <TableHead>Đơn giá</TableHead>
              <TableHead>Thành tiền</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderDetail.orderDetails && orderDetail.orderDetails.length > 0 ? (
              orderDetail.orderDetails.map((item: any, index: number) => (
                <TableRow key={item.orderDetailId || index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.sku || '-'}</TableCell>
                  <TableCell>{item.productName || '-'}</TableCell>
                  <TableCell>{item.quantity || 0}</TableCell>
                  <TableCell>{formatCurrency(item.price || 0)}</TableCell>
                  <TableCell>{formatCurrency((item.price || 0) * (item.quantity || 0))}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">Không có sản phẩm</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

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
            <span>{formatCurrency(totalAmount)}</span>
          </div>
        </div>
        {orderDetail.note && (
          <div className="mt-4 pt-4 border-t">
            <p><span className="font-medium">Ghi chú:</span> {orderDetail.note}</p>
          </div>
        )}
      </div>
    </div>
  );
}

