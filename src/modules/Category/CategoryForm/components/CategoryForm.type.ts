import { EStatusEnumString } from '@/common/enums';

export type TCategoryFormField = {
  name: string;
  parentId?: number;
  description?: string;
  status: EStatusEnumString;
};

