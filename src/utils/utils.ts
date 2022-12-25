import {IKeyNumberStoreObject, IProduct, IShopProduct} from "../components/App/appTypes";
import {KEY_LOCAL_STORAGE_IS_DEBUG} from "../config/config";

export type IParseToFormDataProps = {
  [key: string]: {
    type: 'string' | 'json' | 'base';
    value: any;
  }
};

export const parseToFormData = (params: IParseToFormDataProps): FormData => {
  const preparedBodyForRequest = new FormData();
  Object.keys(params).forEach((key) => {
    switch (params[key].type) {
      case "string":
        preparedBodyForRequest.append(key, `${params[key].value}`);
        break;
      case "json":
        preparedBodyForRequest.append(key, JSON.stringify(params[key].value));
        break;
      default:
        preparedBodyForRequest.append(key, params[key].value);
        break;
    }
  });
  return preparedBodyForRequest;
};

export const preparePhoneByMask = (phone: string): string => {
  const matchedPhone = phone.match(/(\d)(\d{3})(\d{3})(\d{2})(\d{2})/);
  if (!matchedPhone) {
    return phone;
  }
  return `+${matchedPhone[1]} (${matchedPhone[2]}) ${matchedPhone[3]}-${matchedPhone[4]}-${matchedPhone[5]}`;
}

export const filterShopProducts = (
  shopProducts: IKeyNumberStoreObject<IShopProduct[]>,
  products: IProduct[],
  filter: {
    shopId?: number | null,
    categoryIds?: number[],
    allOrNothing?: boolean,
  }
): IKeyNumberStoreObject<IShopProduct[]> => {
  if (localStorage.getItem(KEY_LOCAL_STORAGE_IS_DEBUG)) {
    console.log('[DEBUG] [RUN] filterShopProducts');
  }
  return (!filter.shopId && (!filter.categoryIds || !filter.categoryIds.length)) ?
    {...shopProducts}
    :
    Object.entries<IShopProduct[]>(shopProducts)
      .reduce((
        result: IKeyNumberStoreObject<IShopProduct[]>,
        [productId, shopProducts]
      ): IKeyNumberStoreObject<IShopProduct[]> => {
        const numberProductID = parseInt(productId);
        //фильтрация по магазину
        const allowByShop: boolean = !filter.shopId || !!shopProducts
          .find(findShopProducts => findShopProducts.shop_id === filter.shopId);
        //фильтрация по категориям
        const product: IProduct | undefined = (!filter.categoryIds || !filter.categoryIds.length) ?
          undefined
          :
          products.find(findProduct => findProduct.id === numberProductID);
        const intersectionCount: number = product ?
          product.categories
            //@ts-ignore
            .filter(categoryId => filter.categoryIds
              .includes(categoryId))
            .length
          :
          0;
        const allowByCategories: boolean = !product || (
          filter.allOrNothing ?
          intersectionCount === filter.categoryIds?.length
          :
          intersectionCount > 0
        );
        if (allowByShop && allowByCategories) {
          result[numberProductID] = shopProducts;
        }
        return result;
      }, {});
}
