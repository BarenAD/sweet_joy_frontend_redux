import {API_URL} from "./config";

export const ROUTES_API = {
  GET_APP_DATA: `${API_URL}/data`,
  GET_CONFIGURATIONS: `${API_URL}/configurations`,
  LOGIN: `${API_URL}/auth/login`,
  REGISTRATION: `${API_URL}/auth/register`,
  LOGOUT: `${API_URL}/auth/logout`,
  LOGOUT_ALL: `${API_URL}/auth/logout/all`,
};
