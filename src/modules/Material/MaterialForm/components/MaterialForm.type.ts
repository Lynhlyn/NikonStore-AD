import { EStatusEnumString } from '@/common/enums';

export type TMaterialFormField = {
  name: string;
  description?: string;
  status: EStatusEnumString;
};

