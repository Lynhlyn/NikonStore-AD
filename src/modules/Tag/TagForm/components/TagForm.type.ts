import { EStatusEnumString } from '@/common/enums';

export type TTagFormField = {
  name: string;
  slug: string;
  description?: string;
  status: EStatusEnumString;
};

