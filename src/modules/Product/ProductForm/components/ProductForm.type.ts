import { EStatusEnumString } from "@/common/enums";

export type TProductFormField = {
  name: string;
  description?: string;
  weight?: number;
  dimensions?: string;
  brandId: number;
  categoryId: number;
  materialId?: number;
  strapTypeId?: number;
  status: EStatusEnumString;
  tagIds?: number[];
  featureIds?: number[];
};

