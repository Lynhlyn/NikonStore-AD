import { EUserRole } from '@/common/enums';
import { Settings } from 'lucide-react';

export interface IItem<T> {
  value: T;
  label: string;
}

export interface IRouterItem {
  id?: string;
  name: string;
  route?: string;
  query?: string[];
  type?: 'item' | 'group';
  routerActive?: string[];
  icon?: React.ReactNode | string;
  countNotification?: number;
  subsRoute?: IRouterItem[];
  visibleRoles?: EUserRole[];
}

