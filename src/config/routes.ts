export type IRoute = {
  path: string;
  link: string;
};

type IRoutes = {
  MAIN: IRoute;
  PRODUCTS: IRoute;
  ABOUT: IRoute;
  CONTACTS: IRoute;
  MANAGEMENT: IRoute;
  AUTH: IRoute;
  REGISTRATION: IRoute;
  MANAGEMENT_ROLES: IRoute;
  MANAGEMENT_ROLES_PERMISSIONS: IRoute;
  MANAGEMENT_USERS: IRoute;
  MANAGEMENT_USERS_ROLES: IRoute;
  MANAGEMENT_PRODUCTS: IRoute;
  MANAGEMENT_CATEGORIES: IRoute;
  MANAGEMENT_SHOPS: IRoute;
  MANAGEMENT_SCHEDULES: IRoute;
  MANAGEMENT_CONFIGURATIONS: IRoute;
  MANAGEMENT_DOCUMENTS: IRoute;
  MANAGEMENT_SHOPS_PRODUCTS: IRoute;
  MANAGEMENT_DOCUMENTS_LOCATIONS: IRoute;
};

export const ROUTES: IRoutes = {
  MAIN: {
    path: '/*',
    link: '/',
  },
  PRODUCTS: {
    path: '/',
    link: '/',
  },
  ABOUT: {
    path: '/about',
    link: '/about',
  },
  CONTACTS: {
    path: '/contacts',
    link: '/contacts',
  },
  MANAGEMENT: {
    path: '/management/*',
    link: '/management',
  },
  AUTH: {
    path: '/auth',
    link: '/auth',
  },
  REGISTRATION: {
    path: '/registration',
    link: '/registration',
  },
  MANAGEMENT_ROLES: {
    path: '/roles',
    link: '/management/roles',
  },
  MANAGEMENT_ROLES_PERMISSIONS: {
    path: '/roles/:roleId/permissions',
    link: '/management/roles/:roleId/permissions',
  },
  MANAGEMENT_USERS: {
    path: '/users',
    link: '/management/users',
  },
  MANAGEMENT_USERS_ROLES: {
    path: '/users/:userId/roles',
    link: '/management/users/:userId/roles',
  },
  MANAGEMENT_PRODUCTS: {
    path: '/products',
    link: '/management/products',
  },
  MANAGEMENT_CATEGORIES: {
    path: '/categories',
    link: '/management/categories',
  },
  MANAGEMENT_SHOPS: {
    path: '/shops',
    link: '/management/shops',
  },
  MANAGEMENT_SHOPS_PRODUCTS: {
    path: '/shops/products',
    link: '/management/shops/products',
  },
  MANAGEMENT_SCHEDULES: {
    path: '/schedules',
    link: '/management/schedules',
  },
  MANAGEMENT_CONFIGURATIONS: {
    path: '/configurations',
    link: '/management/configurations',
  },
  MANAGEMENT_DOCUMENTS: {
    path: '/documents',
    link: '/management/documents',
  },
  MANAGEMENT_DOCUMENTS_LOCATIONS: {
    path: '/documents/locations',
    link: '/management/documents/locations',
  },
};
