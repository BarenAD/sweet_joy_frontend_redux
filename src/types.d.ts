export type IKeyNumberStoreObject<T> = {
  [key: number]: T;
};

export type IKeyStringStoreObject<T> = {
  [key: string]: T;
};

export type IProfile = {
  id: number;
  email: string;
  fio: string;
  phone: string;
  permissions: string[];
};

export type IResponseLogin = IProfile & {
  token: string;
};

export type IProduct = {
  id: number;
  image: string;
  image_mini: string;
  name: string;
  composition: string | null;
  manufacturer: string | null;
  description: string | null;
  product_unit: string | null;
  categories: number[];
};

export type IProductCategory = {
  id: number;
  product_id: number;
  category_id: number;
};

export type ICategory = {
  id: number;
  name: string;
};

export type IShop = {
  id: number;
  address: string;
  phone: string;
  schedule_id: number;
  map_integration: string;
  schedule: ISchedule;
};

export type IShopProduct = {
  id: number;
  shop_id: number;
  product_id: number;
  price: number | null;
  count: number | null;
};

export type IDocument = {
  id: number;
  name: string;
  url: string;
  location?: "main_top_bar_document";
};

export type ISchedule = {
  id: number;
  name: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
  holiday: string;
  particular: string;
}

export type IDocumentLocation = {
  id: number;
  name: string;
  identify: string;
  document_id: number | null;
};

export type IUser = {
  id: number;
  fio: string;
  email: string;
  phone: string;
  note: string;
};

export type IUserRole = {
  id: number;
  user_id: number;
  role_id: number;
};

export type IRole = {
  id: number;
  name: string;
  description: string;
};

export type IRolePermission = {
  id: number;
  role_id: number;
  permission_id: number;
};

export type IPermission = {
  id: number;
  name: string;
  description: string;
  permission: string;
};
