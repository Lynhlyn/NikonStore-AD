export interface IOrder {
  orderid: number;
  trackingNumber: string;
  orderStatus: number;
  orderDate: string;
  customerId: number;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  discount: number;
  shippingFee: number;
  ordertype: string;
  paymentMethod: string;
}

export interface IOrderItem {
  orderDetailId: number;
  productId?: number;
  sku: string;
  productName: string;
  quantity: number;
  price: number;
  imageUrl: string;
  strapTypeName: string;
  compartment: string;
  dimensions: string;
  capacityName: string;
  colorName: string;
  categoryName: string;
  brandName: string;
}

export interface IOrderResponse {
  status: number;
  message: string;
  data: IOrder[];
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface IOrderDetailApiResponse {
  status: number;
  message: string;
  data: IOrderDetailResponse;
}

export interface IOrderDetailResponse {
  orderStatus: number;
  orderDate: string;
  totalAmount: number;
  discount: number;
  shippingFee: number;
  paymentMethod: string;
  shippingAddress: string;
  note: string;
  trackingNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderDetails: IOrderItem[];
  orderType: string;
  paymentStatus: string;
}

export interface ICancelOrderRequest {
  orderId: number;
  staffId?: number;
  status?: number;
  reason?: string;
}

export interface IUpdateStatusOrderRequest {
  staffId?: number;
  orderId: number;
  afterStatus: number;
  reason?: string;
}

export interface IUpdateStatusOrderResponse {
  status: number;
  message: string;
}

export interface IOrderHistorySearchRequest {
  trackingNumber?: string;
  statusAfter?: number;
  createdAtFrom?: string;
  createdAtTo?: string;
  changeByName?: string;
  notes?: string;
  orderType?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: string;
}

export interface IOrderStatusHistory {
  orderId: number;
  customerName: string;
  trackingNumber: string | null;
  orderType?: string;
  changeByType: string;
  changeByName: string;
  statusBefore: number | null;
  statusAfter: number;
  notes: string;
  createdAt: string;
}

export interface IOrderStatusHistoryResponse {
  status: number;
  message: string;
  data: IOrderStatusHistory[];
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface IExportOrdersRequest {
  keyword?: string;
  type?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
}

