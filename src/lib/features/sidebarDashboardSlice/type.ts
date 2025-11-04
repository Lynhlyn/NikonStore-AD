import type { IRouterItem } from '@/common/types/item';

export interface ISidebarDashboardGroup {
  name: string;
  listRoute: IRouterItem[];
}

export interface ISidebarDashboardState {
  listRoute: ISidebarDashboardGroup[];
}
