import { EUserRole, EStatusEnumString } from '@/common/enums';

export interface Staff {
  id: number;
  username: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  role: string;
  status: EStatusEnumString;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface IStaffListResponse {
  data: Staff[];
  pagination: Pagination;
}

export interface IStaffResponse {
  status: number;
  message: string;
  data: Staff;
}

export interface AddStaffRequest {
  username?: string;
  password?: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  role: EUserRole;
  status: EStatusEnumString;
}

export interface UpdateStaffRequest {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  role: EUserRole;
  status: EStatusEnumString;
}

