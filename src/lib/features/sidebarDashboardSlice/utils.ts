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
      EUserRole.STAFF,
    ],
  },
  {
    name: 'Bán tại quầy',
    routerActive: [
      routerApp.pos.page,
    ],
    icon: 'POS',
    route: routerApp.pos.page,
    type: 'item',
    visibleRoles: [
      EUserRole.ADMIN,
      EUserRole.STAFF,
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
    name: 'Quản lý đơn hàng',
    routerActive: [
      routerApp.order.online,
      routerApp.order.offline,
      routerApp.order.history,
      routerApp.order.detail({ id: ':id' }),
      routerApp.order.statusHistory,
    ],
    icon: 'OrderManagement',
    type: 'group',
    visibleRoles: [
      EUserRole.ADMIN,
      EUserRole.STAFF,
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
        icon: 'Dot',
      },
      {
        name: 'Đơn hàng offline',
        route: routerApp.order.offline,
        routerActive: [
          routerApp.order.offline,
          routerApp.order.detail({ id: ':id' }),
        ],
        type: 'item',
        icon: 'Dot',
      },
      {
        name: 'Lịch sử đơn hàng',
        route: routerApp.order.history,
        routerActive: [
          routerApp.order.history,
        ],
        type: 'item',
        icon: 'Dot',
      },
    ],
  },
  {
    name: 'Quản lý khách hàng',
    routerActive: [
      routerApp.customer.list,
    ],
    icon: 'CustomerManagement',
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
    icon: 'StaffManagement',
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
    icon: 'VoucherManagement',
    route: routerApp.voucher.list,
    type: 'item',
    visibleRoles: [
      EUserRole.ADMIN,
    ],
  },
  {
    name: 'Quản lý khuyến mãi',
    routerActive: [
      routerApp.promotion.list,
      routerApp.promotion.form,
      routerApp.promotion.formEdit({ id: ':id' }),
      routerApp.promotion.formView({ id: ':id' }),
    ],
    icon: 'PromotionManagement',
    route: routerApp.promotion.list,
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
        icon: 'Dot',
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
        icon: 'Dot',
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
        icon: 'Dot',
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
        icon: 'Dot',
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
        icon: 'Dot',
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
        icon: 'Dot',
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
        icon: 'Dot',
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
        icon: 'Dot',
      },
    ],
  },
  {
    name: 'Thống kê',
    routerActive: [routerApp.statistics.list],
    icon: 'StatisticsManagement',
    route: routerApp.statistics.list,
    type: 'item',
    visibleRoles: [
      EUserRole.ADMIN,
    ],
  },
  {
    name: 'Quản lý hệ thống',
    routerActive: [
      routerApp.banner.list,
      routerApp.banner.form,
      routerApp.banner.formEdit({ id: ':id' }),
      routerApp.page.editor({ pageKey: ':pageKey' }),
      routerApp.templateEmail.list,
      routerApp.templateEmail.new,
      routerApp.templateEmail.edit({ id: ':id' }),
      routerApp.templateEmail.view({ id: ':id' }),
      routerApp.contact.list,
      routerApp.contentTag.list,
      routerApp.contentTag.form,
      routerApp.contentTag.formEdit({ id: ':id' }),
      routerApp.contentCategory.list,
      routerApp.contentCategory.form,
      routerApp.contentCategory.formEdit({ id: ':id' }),
      routerApp.blog.list,
      routerApp.blog.new,
      routerApp.blog.edit({ id: ':id' }),
      routerApp.blog.view({ id: ':id' }),
      routerApp.faq.list,
      routerApp.faq.new,
      routerApp.faq.edit({ id: ':id' }),
      routerApp.faq.view({ id: ':id' }),
    ],
    icon: 'Settings',
    type: 'group',
    visibleRoles: [
      EUserRole.ADMIN,
      EUserRole.STAFF,
    ],
    subsRoute: [
      {
        name: 'Quản lý banner',
        route: routerApp.banner.list,
        routerActive: [
          routerApp.banner.list,
          routerApp.banner.form,
          routerApp.banner.formEdit({ id: ':id' }),
        ],
        type: 'item',
        icon: 'Dot',
      },
      {
        name: 'Về chúng tôi',
        route: routerApp.page.editor({ pageKey: 'about-us' }),
        routerActive: [
          routerApp.page.editor({ pageKey: 'about-us' }),
        ],
        type: 'item',
        icon: 'Dot',
      },
      {
        name: 'Chính sách bảo mật',
        route: routerApp.page.editor({ pageKey: 'privacy-policy' }),
        routerActive: [
          routerApp.page.editor({ pageKey: 'privacy-policy' }),
        ],
        type: 'item',
        icon: 'Dot',
      },
      {
        name: 'Điều khoản sử dụng',
        route: routerApp.page.editor({ pageKey: 'terms-of-service' }),
        routerActive: [
          routerApp.page.editor({ pageKey: 'terms-of-service' }),
        ],
        type: 'item',
        icon: 'Dot',
      },
      {
        name: 'Template email',
        route: routerApp.templateEmail.list,
        routerActive: [
          routerApp.templateEmail.list,
          routerApp.templateEmail.new,
          routerApp.templateEmail.edit({ id: ':id' }),
          routerApp.templateEmail.view({ id: ':id' }),
        ],
        type: 'item',
        icon: 'Dot',
      },
      {
        name: 'Liên hệ',
        route: routerApp.contact.list,
        routerActive: [
          routerApp.contact.list,
        ],
        type: 'item',
        icon: 'Dot',
      },
      {
        name: 'Content tag',
        route: routerApp.contentTag.list,
        routerActive: [
          routerApp.contentTag.list,
          routerApp.contentTag.form,
          routerApp.contentTag.formEdit({ id: ':id' }),
        ],
        type: 'item',
        icon: 'Dot',
      },
      {
        name: 'Content category',
        route: routerApp.contentCategory.list,
        routerActive: [
          routerApp.contentCategory.list,
          routerApp.contentCategory.form,
          routerApp.contentCategory.formEdit({ id: ':id' }),
        ],
        type: 'item',
        icon: 'Dot',
      },
      {
        name: 'Blog',
        route: routerApp.blog.list,
        routerActive: [
          routerApp.blog.list,
          routerApp.blog.new,
          routerApp.blog.edit({ id: ':id' }),
          routerApp.blog.view({ id: ':id' }),
        ],
        type: 'item',
        icon: 'Dot',
      },
      {
        name: 'FAQ',
        route: routerApp.faq.list,
        routerActive: [
          routerApp.faq.list,
          routerApp.faq.new,
          routerApp.faq.edit({ id: ':id' }),
          routerApp.faq.view({ id: ':id' }),
        ],
        type: 'item',
        icon: 'Dot',
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

