export interface CustomerVoucherResponseDTO {
    customerId: number;
    customerName: string;
    voucher: VoucherResponseDTO;
    usedAt: string | null;
    used: boolean;
}

export interface CustomerResponseDTO {
    id: number;
    username: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    urlImage?: string;
    dateOfBirth?: string;
    gender?: string;
    isGuest?: boolean;
    status: string;
    provider?: string;
    createdAt: string;
    updatedAt: string;
}

export interface VoucherResponseDTO {
    id: number;
    code: string;
    description: string;
    quantity: number;
    discountType: string;
    discountValue: number;
    minOrderValue: number;
    maxDiscount: number;
    startDate: string;
    endDate: string;
    usedCount: number;
    status: string;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
}

