import { EStatusEnumString, EUserRole } from '@/common/enums';

export type TStaffFormField = {
  username?: string;
  password?: string; 
  fullName: string;
  phoneNumber: string;
  email: string;
  role: EUserRole;
  status: EStatusEnumString;
};

