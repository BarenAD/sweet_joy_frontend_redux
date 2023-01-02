import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {ROUTES_API} from "../../config/routesApi";
import {ERRORS} from "../../config/errors";
import {STORE_STATUSES} from "../../config/storeStatuses";
import {httpClient} from "../../utils/httpClient";
import {KEY_LOCAL_STORAGE_IS_DEBUG} from "../../config/config";
import { addNotification } from "./notificationsSlice";
import {IBaseStore, IRootState} from "../store";
import {IShop} from "../../types";

type IShopsStore = IBaseStore & {
  shops: IShop[];
};

const initialState: IShopsStore = {
  status: STORE_STATUSES.INITIAL,
  shops: [],
};

export const shopsRefreshStore = createAsyncThunk(
  'shops/refreshStore',
  async (_, {rejectWithValue, dispatch}) => {
    try {
      const {data} = await httpClient<IShop[]>({
        url: ROUTES_API.SHOPS+'?withSchedules=1',
        handleAddNotification: (notification => dispatch(addNotification(notification)))
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const shopsSlice = createSlice({
  name: 'shops',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(shopsRefreshStore.pending, (state) => {
        state.status = STORE_STATUSES.LOADING;
        delete state.error;
      })
      .addCase(shopsRefreshStore.fulfilled, (state, action) => {
        const data: any = action.payload;
        return {
          ...state,
          status: STORE_STATUSES.COMPLETE,
          shops: data,
        };
      })
      .addCase(shopsRefreshStore.rejected, (state, action) => {
        state.status = STORE_STATUSES.ERROR;
        const anyPayload: any = action.payload;
        state.error = anyPayload.message || ERRORS.UNKNOWN_ERROR.message;
        if (!!localStorage.getItem(KEY_LOCAL_STORAGE_IS_DEBUG) && anyPayload) {
          console.error(anyPayload);
        }
      });
  },
});

export const getShops = (state: IRootState) => state.shops.shops;
export const getShopsStore = (state: IRootState) => state.shops;


export default shopsSlice.reducer;
