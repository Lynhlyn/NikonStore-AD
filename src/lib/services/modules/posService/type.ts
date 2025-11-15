import type { Brand } from "@/lib/services/modules/productService/type";
import type { Category } from "@/lib/services/modules/productService/type";
import type { Material } from "@/lib/services/modules/productService/type";

export interface CreatePosPendingOrderRequest {
  customerId?: number;
  totalAmount: number;
  voucherId?: number;
  paymentMethod: string;
  paymentStatus: string;
  note?: string;
  staffId: number;
}

export interface OrderDetailItem {
  productDetailId: number;
  quantity: number;
  note?: string;
}

export interface UpdatePosPendingOrderRequest {
  customerId?: number;
  voucherId?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  note?: string;
  orderDetails?: OrderDetailItem[];
}

export interface CompletePosOrderRequest {
  paymentMethod: string;
  amountPaid: number;
  changeAmount?: number;
  voucherId?: number;
  paymentNote?: string;
  orderNote?: string;
}

export interface ColorResponseDTO {
  id: number;
  name: string;
  code?: string;
}

export interface CapacityResponseDTO {
  id: number;
  name: string;
  value?: string;
}

export interface PromotionResponseDTO {
  id: number;
  name: string;
  title?: string | null;
  code: string;
  discountType: "percentage" | "amount";
  discountValue: number;
  appliesTo: "all" | "product" | "category";
  appliedProduct?: number | null;
  startDate: string;
  endDate: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  products?: any[] | null;
  productDetails?: any[] | null;
  discountTypeText: string;
  appliesToText: string;
  isExpired: boolean;
  isActive: boolean;
}

export interface CustomerResponseDTO {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface StaffResponseDTO {
  id: number;
  name: string;
  email?: string;
  phone?: string;
}

export interface VoucherResponseDTO {
  id: number;
  code: string;
  name: string;
  discountType: string;
  discountValue: number;
  minOrderAmount?: number;
}

export interface ProductResponseDTO {
  id: number;
  name: string;
  description?: string;
  status: string;
  thumbnailImage?: string;
  brand?: Brand;
  material?: Material;
  category?: Category;
}

export interface ProductDetailPosResponse {
  id: number;
  sku: string;
  stock: number;
  reservedStock: number;
  availableStock: number;
  productName: string;
  color: Color;
  capacity: CapacityResponseDTO;
  price: number;
  status: string;
  promotion?: PromotionResponseDTO;
  thumbnailImage?: string;
}

export interface Color {
  id: number;
  name: string;
  hexCode?: string;
}

export interface PosOrderDetailResponse {
  id: number;
  productDetailId: number;
  sku: string;
  productName: string;
  color: Color;
  capacity: CapacityResponseDTO;
  quantity: number;
  price: number;
  discount: number;
  totalAmount: number;
  promotion?: PromotionResponseDTO;
  thumbnailImage?: string;
}

type Customer = {
  id: number;
  username: string | null;
  email: string;
  fullName: string;
  phoneNumber: string;
  urlImage: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  isGuest: boolean | null;
  status: "ACTIVE" | "INACTIVE" | string;
  shippingAddresses: any[] | null;
};

export interface PosOrderResponse {
  id: number;
  code: string;
  customer?: Customer;
  staff: StaffResponseDTO;
  subtotal: number;
  productDiscount: number;
  voucher?: VoucherResponseDTO;
  voucherDiscount: number;
  totalDiscount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
  orderDetails: PosOrderDetailResponse[];
}

export interface ListOrderPosResponse {
  id: number;
  customer?: Customer;
  totalAmount: number;
  discount: number;
  voucherId?: number;
  paymentMethod: string;
  paymentStatus: string;
  note?: string;
  staff: StaffResponseDTO;
  orderDetails: OrderDetailResponse[];
}

export interface OrderDetailResponse {
  id: number;
  productDetailId: number;
  quantity: number;
  price: number;
  totalAmount: number;
}

export interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface IPosOrderResponse {
  status: number;
  message: string;
  data: PosOrderResponse;
}

export interface IPosOrderListResponse {
  status: number;
  message: string;
  data: ListOrderPosResponse[];
  pagination: Pagination;
}

export interface IProductDetailPosListResponse {
  status: number;
  message: string;
  data: ProductDetailPosResponse[];
  pagination: Pagination;
}

export interface IProductListResponse {
  status: number;
  message: string;
  data: ProductResponseDTO[];
  pagination: Pagination;
}

export interface IApiStringResponse {
  status: number;
  message: string;
  data: string;
}
