import { EStatusEnumString } from '@/common/enums/status';

export interface Voucher {
  id: number;
  code: string;
  description?: string;
  quantity: number;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usedCount?: number;
  status: EStatusEnumString;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VoucherWithCustomers extends Voucher {
  assignedCustomers: Array<{
    id: number;
    username?: string;
    email?: string;
    fullName: string;
    phoneNumber: string;
    urlImage?: string;
    dateOfBirth?: string;
    gender?: string;
    isGuest: boolean;
    status: string;
    provider: string;
    createdAt: string;
    updatedAt: string;
  }>;
  totalAssignedCustomers: number;
}

export interface AddVoucherRequest {
  code: string;
  description?: string;
  quantity: number;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  isPublic: boolean;
  customerIds?: number[];
}

export interface UpdateVoucherRequest extends Partial<AddVoucherRequest> {
  id: number;
  status?: EStatusEnumString;
}

export interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface IVoucherListResponse {
  data: Voucher[];
  pagination: Pagination;
}

export interface IVoucherResponse {
  status: number;
  message: string;
  data: Voucher;
}

export interface IVoucherWithCustomersResponse {
  status: number;
  message: string;
  data: VoucherWithCustomers;
}

