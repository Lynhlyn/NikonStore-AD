import { EUserRole } from '@/common/enums';
import { IRouterItem } from '@/common/types/item';
import { routerApp } from '@/router';
import { ISidebarDashboardGroup } from './type';
import React from 'react';
import { Home, Package, Circle, ShoppingBag } from 'lucide-react';

const ListRouteDashboard: IRouterItem[] = [
  {
    name: 'Trang chủ',
    routerActive: [routerApp.dashboard.dashboard],
    icon: React.createElement(Home, { className: "w-5 h-5" }),
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
      '/main/products/:id/edit',
    ],
    icon: React.createElement(ShoppingBag, { className: "w-5 h-5" }),
    route: routerApp.product.list,
    type: 'item',
    visibleRoles: [
      EUserRole.ADMIN,
    ],
  },
  {
    name: 'Quản lý thuộc tính',
    routerActive: [
      routerApp.brand.list,
      routerApp.brand.form,
      '/main/brands/:id/edit',
      routerApp.color.list,
      routerApp.color.form,
      '/main/colors/:id/edit',
      routerApp.capacity.list,
      routerApp.capacity.form,
      '/main/capacities/:id/edit',
      routerApp.category.list,
      routerApp.category.form,
      '/main/categories/:id/edit',
      routerApp.tag.list,
      routerApp.tag.form,
      '/main/tags/:id/edit',
      routerApp.feature.list,
      routerApp.feature.form,
      '/main/features/:id/edit',
      routerApp.material.list,
      routerApp.material.form,
      '/main/materials/:id/edit',
      routerApp.strapType.list,
      routerApp.strapType.form,
      '/main/strap-types/:id/edit',
    ],
    icon: React.createElement(Package, { className: "w-5 h-5" }),
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
          '/main/brands/:id/edit',
        ],
        type: 'item',
        icon: React.createElement(Circle, { className: "w-3 h-3" }),
      },
      {
        name: 'Quản lý màu sắc',
        route: routerApp.color.list,
        routerActive: [
          routerApp.color.list,
          routerApp.color.form,
          '/main/colors/:id/edit',
        ],
        type: 'item',
        icon: React.createElement(Circle, { className: "w-3 h-3" }),
      },
      {
        name: 'Quản lý dung tích',
        route: routerApp.capacity.list,
        routerActive: [
          routerApp.capacity.list,
          routerApp.capacity.form,
          '/main/capacities/:id/edit',
        ],
        type: 'item',
        icon: React.createElement(Circle, { className: "w-3 h-3" }),
      },
      {
        name: 'Quản lý danh mục',
        route: routerApp.category.list,
        routerActive: [
          routerApp.category.list,
          routerApp.category.form,
          '/main/categories/:id/edit',
        ],
        type: 'item',
        icon: React.createElement(Circle, { className: "w-3 h-3" }),
      },
      {
        name: 'Quản lý tag',
        route: routerApp.tag.list,
        routerActive: [
          routerApp.tag.list,
          routerApp.tag.form,
          '/main/tags/:id/edit',
        ],
        type: 'item',
        icon: React.createElement(Circle, { className: "w-3 h-3" }),
      },
      {
        name: 'Quản lý tính năng',
        route: routerApp.feature.list,
        routerActive: [
          routerApp.feature.list,
          routerApp.feature.form,
          '/main/features/:id/edit',
        ],
        type: 'item',
        icon: React.createElement(Circle, { className: "w-3 h-3" }),
      },
      {
        name: 'Quản lý chất liệu',
        route: routerApp.material.list,
        routerActive: [
          routerApp.material.list,
          routerApp.material.form,
          '/main/materials/:id/edit',
        ],
        type: 'item',
        icon: React.createElement(Circle, { className: "w-3 h-3" }),
      },
      {
        name: 'Quản lý loại dây đeo',
        route: routerApp.strapType.list,
        routerActive: [
          routerApp.strapType.list,
          routerApp.strapType.form,
          '/main/strap-types/:id/edit',
        ],
        type: 'item',
        icon: React.createElement(Circle, { className: "w-3 h-3" }),
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

