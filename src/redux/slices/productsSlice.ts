import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {ROUTES_API} from "../../config/routesApi";
import {ERRORS} from "../../config/errors";
import {STORE_STATUSES} from "../../config/storeStatuses";
import {httpClient} from "../../utils/httpClient";
import {KEY_LOCAL_STORAGE_IS_DEBUG} from "../../config/config";
import { addNotification } from "./notificationsSlice";
import {IBaseStore, IRootState} from "../store";
import {ICategory, IKeyNumberStoreObject, IProduct, IProductCategory} from "../../types";

type IProductsStore = IBaseStore & {
  products: IProduct[];
};

const initialState: IProductsStore = {
  status: STORE_STATUSES.INITIAL,
  products: [],
};

export const productsRefreshStore = createAsyncThunk(
  'products/refreshStore',
  async (_, {rejectWithValue, dispatch}) => {
    try {
      const {data} = await httpClient<IProduct[]>({
        url: ROUTES_API.PRODUCTS,
        handleAddNotification: (notification => dispatch(addNotification(notification)))
      })
        .then((response) => {
          dispatch(productsRefreshProductCategories());
          return response;
        });
      return data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const productsRefreshProductCategories = createAsyncThunk(
  'products/refreshProductCategories',
  async (_, {rejectWithValue, dispatch}) => {
    try {
      const {data} = await httpClient<IKeyNumberStoreObject<IProductCategory[]>>({
        url: ROUTES_API.PRODUCTS_CATEGORIES+'?groupBy=products',
        handleAddNotification: (notification => dispatch(addNotification(notification)))
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(productsRefreshStore.pending, (state) => {
        state.status = STORE_STATUSES.LOADING;
        delete state.error;
      })
      .addCase(productsRefreshProductCategories.pending, (state) => {
        state.status = STORE_STATUSES.PARTIALLY_COMPLETED;
        delete state.error;
      })
      .addCase(productsRefreshStore.fulfilled, (state, action) => {
        const data: any = action.payload;
        return {
          ...state,
          status: STORE_STATUSES.PARTIALLY_COMPLETED,
          products: data,
        };
      })
      .addCase(productsRefreshProductCategories.fulfilled, (state, action) => {
        const data: any = action.payload;
        return {
          ...state,
          status: STORE_STATUSES.COMPLETE,
          products: state.products.map((product) => {
            return {
              ...product,
              categories: data[product.id].map((category: ICategory) => category.id) ?? [],
            };
          }),
        };
      })
      .addCase(productsRefreshProductCategories.rejected, (state, action) => {
        state.status = STORE_STATUSES.ERROR;
        const anyPayload: any = action.payload;
        state.error = anyPayload.message || ERRORS.UNKNOWN_ERROR.message;
        if (!!localStorage.getItem(KEY_LOCAL_STORAGE_IS_DEBUG) && anyPayload) {
          console.error(anyPayload);
        }
      })
      .addCase(productsRefreshStore.rejected, (state, action) => {
        state.status = STORE_STATUSES.ERROR;
        const anyPayload: any = action.payload;
        state.error = anyPayload.message || ERRORS.UNKNOWN_ERROR.message;
        if (!!localStorage.getItem(KEY_LOCAL_STORAGE_IS_DEBUG) && anyPayload) {
          console.error(anyPayload);
        }
      });
  },
});

export const getProducts = (state: IRootState) => state.products.products;
export const getProductsStore = (state: IRootState) => state.products;


export default productsSlice.reducer;
