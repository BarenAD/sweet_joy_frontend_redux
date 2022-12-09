import {IBaseStore} from "../../redux/store";

export type IAppStore = IBaseStore & {
    products: IProduct[];
    categories: ICategory[];
    shops: IShop[];
    shopProducts: IShopProduct[];
    documents: IDocument[];
    configuration: IConfiguration[];
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
    identify: "footer_first" | "footer_second" | "footer_third" | "header_last" | "demo_mode";
    value: string;
};
