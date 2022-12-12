import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IRootState} from "../../redux/store";
import {IAppStore, ICategory, IKeyNumberStoreObject, IProduct, IShop, IShopProduct} from "./appTypes";
import {API_ROUTES} from "../../config/apiRoutes";
import {ERRORS} from "../../config/errors";
import {APP_DEBUG, REQUEST_MODE} from "../../config/config";
import {STORE_STATUSES} from "../../config/storeStatuses";

const initialState: IAppStore = {
  status: STORE_STATUSES.INITIAL,
  products: [],
  categories: [],
  shops: [],
  shopProducts: {},
  documents: {},
  configuration: {},
};

export const refreshStore = createAsyncThunk(
  'app/refreshStore',
  async (_, {rejectWithValue}) => {
    try {
      const response = await fetch(API_ROUTES.GET_APP_DATA, {
        mode: REQUEST_MODE,
        headers: {
          Accept: 'Application/json',
        }
      });
      const body: any = await response.json();
      if (response.ok) {
        return body;
      }
      throw new Error(body.message || ERRORS.UNKNOWN_ERROR.message);
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppStore: (state, action: PayloadAction<IAppStore>) => {
      state = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshStore.pending, (state) => {
        state.status = STORE_STATUSES.LOADING;
        delete state.error;
      })
      .addCase(refreshStore.fulfilled, (state, action) => {
        const data: any = action.payload;
        return {
          ...state,
          status: STORE_STATUSES.COMPLETE,
          products: data.products,
          categories: data.categories,
          shops: data.shops,
          shopProducts: data.shop_products,
          documents: data.documents,
          configuration: data.site_configurations,
        };
      })
      .addCase(refreshStore.rejected, (state, action) => {
        state.status = STORE_STATUSES.ERROR;
        const anyPayload: any = action.payload;
        state.error = anyPayload.message || ERRORS.UNKNOWN_ERROR.message;
        if (APP_DEBUG && anyPayload) {
          console.error(anyPayload);
        }
      });
  },
});

export const {setAppStore} = appSlice.actions;

export const getAppStoreStatus = (state: IRootState) => state.app.status;
export const getAppStore = (state: IRootState) => state.app;
export const getProducts = (state: IRootState) => state.app.products;
export const getCategories = (state: IRootState) => state.app.categories;
export const getShops = (state: IRootState) => state.app.shops;
export const getShopProducts = (state: IRootState) => state.app.shopProducts;
export const getDocuments = (state: IRootState) => state.app.documents;
export const getConfigurations = (state: IRootState) => state.app.configuration;
export const getShopProductsByFilters = (
  state: IRootState,
  filter: {
    shopId?: number,
    categoryIds?: number[],
    allOrNothing?: boolean,
  }
): IKeyNumberStoreObject<IShopProduct[]> => {
  return !filter.shopId && !filter.categoryIds ?
    {...state.app.shopProducts}
    :
    Object.entries<IShopProduct[]>(state.app.shopProducts)
      .reduce((
        result: IKeyNumberStoreObject<IShopProduct[]>,
        [productID, shopProducts]
      ): IKeyNumberStoreObject<IShopProduct[]> => {
        const numberProductID = parseInt(productID);
        //фильтрация по магазину
        const allowByShop: boolean = !filter.shopId || !!shopProducts
          .find(findShopProducts => findShopProducts.shop_id === filter.shopId);
        //фильтрация по категориям
        const product: IProduct | undefined = !filter.categoryIds ?
          undefined
          :
          state.app.products.find(findProduct => findProduct.id === numberProductID);
        const intersecionCount: number = product ?
          product.categories
            //@ts-ignore
            .filter(categoryId => filter.categoryIds
              .includes(categoryId))
            .length
          :
          0;
        const allowByCategories: boolean = !product || filter.allOrNothing ?
          intersecionCount === filter.categoryIds?.length
          :
          intersecionCount > 0;
        if (allowByShop && allowByCategories) {
          result[numberProductID] = shopProducts;
        }
        return result;
      }, {});
};


export default appSlice.reducer;
