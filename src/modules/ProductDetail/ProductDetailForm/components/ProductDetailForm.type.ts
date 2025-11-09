import { EStatusEnumString } from '@/common/enums/status';

export type TProductDetailFormField = {
  sku: string;
  stock: number;
  productId: number;
  colorId?: number;
  capacityId?: number;
  price: number;
  status: EStatusEnumString;
};

