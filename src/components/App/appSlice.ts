import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IRootState} from "../../redux/store";
import {
  IAppStore,
  ICategory, IDocument,
  IKeyNumberStoreObject,
  IKeyStringStoreObject,
  IProduct,
  IShop,
  IShopProduct
} from "./appTypes";
import {ROUTES_API} from "../../config/routesApi";
import {ERRORS} from "../../config/errors";
import {STORE_STATUSES} from "../../config/storeStatuses";
import {httpClient} from "../../utils/httpClient";
import { addNotification } from "../common/Notifications/notificationsSlice";
import {KEY_LOCAL_STORAGE_IS_DEBUG} from "../../config/config";

const initialState: IAppStore = {
  status: STORE_STATUSES.INITIAL,
  products: [],
  categories: [],
  shops: [],
  shopProducts: {},
  documents: {},
};

type IResponseRefreshStore = {
  products: IProduct[];
  categories: ICategory[],
  shops: IShop[],
  shopProducts: IKeyNumberStoreObject<IShopProduct[]>;
  documents: IKeyStringStoreObject<IDocument>;
};

export const refreshStore = createAsyncThunk(
  'app/refreshStore',
  async (_, {rejectWithValue, dispatch}) => {
    try {
      const {data} = await httpClient<IResponseRefreshStore>({
        url: ROUTES_API.GET_APP_DATA,
        handleAddNotification: (notification => dispatch(addNotification(notification)))
      });
      return data;
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
      return action.payload;
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
        };
      })
      .addCase(refreshStore.rejected, (state, action) => {
        state.status = STORE_STATUSES.ERROR;
        const anyPayload: any = action.payload;
        state.error = anyPayload.message || ERRORS.UNKNOWN_ERROR.message;
        if (!!localStorage.getItem(KEY_LOCAL_STORAGE_IS_DEBUG) && anyPayload) {
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


export default appSlice.reducer;
