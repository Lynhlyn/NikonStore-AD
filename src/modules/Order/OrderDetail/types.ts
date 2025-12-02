import { IOrderDetailResponse } from '@/lib/services/modules/orderService/type';

export interface OrderDetailProps {
  orderId: number;
  source?: string;
}

export interface OrderInfoProps {
  order: IOrderDetailResponse;
}

export interface CustomerInfoProps {
  order: IOrderDetailResponse;
}

export interface ProductListProps {
  items: IOrderDetailResponse['orderDetails'];
  orderId?: number;
}

export interface OrderSummaryProps {
  totalAmount: number;
  discount: number;
  shippingFee: number;
  note?: string | null;
}

export interface StatusActionsProps {
  orderId: number;
  currentStatus: number;
  onStatusChange?: () => void;
}

