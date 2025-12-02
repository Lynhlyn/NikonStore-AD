export function getOrderStatusLabel(status: number): string {
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
}

export function getOrderStatusColor(status: number): string {
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
}

export const OrderStatus = {
  PENDING_CONFIRMATION: 3,
  CONFIRMED: 4,
  SHIPPING: 5,
  COMPLETED: 6,
  CANCELLED: 7,
  PENDING_PAYMENT: 8,
  FAILED_DELIVERY: 12,
  PREPARING: 13
} as const;

