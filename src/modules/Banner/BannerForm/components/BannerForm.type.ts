import { EStatusEnumString } from '@/common/enums';

export type TBannerFormField = {
  name?: string | null;
  description?: string;
  url: string;
  status: EStatusEnumString;
  imageUrl: string;
  position: number;
  displayOrder?: number;
};

