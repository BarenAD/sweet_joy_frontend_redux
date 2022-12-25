import {IBaseStore} from "../../redux/store";
import {SITE_CONFIG_IDENTIFIERS} from "../../config/siteConfigIdentifiers";

export type IKeyNumberStoreObject<T> = {
  [key: number]: T;
};

export type IKeyStringStoreObject<T> = {
  [key: string]: T;
};

export type IAppStore = IBaseStore & {
  products: IProduct[];
  categories: ICategory[];
  shops: IShop[];
  shopProducts: IKeyNumberStoreObject<IShopProduct[]>;
  documents: IKeyStringStoreObject<IDocument>;
};

export type IProduct = {
  id: number;
  image: string;
  image_mini: string;
  name: string;
  composition: string;
  manufacturer: string;
  description: string;
  product_unit: string;
  categories: number[];
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
  price: number;
  count: number;
};

export type IDocument = {
  id: number;
  name: string;
  url: string;
  location: "main_top_bar_document";
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
