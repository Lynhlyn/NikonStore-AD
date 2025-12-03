import { EContentType } from '@/lib/services/modules/contentTagService/type';

export type TContentCategoryFormField = {
  name: string;
  slug: string;
  description?: string;
  type: EContentType;
};

