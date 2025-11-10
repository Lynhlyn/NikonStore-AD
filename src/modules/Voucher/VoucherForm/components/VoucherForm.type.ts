import { EStatusEnumString } from "@/common/enums/status";

export type TVoucherFormField = {
  code: string;
  description?: string;
  quantity: number;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  startDate: Date;
  endDate: Date;
  isPublic: boolean;
  status: EStatusEnumString;
};

