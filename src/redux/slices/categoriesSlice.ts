import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {ROUTES_API} from "../../config/routesApi";
import {ERRORS} from "../../config/errors";
import {STORE_STATUSES} from "../../config/storeStatuses";
import {httpClient} from "../../utils/httpClient";
import {KEY_LOCAL_STORAGE_IS_DEBUG} from "../../config/config";
import { addNotification } from "./notificationsSlice";
import {IBaseStore, IRootState} from "../store";
import {ICategory} from "../../types";

type ICategoriesStore = IBaseStore & {
  categories: ICategory[];
};

const initialState: ICategoriesStore = {
  status: STORE_STATUSES.INITIAL,
  categories: [],
};

export const categoriesRefreshStore = createAsyncThunk(
  'categories/refreshStore',
  async (_, {rejectWithValue, dispatch}) => {
    try {
      const {data} = await httpClient<ICategory[]>({
        url: ROUTES_API.CATEGORIES,
        handleAddNotification: (notification => dispatch(addNotification(notification)))
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(categoriesRefreshStore.pending, (state) => {
        state.status = STORE_STATUSES.LOADING;
        delete state.error;
      })
      .addCase(categoriesRefreshStore.fulfilled, (state, action) => {
        const data: any = action.payload;
        return {
          ...state,
          status: STORE_STATUSES.COMPLETE,
          categories: data,
        };
      })
      .addCase(categoriesRefreshStore.rejected, (state, action) => {
        state.status = STORE_STATUSES.ERROR;
        const anyPayload: any = action.payload;
        state.error = anyPayload.message || ERRORS.UNKNOWN_ERROR.message;
        if (!!localStorage.getItem(KEY_LOCAL_STORAGE_IS_DEBUG) && anyPayload) {
          console.error(anyPayload);
        }
      });
  },
});

export const getCategories = (state: IRootState) => state.categories.categories;
export const getCategoriesStore = (state: IRootState) => state.categories;


export default categoriesSlice.reducer;
