import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {ROUTES_API} from "../../config/routesApi";
import {ERRORS} from "../../config/errors";
import {STORE_STATUSES} from "../../config/storeStatuses";
import {httpClient} from "../../utils/httpClient";
import {KEY_LOCAL_STORAGE_IS_DEBUG} from "../../config/config";
import { addNotification } from "./notificationsSlice";
import {IBaseStore, IRootState} from "../store";
import {IKeyNumberStoreObject, IShopProduct} from "../../types";

type IShopProductsStore = IBaseStore & {
  shopProducts: IKeyNumberStoreObject<IShopProduct[]>;
};

const initialState: IShopProductsStore = {
  status: STORE_STATUSES.INITIAL,
  shopProducts: {},
};

export const shopProductsRefreshStore = createAsyncThunk(
  'shopProducts/refreshStore',
  async (_, {rejectWithValue, dispatch}) => {
    try {
      const {data} = await httpClient<IKeyNumberStoreObject<IShopProduct[]>>({
        url: ROUTES_API.SHOPS_PRODUCTS+'?groupBy=products',
        handleAddNotification: (notification => dispatch(addNotification(notification)))
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const shopProductsSlice = createSlice({
  name: 'shopProducts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(shopProductsRefreshStore.pending, (state) => {
        state.status = STORE_STATUSES.LOADING;
        delete state.error;
      })
      .addCase(shopProductsRefreshStore.fulfilled, (state, action) => {
        const data: any = action.payload;
        return {
          ...state,
          status: STORE_STATUSES.COMPLETE,
          shopProducts: data,
        };
      })
      .addCase(shopProductsRefreshStore.rejected, (state, action) => {
        state.status = STORE_STATUSES.ERROR;
        const anyPayload: any = action.payload;
        state.error = anyPayload.message || ERRORS.UNKNOWN_ERROR.message;
        if (!!localStorage.getItem(KEY_LOCAL_STORAGE_IS_DEBUG) && anyPayload) {
          console.error(anyPayload);
        }
      });
  },
});

export const getShopProducts = (state: IRootState) => state.shopProducts.shopProducts;
export const getShopProductsStore = (state: IRootState) => state.shopProducts;


export default shopProductsSlice.reducer;
