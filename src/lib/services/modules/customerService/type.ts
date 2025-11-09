export interface Customer {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
  status: number | string; // Can be number (0,1,11) or string ("ACTIVE", "INACTIVE", BLOCKED)
  urlImage?: string;
  createdAt: string;
  updatedAt: string;
  isGuest?: boolean;
  provider?: string;
  providerId?: string;
}

export interface CreateCustomerRequest {
  username?: string;
  fullName?: string;
  email: string;
  phoneNumber: string;
  gender?: string;
  dateOfBirth?: string;
  isGuest?: boolean;
  status: number; // 0 = INACTIVE, 1 = ACTIVE
}

export interface UpdateCustomerRequest {
  username?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  gender?: string;
  dateOfBirth?: string;
  isGuest?: boolean;
  status?: number; // 0 = INACTIVE, 1 = ACTIVE, 11 = BLOCKED
}

export interface ICustomerListResponse {
  success: boolean;
  data: Customer[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    size: number;
  };
}

export interface ICustomerResponse {
  success: boolean;
  data: Customer;
}

export enum CustomerStatus {
  INACTIVE = 0,
  ACTIVE = 1,
  BLOCKED = 11,
}

