const routerAuth = {
  signIn: '/sign-in',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
};

const routerRoot = {
  staff: '/staff',
  main: '/main',
};

const routerDashboard = {
  dashboard: '/',
};

const routerBrand = {
  list: '/brands',
  form: '/brands/new',
  formEdit: (params: { id: number | string }) => `/brands/${params.id}/edit`,
};

const routerColor = {
  list: '/colors',
  form: '/colors/new',
  formEdit: (params: { id: number | string }) => `/colors/${params.id}/edit`,
};

const routerCapacity = {
  list: '/capacities',
  form: '/capacities/new',
  formEdit: (params: { id: number | string }) => `/capacities/${params.id}/edit`,
};

const routerCategory = {
  list: '/categories',
  form: '/categories/new',
  formEdit: (params: { id: number | string }) => `/categories/${params.id}/edit`,
};

const routerTag = {
  list: '/tags',
  form: '/tags/new',
  formEdit: (params: { id: number | string }) => `/tags/${params.id}/edit`,
};

const routerFeature = {
  list: '/features',
  form: '/features/new',
  formEdit: (params: { id: number | string }) => `/features/${params.id}/edit`,
};

const routerMaterial = {
  list: '/materials',
  form: '/materials/new',
  formEdit: (params: { id: number | string }) => `/materials/${params.id}/edit`,
};

const routerStrapType = {
  list: '/strap-types',
  form: '/strap-types/new',
  formEdit: (params: { id: number | string }) => `/strap-types/${params.id}/edit`,
};

const routerProduct = {
  list: '/products',
  form: '/products/new',
  formEdit: (params: { id: number | string }) => `/products/${params.id}/edit`,
};

const routerCustomer = {
  list: '/customers',
};

const routerStaff = {
  list: '/staff',
  form: '/staff/new',
  formEdit: (params: { id: number | string }) => `/staff/${params.id}/edit`,
};

const routerVoucher = {
  list: '/vouchers',
  form: '/vouchers/new',
  formEdit: (params: { id: number | string }) => `/vouchers/${params.id}/edit`,
  formView: (params: { id: number | string }) => `/vouchers/${params.id}/view`,
};

const routerApp = {
  dashboard: routerDashboard,
  auth: routerAuth,
  brand: routerBrand,
  color: routerColor,
  capacity: routerCapacity,
  category: routerCategory,
  tag: routerTag,
  feature: routerFeature,
  material: routerMaterial,
  strapType: routerStrapType,
  product: routerProduct,
  customer: routerCustomer,
  staff: routerStaff,
  voucher: routerVoucher,
};

export { routerApp };

