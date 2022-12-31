import {API_URL} from "./config";

export const ROUTES_API = {
  PROFILE_PERMISSIONS: `${API_URL}/profile/permissions`,
  GET_APP_DATA: `${API_URL}/data`,
  GET_CONFIGURATIONS: `${API_URL}/configurations`,
  LOGIN: `${API_URL}/auth/login`,
  REGISTRATION: `${API_URL}/auth/register`,
  LOGOUT: `${API_URL}/auth/logout`,
  LOGOUT_ALL: `${API_URL}/auth/logout/all`,
  MANAGEMENT_CONFIGURATIONS: `${API_URL}/management/configurations/site`,
  MANAGEMENT_CATEGORIES: `${API_URL}/management/categories`,
  MANAGEMENT_SCHEDULES: `${API_URL}/management/schedules`,
  MANAGEMENT_SHOPS: `${API_URL}/management/shops`,
  MANAGEMENT_SHOPS_PRODUCTS: `${API_URL}/management/shops/products`,
  MANAGEMENT_SHOPS_PRODUCTS_WITH_ID: `${API_URL}/management/shops/:shopId/products`,
  MANAGEMENT_PRODUCTS: `${API_URL}/management/products`,
  MANAGEMENT_PRODUCTS_CATEGORIES: `${API_URL}/management/products/categories`,
  MANAGEMENT_DOCUMENTS: `${API_URL}/management/documents`,
  MANAGEMENT_DOCUMENTS_LOCATIONS: `${API_URL}/management/documents/locations`,
};
