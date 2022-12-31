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

export const filterProducts = (
  shopProducts: IKeyNumberStoreObject<IShopProduct[]>,
  products: IProduct[],
  filters: {
    selectedName?: string;
    selectedShopId?: number | null;
    selectedCategoryIds?: number[];
    isAllOrNothing?: boolean;
    isReverseShopId?: boolean;
  }
): IProduct[] => {
  if (localStorage.getItem(KEY_LOCAL_STORAGE_IS_DEBUG)) {
    console.log('[DEBUG] [RUN] filterProducts');
  }
  return (!filters.selectedName && !filters.selectedShopId && (!filters.selectedCategoryIds || !filters.selectedCategoryIds.length)) ?
    [...products]
    :
    products
      .filter((product) => {
        //фильтрация по имени
        const allowByName: boolean = !filters.selectedName ||
          product.name.toLowerCase().indexOf(filters.selectedName.toLowerCase()) > -1;
        //фильтрация по магазину
        let allowByShop: boolean = (
          !filters.selectedShopId ||
          !!shopProducts[product.id]?.find((findItem) => findItem.shop_id === filters.selectedShopId)
        );
        if (filters?.isReverseShopId) {
          allowByShop = !allowByShop;
        }
        //фильтрация по категориям
        let allowByCategories: boolean = true;
        if (filters.selectedCategoryIds?.length) {
          const intersectionCount: number = product.categories
            //@ts-ignore (filter.selectedCategoryIds is possible undefined, серьёзно????)
            .filter((categoryId) => filters.selectedCategoryIds
                .includes(categoryId)
            )
            .length;
          allowByCategories = filters.isAllOrNothing ?
            intersectionCount === filters.selectedCategoryIds.length
            :
            intersectionCount > 0;
        }
        return allowByName && allowByShop && allowByCategories;
      });
}

export const generateBaseRules = (baseRule: string): string[] => {
  const baseRules = [
    'index',
    'store',
    'update',
    'destroy'
  ];
  return baseRules.map((suffix) => `${baseRule}.${suffix}`);
};

export const checkAllowByPermissions = (permissions: string[], userPermissions: string[]): boolean => {
  if (!permissions.length || userPermissions.includes('*')) {
    return true;
  }
  for(let i = 0; i < permissions.length; i++) {
    if (userPermissions.includes(permissions[i])) {
      return true;
    }
  }
  const preparedPermissions = permissions.reduce<string[]>((result, permission) => {
    const splitted = permission.split('.');
    splitted.pop();
    let prefix = '';
    splitted.forEach((partPermission) => {
      if (prefix.length) {
        prefix += '.';
      }
      prefix += partPermission;
      if (!result.includes(prefix+'.*')) {
        result.push(prefix + '.*');
      }
    });
    return result;
  }, []);
  for(let i = 0; i < preparedPermissions.length; i++) {
    if (userPermissions.includes(preparedPermissions[i])) {
      return true;
    }
  }
  return false;
};
