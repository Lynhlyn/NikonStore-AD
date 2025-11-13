import { EUserRole } from '@/common/enums';
import { IRouterItem } from '@/common/types/item';
import { routerApp } from '@/router';
import { ISidebarDashboardGroup } from './type';

const ListRouteDashboard: IRouterItem[] = [
  {
    name: 'Trang chủ',
    routerActive: [routerApp.dashboard.dashboard],
    icon: 'Home',
    route: routerApp.dashboard.dashboard,
    type: 'item',
    visibleRoles: [
      EUserRole.ADMIN,
    ],
  },
  {
    name: 'Quản lý sản phẩm',
    routerActive: [
      routerApp.product.list,
      routerApp.product.form,
      routerApp.product.formEdit({ id: ':id' }),
    ],
    icon: 'ShoppingBag',
    route: routerApp.product.list,
    type: 'item',
    visibleRoles: [
      EUserRole.ADMIN,
    ],
  },
  {
    name: 'Quản lý khách hàng',
    routerActive: [
      routerApp.customer.list,
    ],
    icon: 'Users',
    route: routerApp.customer.list,
    type: 'item',
    visibleRoles: [
      EUserRole.ADMIN,
    ],
  },
  {
    name: 'Quản lý nhân viên',
    routerActive: [
      routerApp.staff.list,
      routerApp.staff.form,
      routerApp.staff.formEdit({ id: ':id' }),
    ],
    icon: 'Users',
    route: routerApp.staff.list,
    type: 'item',
    visibleRoles: [
      EUserRole.ADMIN,
    ],
  },
  {
    name: 'Quản lý voucher',
    routerActive: [
      routerApp.voucher.list,
      routerApp.voucher.form,
      routerApp.voucher.formEdit({ id: ':id' }),
      routerApp.voucher.formView({ id: ':id' }),
    ],
    icon: 'Gift',
    route: routerApp.voucher.list,
    type: 'item',
    visibleRoles: [
      EUserRole.ADMIN,
    ],
  },
  {
    name: 'Quản lý template email',
    routerActive: [
      routerApp.templateEmail.list,
      routerApp.templateEmail.new,
      routerApp.templateEmail.edit({ id: ':id' }),
      routerApp.templateEmail.view({ id: ':id' }),
    ],
    icon: 'Mail',
    route: routerApp.templateEmail.list,
    type: 'item',
    visibleRoles: [
      EUserRole.ADMIN,
    ],
  },
  {
    name: 'Quản lý đơn hàng',
    routerActive: [
      routerApp.order.online,
      routerApp.order.offline,
      routerApp.order.history,
      routerApp.order.detail({ id: ':id' }),
      routerApp.order.statusHistory,
    ],
    icon: 'ShoppingCart',
    type: 'group',
    visibleRoles: [
      EUserRole.ADMIN,
    ],
    subsRoute: [
      {
        name: 'Đơn hàng online',
        route: routerApp.order.online,
        routerActive: [
          routerApp.order.online,
          routerApp.order.detail({ id: ':id' }),
        ],
        type: 'item',
        icon: 'Circle',
      },
      {
        name: 'Đơn hàng offline',
        route: routerApp.order.offline,
        routerActive: [
          routerApp.order.offline,
          routerApp.order.detail({ id: ':id' }),
        ],
        type: 'item',
        icon: 'Circle',
      },
      {
        name: 'Lịch sử đơn hàng',
        route: routerApp.order.history,
        routerActive: [
          routerApp.order.history,
        ],
        type: 'item',
        icon: 'Circle',
      },
    ],
  },
  {
    name: 'Quản lý thuộc tính',
    routerActive: [
      routerApp.brand.list,
      routerApp.brand.form,
      routerApp.brand.formEdit({ id: ':id' }),
      routerApp.color.list,
      routerApp.color.form,
      routerApp.color.formEdit({ id: ':id' }),
      routerApp.capacity.list,
      routerApp.capacity.form,
      routerApp.capacity.formEdit({ id: ':id' }),
      routerApp.category.list,
      routerApp.category.form,
      routerApp.category.formEdit({ id: ':id' }),
      routerApp.tag.list,
      routerApp.tag.form,
      routerApp.tag.formEdit({ id: ':id' }),
      routerApp.feature.list,
      routerApp.feature.form,
      routerApp.feature.formEdit({ id: ':id' }),
      routerApp.material.list,
      routerApp.material.form,
      routerApp.material.formEdit({ id: ':id' }),
      routerApp.strapType.list,
      routerApp.strapType.form,
      routerApp.strapType.formEdit({ id: ':id' }),
    ],
    icon: 'ProductAttributeManagement',
    type: 'group',
    visibleRoles: [
      EUserRole.ADMIN,
    ],
    subsRoute: [
      {
        name: 'Quản lý thương hiệu',
        route: routerApp.brand.list,
        routerActive: [
          routerApp.brand.list,
          routerApp.brand.form,
          routerApp.brand.formEdit({ id: ':id' }),
        ],
        type: 'item',
        icon: 'Circle',
      },
      {
        name: 'Quản lý màu sắc',
        route: routerApp.color.list,
        routerActive: [
          routerApp.color.list,
          routerApp.color.form,
          routerApp.color.formEdit({ id: ':id' }),
        ],
        type: 'item',
        icon: 'Circle',
      },
      {
        name: 'Quản lý dung tích',
        route: routerApp.capacity.list,
        routerActive: [
          routerApp.capacity.list,
          routerApp.capacity.form,
          routerApp.capacity.formEdit({ id: ':id' }),
        ],
        type: 'item',
        icon: 'Circle',
      },
      {
        name: 'Quản lý danh mục',
        route: routerApp.category.list,
        routerActive: [
          routerApp.category.list,
          routerApp.category.form,
          routerApp.category.formEdit({ id: ':id' }),
        ],
        type: 'item',
        icon: 'Circle',
      },
      {
        name: 'Quản lý tag',
        route: routerApp.tag.list,
        routerActive: [
          routerApp.tag.list,
          routerApp.tag.form,
          routerApp.tag.formEdit({ id: ':id' }),
        ],
        type: 'item',
        icon: 'Circle',
      },
      {
        name: 'Quản lý tính năng',
        route: routerApp.feature.list,
        routerActive: [
          routerApp.feature.list,
          routerApp.feature.form,
          routerApp.feature.formEdit({ id: ':id' }),
        ],
        type: 'item',
        icon: 'Circle',
      },
      {
        name: 'Quản lý chất liệu',
        route: routerApp.material.list,
        routerActive: [
          routerApp.material.list,
          routerApp.material.form,
          routerApp.material.formEdit({ id: ':id' }),
        ],
        type: 'item',
        icon: 'Circle',
      },
      {
        name: 'Quản lý loại dây đeo',
        route: routerApp.strapType.list,
        routerActive: [
          routerApp.strapType.list,
          routerApp.strapType.form,
          routerApp.strapType.formEdit({ id: ':id' }),
        ],
        type: 'item',
        icon: 'Circle',
      },
    ],
  },
];

const ListRouteDashboardGroup: ISidebarDashboardGroup[] = [
  {
    name: '',
    listRoute: ListRouteDashboard,
  },
];

export { ListRouteDashboard, ListRouteDashboardGroup };

