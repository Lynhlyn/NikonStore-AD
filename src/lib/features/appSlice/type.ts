import { EUserRole } from '@/common/enums';

export interface IAppState {
  isOpenSidebar: boolean;
  segment?: EUserRole;
}

