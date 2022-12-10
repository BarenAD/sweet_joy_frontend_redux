import {IBaseStore} from "../../redux/store";
import {SITE_CONFIG_IDENTIFIERS} from "../../config/siteConfigIdentifiers";

export type IAppStore = IBaseStore & {
  products: IProduct[];
  categories: ICategory[];
  shops: IShop[];
  shopProducts: {[key: number]: IShopProduct[]};
  documents: {[key: string]: IDocument};
  configuration: {[key: string]: IConfiguration};
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
  schedule_id: string;
  map_integration: string;
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

export type IConfiguration = {
  id: number;
  name: string;
  identify: typeof SITE_CONFIG_IDENTIFIERS[keyof typeof SITE_CONFIG_IDENTIFIERS];
  value: string;
};
