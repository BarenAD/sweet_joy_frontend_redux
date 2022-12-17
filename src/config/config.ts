export const API_URL: string = 'https://www.products.kemerovo.barenad.ru/api';
export const REQUEST_MODE: RequestMode = 'cors';
export const APP_DEBUG: boolean = true;
export const COUNT_PRODUCTS_ON_PAGE: number = 30;
export const KEY_LOCAL_STORAGE_AUTHORIZATION_ACCESS_TOKEN = "access_token";
export const KEY_LOCAL_STORAGE_AUTHORIZATION_PROFILE = "profile";
export const NOTIFICATIONS_MAX_COUNT = 5;
export const NOTIFICATIONS_LIFE_TIME = 5000;
export const FORMAT_DATE_NOTIFICATION = 'yyyy-MM-dd HH:mm:ss';

export const AUTHOR_CONTACTS: IAuthorContacts = {
  VK: 'https://vk.com/barenad',
};

type IAuthorContacts = {
  VK: string;
};

export const RUS_WEEK_DAYS = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'праздники', 'другое'] as const;
export const WEEK_DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'holiday', 'particular'] as const;
export const WEEK_DAYS_ORDER = [1,2,3,4,5,6,0,7,8] as const;
