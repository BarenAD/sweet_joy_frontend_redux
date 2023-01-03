import {configureStore, ThunkAction, Action} from "@reduxjs/toolkit";
import metricSlice from "./slices/metricsSlice";
import {STORE_STATUSES} from "../config/storeStatuses";
import authSlice from "./slices/authSlice";
import notificationsSlice from "./slices/notificationsSlice";
import configurationsSlice from "./slices/configurationsSlice";
import productsSlice from "./slices/productsSlice";
import categoriesSlice from "./slices/categoriesSlice";
import shopsSlice from "./slices/shopsSlice";
import shopProductsSlice from "./slices/shopProductsSlice";
import documentsSlice from "./slices/documentsSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    notifications: notificationsSlice,
    metrics: metricSlice,
    configurations: configurationsSlice,
    products: productsSlice,
    categories: categoriesSlice,
    shops: shopsSlice,
    shopProducts: shopProductsSlice,
    documents: documentsSlice,
  },
});

export type IBaseStore = {
  status: typeof STORE_STATUSES[keyof typeof STORE_STATUSES];
  error?: any;
};
export type IAppDispatch = typeof store.dispatch;
export type IRootState = ReturnType<typeof store.getState>;
export type IAppThunk<ReturnType = void> = ThunkAction<ReturnType,
  IRootState,
  unknown,
  Action<string>>;
