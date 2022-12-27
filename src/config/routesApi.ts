import {API_URL} from "./config";

export const ROUTES_API = {
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
  // MANAGEMENT_SHOPS_PRODUCTS: `${API_URL}/management/shops`,
  MANAGEMENT_PRODUCTS: `${API_URL}/management/products`,
};
