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
  list: `${routerRoot.main}/brands`,
  form: `${routerRoot.main}/brands/new`,
  formEdit: (params: { id: number | string }) => `${routerRoot.main}/brands/${params.id}/edit`,
};

const routerColor = {
  list: `${routerRoot.main}/colors`,
  form: `${routerRoot.main}/colors/new`,
  formEdit: (params: { id: number | string }) => `${routerRoot.main}/colors/${params.id}/edit`,
};

const routerCapacity = {
  list: `${routerRoot.main}/capacities`,
  form: `${routerRoot.main}/capacities/new`,
  formEdit: (params: { id: number | string }) => `${routerRoot.main}/capacities/${params.id}/edit`,
};

const routerCategory = {
  list: `${routerRoot.main}/categories`,
  form: `${routerRoot.main}/categories/new`,
  formEdit: (params: { id: number | string }) => `${routerRoot.main}/categories/${params.id}/edit`,
};

const routerTag = {
  list: `${routerRoot.main}/tags`,
  form: `${routerRoot.main}/tags/new`,
  formEdit: (params: { id: number | string }) => `${routerRoot.main}/tags/${params.id}/edit`,
};

const routerFeature = {
  list: `${routerRoot.main}/features`,
  form: `${routerRoot.main}/features/new`,
  formEdit: (params: { id: number | string }) => `${routerRoot.main}/features/${params.id}/edit`,
};

const routerMaterial = {
  list: `${routerRoot.main}/materials`,
  form: `${routerRoot.main}/materials/new`,
  formEdit: (params: { id: number | string }) => `${routerRoot.main}/materials/${params.id}/edit`,
};

const routerStrapType = {
  list: `${routerRoot.main}/strap-types`,
  form: `${routerRoot.main}/strap-types/new`,
  formEdit: (params: { id: number | string }) => `${routerRoot.main}/strap-types/${params.id}/edit`,
};

const routerProduct = {
  list: `${routerRoot.main}/products`,
  form: `${routerRoot.main}/products/new`,
  formEdit: (params: { id: number | string }) => `${routerRoot.main}/products/${params.id}/edit`,
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
};

export { routerApp };

