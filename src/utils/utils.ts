import {IKeyNumberStoreObject, IProduct, IShopProduct} from "../components/App/appTypes";

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
    shopId?: number,
    categoryIds?: number[],
    allOrNothing?: boolean,
  }
): IKeyNumberStoreObject<IShopProduct[]> => {
  console.log('CALCULATIONS!');
  return !filter.shopId && !filter.categoryIds ?
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
        const product: IProduct | undefined = !filter.categoryIds ?
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
