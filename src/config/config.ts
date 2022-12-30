export const API_URL: string = 'https://www.products.kemerovo.barenad.ru/api';
export const REQUEST_MODE: RequestMode = 'cors';
export const PRODUCT_CARD_WIDTH: number = 240;
export const COUNT_PRODUCTS_ROWS: number = 10;
export const KEY_LOCAL_STORAGE_AUTHORIZATION_ACCESS_TOKEN: string = "access_token";
export const KEY_LOCAL_STORAGE_AUTHORIZATION_PROFILE: string = "profile";
export const KEY_LOCAL_STORAGE_IS_DEBUG: string = "99c027ab73b0c4c939c40f634d9eac44";
export const NOTIFICATIONS_MAX_COUNT: number = 5;
export const NOTIFICATIONS_LIFE_TIME: number = 5;
export const FORMAT_DATE_NOTIFICATION = 'yyyy-MM-dd HH:mm:ss';
export const MANAGEMENT_COUNT_CATEGORIES_ON_PAGE: number = 30;
export const MANAGEMENT_COUNT_DOCUMENTS_ON_PAGE: number = 30;
export const MANAGEMENT_COUNT_PRODUCTS_ON_PAGE: number = 19;
export const DELAY_APPLIED_FILTERS: number = 5;

export const AUTHOR_CONTACTS: IAuthorContacts = {
  VK: 'https://vk.com/barenad',
};

type IAuthorContacts = {
  VK: string;
};

export const RUS_WEEK_DAYS = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'праздники', 'другое'] as const;
export const WEEK_DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'holiday', 'particular'] as const;
export const WEEK_DAYS_ORDER = [1,2,3,4,5,6,0,7,8] as const;
