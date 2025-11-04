import { EStatusEnumString } from '@/common/enums';

export type TStrapeTypeFormField = {
  name: string;
  description?: string | null;
  status: EStatusEnumString;
};

